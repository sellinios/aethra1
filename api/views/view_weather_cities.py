from rest_framework.decorators import api_view
from rest_framework.response import Response
from geography.models import GeographicPlace
from weather.models import GFSForecast
from api.serializers.serializer_weather_cities import GFSForecastCitiesSerializer
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance

@api_view(['GET'])
def weather_for_city(request, lang_code):
    cities = request.query_params.getlist('cities')
    if not cities:
        return Response({'error': 'No cities provided'}, status=400)

    weather_data = []

    for city_slug in cities:
        try:
            place = GeographicPlace.objects.get(slug=city_slug)
            print(f"Processing city: {place.name} ({city_slug})")

            user_location = Point(place.longitude, place.latitude, srid=4326)
            forecasts = GFSForecast.objects.annotate(distance=Distance('location', user_location)).order_by('distance').filter(distance__lte=100000)  # 100 km radius

            if not forecasts.exists():
                print(f"No weather data found for {place.name} ({city_slug})")
                continue

            serializer = GFSForecastCitiesSerializer(forecasts, many=True)
            weather_data.append({
                'city': place.safe_translation_getter('name', lang_code, 'en'),  # Ensure the name is returned in the requested language
                'forecasts': serializer.data
            })

        except GeographicPlace.DoesNotExist:
            print(f"GeographicPlace does not exist for {city_slug}")
            continue
        except Exception as e:
            print(f"Error processing {city_slug}: {str(e)}")
            return Response({'error': str(e)}, status=500)

    return Response(weather_data)
