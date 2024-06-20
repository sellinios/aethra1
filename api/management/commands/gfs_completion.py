import os
import pygrib
import logging
import numpy as np
from datetime import datetime, timezone, timedelta
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point as GEOSPoint
from weather.models import GFSParameter, GFSForecast
from geography.models import GeographicPlace
from concurrent.futures import ThreadPoolExecutor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def standardize_param_key(param):
    """Standardize the parameter key for consistent comparison."""
    return (param.number, param.level_layer, param.parameter.lower(), param.description.lower())

def extract_forecast_details_from_filename(filename):
    """Extract forecast details from the filename."""
    try:
        base_name = os.path.basename(filename)
        parts = base_name.split('_')

        if len(parts) == 4 and parts[0] == 'gfs':
            date_str = parts[1]
            cycle_str = parts[2]
            forecast_hour_str = parts[3].split('.')[0]

            valid_datetime = datetime.strptime(f"{date_str}{cycle_str}", "%Y%m%d%H").replace(tzinfo=timezone.utc)
            forecast_hour = int(forecast_hour_str)
            forecast_datetime = valid_datetime + timedelta(hours=forecast_hour)

            return valid_datetime, forecast_hour, forecast_datetime

        elif len(parts) == 5 and parts[0] == 'filtered':
            date_str = parts[2]
            hour_str = parts[3]
            forecast_hour = int(parts[4].split('.')[0])  # Extract forecast hour
            valid_datetime = datetime.strptime(f"{date_str}{hour_str}", "%Y%m%d%H").replace(tzinfo=timezone.utc)
            forecast_datetime = valid_datetime + timedelta(hours=forecast_hour)

            return valid_datetime, forecast_hour, forecast_datetime

        else:
            raise ValueError(f"Invalid file format: {base_name}")

        return valid_datetime, forecast_hour, forecast_datetime
    except ValueError as e:
        logger.error(f"Error extracting details from filename {filename}: {e}")
        return None, None, None

def bulk_import_forecast_data(forecast_data_dict):
    try:
        forecast_data = [
            GFSForecast(
                latitude=data['latitude'],
                longitude=data['longitude'],
                date=data['date'],
                hour=data['hour'],
                utc_cycle_time=data['utc_cycle_time'],
                forecast_data=data['forecast_data'],
                location=GEOSPoint(data['longitude'], data['latitude'])
            ) for data in forecast_data_dict.values()
        ]
        GFSForecast.objects.bulk_create(forecast_data, batch_size=1000)
        logger.info("Bulk inserted %d records", len(forecast_data))
    except Exception as e:
        logger.error(f"Error during bulk insert: {e}")

def round_to_nearest_0_25(value):
    return round(value * 4) / 4

def get_relevant_places():
    places = GeographicPlace.objects.all()
    relevant_places = {(round_to_nearest_0_25(place.location.y), round_to_nearest_0_25(place.location.x)) for place in places}
    return relevant_places

def process_grib_message(grib, valid_datetime, forecast_datetime, relevant_places, forecast_data_dict):
    data = grib.values
    lats, lons = grib.latlons()
    param_name = f"{grib.parameterName.lower().replace(' ', '_')}_level_{grib.level}_{grib.typeOfLevel}"

    for lat, lon, value in zip(lats.flatten(), lons.flatten(), data.flatten()):
        if isinstance(value, np.ma.core.MaskedConstant):
            value = None

        rounded_lat = round_to_nearest_0_25(lat)
        rounded_lon = round_to_nearest_0_25(lon)

        if (rounded_lat, rounded_lon) in relevant_places:
            key = (rounded_lat, rounded_lon, str(forecast_datetime.date()), str(forecast_datetime.hour), str(valid_datetime.hour))
            if key not in forecast_data_dict:
                forecast_data_dict[key] = {
                    'latitude': rounded_lat,
                    'longitude': rounded_lon,
                    'date': str(forecast_datetime.date()),
                    'hour': str(forecast_datetime.hour),
                    'utc_cycle_time': str(valid_datetime.hour),
                    'forecast_data': {}
                }
            forecast_data_dict[key]['forecast_data'][param_name] = value

