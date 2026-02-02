from django.urls import path
from . import views

urlpatterns = [
    path('', views.employee_list),
    path('create', views.create_employee),
    path('delete/<int:id>', views.delete_employee),
]