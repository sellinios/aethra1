# serializers.py
from rest_framework import serializers
from geography.models import GeographicDivision

class GeographicDivisionSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = GeographicDivision
        fields = ['name', 'slug', 'level_name', 'children']

    def get_children(self, obj):
        children = GeographicDivision.objects.filter(parent=obj)
        return GeographicDivisionSerializer(children, many=True).data
