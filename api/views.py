from django.http import JsonResponse
from django.views import View

class ExampleApiView(View):
    def get(self, request, *args, **kwargs):
        try:
            data = {"message": "Success"}
            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
