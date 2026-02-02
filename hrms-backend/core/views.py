from django.http import JsonResponse

def status(request):
    return JsonResponse({
        'message': 'app is running'
    })