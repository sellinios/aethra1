from django.contrib import admin
from django.utils.text import slugify
from parler.admin import TranslatableAdmin
from .models.model_geographic_place import GeographicPlace
from .models.model_geographic_category import GeographicCategory
from .models.model_geographic_division import GeographicDivision

class GeographicPlaceAdmin(TranslatableAdmin):
    list_display = ('name', 'longitude', 'latitude', 'elevation', 'confirmed', 'category', 'admin_division')
    search_fields = ('translations__name', 'translations__slug', 'category__name', 'admin_division__name')
    list_filter = ('confirmed', 'category', 'admin_division')

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

class GeographicDivisionAdmin(admin.ModelAdmin):
    list_display = ('name', 'level_name', 'parent')
    search_fields = ('name', 'slug', 'level_name', 'parent__name')
    list_filter = ('level_name', 'parent')

admin.site.register(GeographicPlace, GeographicPlaceAdmin)
admin.site.register(GeographicCategory)
admin.site.register(GeographicDivision, GeographicDivisionAdmin)
