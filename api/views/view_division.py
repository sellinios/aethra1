# api/views/view_geographic_place.py (or whatever file you have for views)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from geography.models import GeographicDivision
from api.serializers.serializer_division import GeographicDivisionSerializer

@api_view(['GET'])
def geographic_divisions(request):
    divisions = GeographicDivision.objects.filter(parent__isnull=True)
    serializer = GeographicDivisionSerializer(divisions, many=True)
    return Response(serializer.data)
