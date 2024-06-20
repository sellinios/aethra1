# geography/models/model_geographic_category.py
from django.db import models


class GeographicCategory(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Geographic Categories"
