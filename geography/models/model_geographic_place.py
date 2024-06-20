from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from parler.models import TranslatableModel, TranslatedFields
from unidecode import unidecode
from .model_geographic_category import GeographicCategory
from .model_geographic_division import GeographicDivision

class GeographicPlace(TranslatableModel):
    id = models.AutoField(primary_key=True)
    translations = TranslatedFields(
        name=models.CharField(max_length=255, null=True, blank=True),
        slug=models.SlugField(max_length=255, blank=True),
    )
    longitude = models.FloatField()
    latitude = models.FloatField()
    elevation = models.FloatField(null=True, blank=True)
    confirmed = models.BooleanField(default=False)
    category = models.ForeignKey(GeographicCategory, on_delete=models.SET_DEFAULT, default=1)
    admin_division = models.ForeignKey(GeographicDivision, on_delete=models.CASCADE, related_name='places')
    location = gis_models.PointField(geography=True, null=True, blank=True)

    class Meta:
        verbose_name = "Geographic Place"
        verbose_name_plural = "Geographic Places"
        indexes = [
            models.Index(fields=['longitude', 'latitude']),
        ]

    def __str__(self):
        return f"{self.safe_translation_getter('name', any_language=True)} ({self.latitude}, {self.longitude})"

    def clean(self):
        if not self.admin_division:
            raise ValidationError('Place must be associated with a GeographicDivision.')

    def save(self, *args, **kwargs):
        self.clean()
        self.location = Point(self.longitude, self.latitude, srid=4326)
        if not self.elevation:
            self.elevation = 0

        for lang_code, _ in self.get_available_languages():
            self.set_current_language(lang_code)
            if not self.safe_translation_getter('name', any_language=True):
                self.name = "To Be Defined"
            if not self.safe_translation_getter('slug', any_language=True):
                self.slug = slugify(unidecode(self.safe_translation_getter('name', any_language=True)))

        super().save(*args, **kwargs)
