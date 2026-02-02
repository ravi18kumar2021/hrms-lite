from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .validators import validate_email
from .models import Employee

# Create your views here.
@csrf_exempt
def create_employee(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            employee_id = payload.get('employee_id')
            full_name = payload.get('full_name')
            email = payload.get('email')
            department = payload.get('department')

            if not all([employee_id, full_name, email, department]):
                return JsonResponse({
                    'error': 'All fields are required'
                }, status=400)
            validate_email(email)
            employee = Employee.objects.create(
                employee_id=employee_id,
                full_name=full_name,
                email=email,
                department=department
            )
            return JsonResponse({
                'message': 'Employee created',
                'id': employee.id
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid json'
            }, status=400)
        except ValidationError as e:
            return JsonResponse({
                'error': str(e)
            }, status=400)
        except IntegrityError:
            return JsonResponse({
                'error': 'Employee ID or Email already exists'
            }, status=409)
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

def employee_list(request):
    if request.method == 'GET':
        try:
            employee = Employee.objects.all().order_by('created_at')
            data = list(employee.values(
                'id', 'employee_id', 'full_name', 'email', 'department'
            ))
            return JsonResponse({
                'data': data
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid json'
            }, status=400)
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

@csrf_exempt
def delete_employee(request, id):
    if request.method == 'DELETE':
        try:
            employee = Employee.objects.get(id=id)
            employee.delete()
            return JsonResponse({
                'message': 'Employee deleted'
            }, status=200)
        except Employee.DoesNotExist:
            return JsonResponse({
                'error': 'Employee not found'
            }, status=404)
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)