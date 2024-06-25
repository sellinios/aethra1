from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from geography.models import GeographicPlace, GeographicDivision

class Command(BaseCommand):
    help = 'Correlate places with their respective administrative divisions'

    def handle(self, *args, **kwargs):
        correlated_places_count = 0

        # Fetch all divisions
        divisions = GeographicDivision.objects.all()

        # Filter places where admin_division is the default value
        default_division = GeographicDivision.objects.get(name="Default")  # Adjust this to match your default division identifier
        places_to_correlate = GeographicPlace.objects.filter(admin_division=default_division)

        # Iterate over each place and correlate with a division
        for place in places_to_correlate:
            place_point = Point(place.longitude, place.latitude, srid=4326)

            # Find the division containing the place's point
            for division in divisions:
                if division.geographic_data and division.geographic_data.geometry.contains(place_point):
                    place.admin_division = division
                    place.save()
                    correlated_places_count += 1
                    break  # Exit loop once the division is found

        self.stdout.write(self.style.SUCCESS(
            f"{correlated_places_count} places correlated with their respective administrative divisions."))
