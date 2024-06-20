# api/views/view_weather_mountains.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from api.serializers.serializer_weather_mountains import GFSForecastMountainsSerializer

@api_view(['GET'])
def weather_for_mountain(request, lang_code, mountain):
    try:
        api_url = f"https://kairos.gr/api/weather/mountains/{mountain}"
        response = requests.get(api_url)
        response.raise_for_status()
        weather_data = response.json()

        for forecast in weather_data['weather']:
            temperature_kelvin = forecast['forecast_data'].get('temperature_level_2_heightAboveGround')
            if temperature_kelvin is not None:
                forecast['forecast_data']['temperature_level_2_heightAboveGround'] = temperature_kelvin - 273.15

        serializer = GFSForecastMountainsSerializer(data=weather_data['weather'], many=True)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    except requests.exceptions.RequestException as e:
        return Response({'error': str(e)}, status=500)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
