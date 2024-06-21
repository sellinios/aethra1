from rest_framework.decorators import api_view
from rest_framework.response import Response
from geography.models import GeographicPlace, GeographicDivision
from weather.models import GFSForecast
from api.serializers.serializer_weather_city import GFSForecastCitySerializer
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
def weather_for_city(request, lang_code):
    cities = request.query_params.getlist('cities')
    if not cities:
        return Response({'error': 'No cities provided'}, status=400)

    weather_data = []

    for city_slug in cities:
        try:
            logger.debug(f"Fetching place for slug: {city_slug} and language: {lang_code}")
            places = GeographicPlace.objects.language(lang_code).filter(translations__slug=city_slug)

            if not places.exists():
                logger.warning(f"No places found for slug: {city_slug}")
                continue

            unique_places = {}
            for place in places:
                key = (place.latitude, place.longitude)
                if key not in unique_places:
                    unique_places[key] = place

            place = list(unique_places.values())[0]
            logger.debug(f"Selected Place: {place.name} ({place.latitude}, {place.longitude})")

            user_location = Point(place.longitude, place.latitude, srid=4326)
            forecasts = GFSForecast.objects.annotate(distance=Distance('location', user_location)).order_by(
                'distance').filter(distance__lte=100000)

            if not forecasts.exists():
                logger.debug(f"No forecasts found for place: {place}")
                continue

            serializer = GFSForecastCitySerializer(forecasts, many=True)
            weather_data.append({
                'city': place.safe_translation_getter('name', lang_code, 'en'),
                'forecasts': serializer.data
            })

        except Exception as e:
            logger.error(f"Error fetching weather data for city {city_slug}: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=500)

    return Response(weather_data)
