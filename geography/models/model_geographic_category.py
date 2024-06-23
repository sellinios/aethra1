from django.db import models
from parler.models import TranslatableModel, TranslatedFields

class GeographicCategory(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(max_length=255)
    )
    slug = models.SlugField(max_length=255, unique=True)

    def __str__(self):
        return self.safe_translation_getter('name', any_language=True)

    class Meta:
        verbose_name_plural = "Geographic Categories"
