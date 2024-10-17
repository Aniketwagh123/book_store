
from django.http import HttpResponse
from django.urls import include, path
def hi(request):
    return HttpResponse("hii")
urlpatterns = [
    path('hi/', hi),
]
