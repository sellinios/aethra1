from django.contrib import admin
from django.utils.text import slugify
from parler.admin import TranslatableAdmin
from unidecode import unidecode
from django.conf import settings
from django.utils import timezone
from .models.model_geographic_place import GeographicPlace
from .models.model_geographic_geocode import GeocodeResult
from .models.model_geographic_category import GeographicCategory
from .models.model_geographic_division import GeographicDivision
from .models.model_geographic_data import GeographicData  # Assuming this is the correct import

import googlemaps

# Initialize the Google Maps client with your API key
gmaps = googlemaps.Client(key=settings.GOOGLE_API_KEY)

@admin.action(description='Update elevation, name, and municipality')
def update_elevation_and_name(modeladmin, request, queryset):
    for place in queryset:
        try:
            now = timezone.now()
            geocode_record, created = GeocodeResult.objects.get_or_create(geographic_place=place)
            needs_update = not geocode_record.geocode_last_updated or (now - geocode_record.geocode_last_updated).days > 30  # Update if older than 30 days

            if needs_update:
                # Get elevation
                elevation_result = gmaps.elevation((place.latitude, place.longitude))
                if elevation_result and 'elevation' in elevation_result[0]:
                    place.elevation = round(elevation_result[0]['elevation'], 2)  # Round elevation to 2 decimal places

                # Get place details
                places_result = gmaps.places_nearby(location=(place.latitude, place.longitude), rank_by='distance', keyword='point of interest')
                if places_result['results']:
                    google_place = places_result['results'][0]
                    place_details = gmaps.place(place_id=google_place['place_id'])
                    if 'result' in place_details and 'name' in place_details['result']:
                        place_name = place_details['result']['name']
                        for lang_code in place.get_available_languages():
                            place.set_current_language(lang_code)
                            place.name = place_name
                            place.slug = slugify(unidecode(place_name))
                        place.confirmed = True

                # Check for the correct municipality using Google Maps Geocoding API
                geocode_result = gmaps.reverse_geocode((place.latitude, place.longitude))
                if geocode_result:
                    geocode_record.geocode_result = geocode_result  # Store the full geocode result
                    geocode_record.geocode_last_updated = now  # Update the timestamp
                    geocode_record.save()
                    found_municipality = False
                    for component in geocode_result[0]['address_components']:
                        if 'locality' in component['types']:  # Check for locality
                            municipality_name = component['long_name']
                            try:
                                municipality = GeographicDivision.objects.get(
                                    models.Q(name=municipality_name) |
                                    models.Q(name_variations__contains=[municipality_name])
                                )
                                place.admin_division = municipality
                                found_municipality = True
                                break
                            except GeographicDivision.DoesNotExist:
                                modeladmin.message_user(request, f"Municipality {municipality_name} not found in the database.", level='warning')

                    if not found_municipality:
                        # Log the entire geocode result for debugging
                        modeladmin.message_user(request, f"No locality found in geocode result for place: {place.name}. Full geocode result: {geocode_result}", level='warning')

            # Save the updated place
            place.save()
            modeladmin.message_user(request, f"Updated place: {place.name}")
        except Exception as e:
            modeladmin.message_user(request, f"Error updating place: {str(e)}", level='error')

@admin.register(GeographicPlace)
class GeographicPlaceAdmin(TranslatableAdmin):
    list_display = ('name', 'longitude', 'latitude', 'elevation', 'confirmed', 'category', 'admin_division')
    search_fields = ('translations__name', 'translations__slug', 'category__translations__name', 'admin_division__name')
    list_filter = ('confirmed', 'category', 'admin_division')
    actions = [update_elevation_and_name]

    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'longitude', 'latitude', 'elevation', 'confirmed', 'category', 'admin_division', 'location')
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.safe_translation_getter('name', any_language=True):
            obj.set_current_language('en')  # Assuming 'en' is a default language, adjust if necessary
            obj.name = "To Be Defined"
        if not obj.safe_translation_getter('slug', any_language=True):
            obj.slug = slugify(obj.name)
        super().save_model(request, obj, form, change)

@admin.register(GeographicCategory)
class GeographicCategoryAdmin(TranslatableAdmin):
    list_display = ('name', 'slug')
    search_fields = ('translations__name',)

    fieldsets = (
        (None, {
            'fields': ('name', 'slug')
        }),
    )

@admin.register(GeographicDivision)
class GeographicDivisionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'level_name', 'parent', 'geographic_data_display')
    search_fields = ('name', 'slug', 'level_name', 'parent__name')
    list_filter = ('level_name', 'parent')

    def geographic_data_display(self, obj):
        return obj.geographic_data
    geographic_data_display.short_description = 'Geographic Data'
