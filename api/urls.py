# api/urls.py

from django.urls import path
from api.views.view_weather import weather_for_place
from api.views.view_geographic_place import nearest_place
from api.views.view_urls_places import all_places_with_urls
from api.views.view_weather_cities import weather_for_city
from api.views.view_weather_mountains import weather_for_mountain
from api.views import ExampleApiView  # Import the new view

urlpatterns = [
    path('<str:lang_code>/nearest-place/', nearest_place, name='nearest_place'),
    path('<str:lang_code>/weather/<str:continent>/<str:country>/<str:region>/<str:subregion>/<str:city>/', weather_for_place, name='weather_for_place'),
    path('<str:lang_code>/places-with-urls/', all_places_with_urls, name='places_with_urls'),
    path('<str:lang_code>/weather/cities/', weather_for_city, name='weather_for_city'),
    path('<str:lang_code>/weather/mountains/<str:mountain>/', weather_for_mountain, name='weather_for_mountain'),
    path('example/', ExampleApiView.as_view(), name='example_api'),  # Add this line
]
