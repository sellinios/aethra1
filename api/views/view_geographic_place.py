from rest_framework.decorators import api_view
from rest_framework.response import Response
from geography.models import GeographicPlace
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance

@api_view(['GET'])
def nearest_place(request):
    try:
        latitude = request.GET.get('latitude')
        longitude = request.GET.get('longitude')
        user_location = Point(float(longitude), float(latitude), srid=4326)
        nearest_place = GeographicPlace.objects.annotate(distance=Distance('location', user_location)).order_by('distance').first()

        if nearest_place:
            data = {
                "name": nearest_place.name,
                "slug": nearest_place.slug,  # Ensure slug is included
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
                            }
                        }
                    }
                }
            }
            return Response(data)
        else:
            return Response({"error": "No place found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