def filter_grib_file(file_path, new_file_path, enabled_param_keys):
    try:
        valid_datetime, forecast_hour, forecast_datetime = extract_forecast_details_from_filename(file_path)
        if valid_datetime is None or forecast_hour is None or forecast_datetime is None:
            logger.error(f"Could not extract datetime details from filename: {file_path}")
            return

        with pygrib.open(file_path) as grbs, open(new_file_path, 'wb') as new_grib_file:
            for grb in grbs:
                param_key = (grb.paramId, grb.typeOfFirstFixedSurface, grb.shortName.lower(), grb.name.lower())
                # Check if the parameter matches the enabled parameters by number, parameter name, or description
                if (grb.paramId in [key[0] for key in enabled_param_keys] or
                        grb.shortName.lower() in [key[2] for key in enabled_param_keys] or
                        grb.name.lower() in [key[3] for key in enabled_param_keys]):
                    new_grib_file.write(grb.tostring())
                    logger.info(
                        f'Saved message: Parameter: {grb.shortName}, Level: {grb.level}, Type of Level: {grb.typeOfFirstFixedSurface}, '
                        f'Valid datetime: {valid_datetime}, Forecast datetime: {forecast_datetime}')
                else:
                    logger.debug(
                        f'Skipping message: Parameter: {grb.shortName}, Level: {grb.level}, Type of Level: {grb.typeOfFirstFixedSurface}')
    except Exception as e:
        logger.error(f'Error processing file {file_path}: {e}')

def parse_and_import_gfs_data(file_path):
    logger.info("Starting to parse GFS data from %s.", file_path)

    valid_datetime, forecast_hour, forecast_datetime = extract_forecast_details_from_filename(file_path)
    if valid_datetime is None or forecast_hour is None or forecast_datetime is None:
        logger.error("Could not extract datetime details from filename: %s", file_path)
        return

    relevant_places = get_relevant_places()
    if not relevant_places:
        logger.error("No relevant places found.")
        return

    forecast_data_dict = {}
    try:
        with pygrib.open(file_path) as gribs:
            total_messages = gribs.messages
            logger.info("Total number of messages in the GRIB file: %d", total_messages)

            with ThreadPoolExecutor() as executor:
                futures = []
                for i, grib in enumerate(gribs, start=1):
                    logger.info(
                        "Processing message %d of %d. Parameter: %s, Level: %d, Type of Level: %s",
                        i, total_messages, grib.parameterName, grib.level, grib.typeOfLevel
                    )
                    logger.info("Valid datetime is %s (UTC)", valid_datetime.isoformat())

                    futures.append(
                        executor.submit(process_grib_message, grib, valid_datetime, forecast_datetime, relevant_places, forecast_data_dict))

                for future in futures:
                    future.result()

    except Exception as e:
        logger.error("Error processing GRIB file %s: %s", file_path, e)
        return

    bulk_import_forecast_data(forecast_data_dict)

    logger.info("Finished parsing GFS data from %s.", file_path)

class Command(BaseCommand):
    help = 'Filter, parse, and import GFS data into the database'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to the GRIB2 file')

    def handle(self, *args, **options):
        logger.info("Starting the GFS data import process.")

        file_path = options['file']
        data_folder = '/home/sellinios/aethra/data'

        # Fetch enabled parameters from the database
        enabled_parameters = GFSParameter.objects.filter(enabled=True)

        if not enabled_parameters.exists():
            logger.warning("No enabled parameters found in the database.")
            return

        # Create a set of standardized enabled parameters for quick lookup
        enabled_param_keys = {standardize_param_key(param) for param in enabled_parameters}

        # Determine the latest folder based on date and cycle
        latest_folder = None
        latest_datetime = None
        for folder_name in os.listdir(data_folder):
            folder_path = os.path.join(data_folder, folder_name)
            if os.path.isdir(folder_path):
                try:
                    # Extract datetime from folder name
                    folder_datetime = datetime.strptime(folder_name, '%Y%m%d_%H').replace(tzinfo=timezone.utc)
                    if latest_datetime is None or folder_datetime > latest_datetime:
                        latest_datetime = folder_datetime
                        latest_folder = folder_path
                except ValueError:
                    logger.error(f"Invalid folder format: {folder_name}")
                    continue

        if latest_folder is None:
            logger.error('No valid GFS folders found in the data directory.')
            return

        logger.info(f"Processing files from the latest folder: {latest_folder}")

        # Process files in the latest folder
        list_of_files = [os.path.join(latest_folder, file) for file in os.listdir(latest_folder) if file.endswith('.grib2')]

        if not list_of_files:
            logger.error('No GFS files found in the latest data directory.')
            return

        list_of_files.sort()

        for file_path in list_of_files:
            try:
                filtered_file_path = os.path.join(os.path.dirname(file_path), f'filtered_{os.path.basename(file_path)}')
                filter_grib_file(file_path, filtered_file_path, enabled_param_keys)
                parse_and_import_gfs_data(filtered_file_path)
            except Exception as e:
                logger.error("Error processing file %s: %s", file_path, e)

        logger.info("GFS data import process completed for all files.")

        logger.info("All files processed.")
