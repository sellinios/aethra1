import geopandas as gpd
import requests
import zipfile
import os
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import GEOSGeometry
from geography.models import GeographicData

class Command(BaseCommand):
    help = 'Load geographic data from GeoJSON files into the database'

    def handle(self, *args, **kwargs):
        files_info = [
            {"url": "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_GRC_1.json.zip", "file": "gadm41_GRC_1.json"},
            {"url": "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_GRC_2.json.zip", "file": "gadm41_GRC_2.json"},
            {"url": "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_GRC_3.json.zip", "file": "gadm41_GRC_3.json"},
        ]
        extract_path = "data/"

        for file_info in files_info:
            zip_url = file_info['url']
            zip_path = os.path.join(extract_path, os.path.basename(zip_url))

            # Download the zip file
            self.stdout.write(self.style.SUCCESS(f"Downloading {zip_url}..."))
            response = requests.get(zip_url)
            with open(zip_path, 'wb') as file:
                file.write(response.content)

            # Unzip the file
            self.stdout.write(self.style.SUCCESS(f"Unzipping {zip_path}..."))
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)

            # Load the GeoJSON file
            geojson_file = os.path.join(extract_path, file_info['file'])
            self.stdout.write(self.style.SUCCESS(f"Loading data from {geojson_file}..."))
            gdf = gpd.read_file(geojson_file)

            # Print column names to understand the structure
            self.stdout.write(self.style.SUCCESS(f"Columns: {gdf.columns}"))

            # Create and save the GeographicData instances
            for index, row in gdf.iterrows():
                geometry = row['geometry']
                name = row['NAME_3'] if 'NAME_3' in row else row['NAME_2'] if 'NAME_2' in row else row['NAME_1']  # Adjust based on column availability
                gid = row['GID_3'] if 'GID_3' in row else row['GID_2'] if 'GID_2' in row else row['GID_1']  # Adjust based on column availability

                # Convert the Shapely geometry to a GEOSGeometry
                geos_geometry = GEOSGeometry(geometry.wkt)

                # Create and save the GeographicData instance
                geo_data = GeographicData(gid=gid, name=name, geometry=geos_geometry)
                geo_data.save()

            self.stdout.write(self.style.SUCCESS(f"Data from {geojson_file} loaded successfully!"))

        self.stdout.write(self.style.SUCCESS("All geographic data loaded successfully!"))
