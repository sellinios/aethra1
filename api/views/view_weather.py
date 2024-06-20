# In api/views/view_weather.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from geography.models import GeographicPlace
from weather.models import GFSForecast
from api.serializers.serializer_weather import GFSForecastSerializer
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance

@api_view(['GET'])
def weather_for_place(request, continent, country, region, subregion, city):
    try:
        place = GeographicPlace.objects.get(
            admin_division__parent__parent__parent__slug=continent,
            admin_division__parent__parent__slug=country,
            admin_division__parent__slug=region,
            admin_division__slug=subregion,
            slug=city
        )

        print(f"Found place: {place.name} at coordinates: ({place.latitude}, {place.longitude})")

        # Fetch the weather data for this place using proximity
        user_location = Point(place.longitude, place.latitude, srid=4326)
        weather_data = GFSForecast.objects.annotate(distance=Distance('location', user_location)).filter(distance__lte=100000)  # 1000 meters radius

        if not weather_data.exists():
            print("No weather data found within 1000 meters radius.")
            return Response([])  # Return empty list if no data

        # Sort the weather data by date and hour
        sorted_weather_data = weather_data.order_by('date', 'hour')

        serializer = GFSForecastSerializer(sorted_weather_data, many=True)
        return Response(serializer.data)

    except GeographicPlace.DoesNotExist:
        return Response({'error': 'Place not found'}, status=404)
    except Exception as e:
        print(f"Error: {e}")
        return Response({'error': str(e)}, status=500)
