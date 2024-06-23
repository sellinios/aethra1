from rest_framework.decorators import api_view
from rest_framework.response import Response
from geography.models import GeographicPlace
from api.serializers.serializer_urls import GeographicPlaceWithUrlSerializer
from django.utils.translation import gettext as _


@api_view(['GET'])
def all_places_with_urls(request, lang_code):
    try:
        search_query = request.GET.get('search', '')
        if search_query:
            places = GeographicPlace.objects.language(lang_code).filter(translations__name__icontains=search_query)
        else:
            places = GeographicPlace.objects.language(lang_code).all()

        # Prepare serialized data
        serializer = GeographicPlaceWithUrlSerializer(places, many=True)
        return Response(serializer.data)
    except Exception as e:
        # Return the error message in the current language
        return Response({"error": _("An error occurred: {error}").format(error=str(e))}, status=500)
