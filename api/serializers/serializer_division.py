from rest_framework import serializers
from geography.models import GeographicPlace, GeographicDivision

class GeographicDivisionSerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField()

    class Meta:
        model = GeographicDivision
        fields = ['slug', 'parent']

    def get_parent(self, obj):
        if obj.parent:
            return GeographicDivisionSerializer(obj.parent).data
        return None

class GeographicPlaceSerializer(serializers.ModelSerializer):
    admin_division = GeographicDivisionSerializer()

    class Meta:
        model = GeographicPlace
        fields = ['name', 'latitude', 'longitude', 'slug', 'admin_division']

class GreekMunicipalitySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = GeographicDivision
        fields = ['name', 'slug', 'level_name', 'children']

    def get_children(self, obj):
        children = GeographicDivision.objects.filter(parent=obj)
        return GreekMunicipalitySerializer(children, many=True).data
