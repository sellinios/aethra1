import logging
import googlemaps
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from geography.models import GeographicPlace
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from unidecode import unidecode
from django.utils.text import slugify

logger = logging.getLogger(__name__)

# Initialize the Google Maps client with your API key
##gmaps = googlemaps.Client(key=settings.GOOGLE_API_KEY)

@api_view(['GET'])
def nearest_place(request, lang_code):
    try:
        latitude = request.GET.get('latitude')
        longitude = request.GET.get('longitude')
        logger.debug(f"Received request for nearest place: latitude={latitude}, longitude={longitude}")
        if not latitude or not longitude:
            logger.error("Latitude and longitude are required")
            return Response({"error": "Latitude and longitude are required"}, status=400)

        user_location = Point(float(longitude), float(latitude), srid=4326)
        nearest_place = GeographicPlace.objects.annotate(distance=Distance('location', user_location)).order_by('distance').first()
        logger.debug(f"Nearest place found: {nearest_place}")

        if nearest_place:
            if not nearest_place.safe_translation_getter('name', any_language=True):
                logger.debug("Nearest place has no name, querying Google Places API")
                places_result = gmaps.places_nearby(location=(latitude, longitude), rank_by='distance', keyword='point of interest')
                if places_result['results']:
                    google_place = places_result['results'][0]
                    place_details = gmaps.place(place_id=google_place['place_id'])

                    nearest_place.set_current_language('en')
                    nearest_place.name = place_details['result']['name']
                    nearest_place.slug = slugify(unidecode(place_details['result']['name']))
                    nearest_place.confirmed = True  # Mark as confirmed
                    nearest_place.save()
                    logger.debug("Nearest place updated with Google Places data and marked as confirmed")

            data = {
                "name": nearest_place.safe_translation_getter('name', lang_code, 'en'),
                "slug": nearest_place.slug,
                "latitude": nearest_place.latitude,
                "longitude": nearest_place.longitude,
                "admin_division": {
                    "slug": nearest_place.admin_division.slug,
                    "parent": {
                        "slug": nearest_place.admin_division.parent.slug,
                        "parent": {
                            "slug": nearest_place.admin_division.parent.parent.slug,
                            "parent": {
                                "slug": nearest_place.admin_division.parent.parent.parent.slug,
                            } if nearest_place.admin_division.parent.parent.parent else None
                        } if nearest_place.admin_division.parent.parent else None
                    } if nearest_place.admin_division.parent else None
                } if nearest_place.admin_division else None
            }
            return Response(data)
        else:
            logger.error("No place found in the database")
            return Response({"error": "No place found"}, status=404)
    except Exception as e:
        logger.error(f"Error in nearest_place view: {str(e)}")
        return Response({"error": str(e)}, status=500)
