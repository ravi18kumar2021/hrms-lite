from django.urls import path
from . import views

urlpatterns = [
    path('', views.mark_attendance),
    path('<int:emp_id>', views.view_attendance),
]