from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from employees.models import Employee
from .models import Attendance
from django.db import IntegrityError

# Create your views here.
@csrf_exempt
def mark_attendance(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            employee_id = payload.get('employee_id')
            date = payload.get('date')
            status = payload.get('status')

            if not all([employee_id, date, status]):
                return JsonResponse({
                    'error': 'All fields are required'
                }, status=400)
            if status not in ['PRESENT', 'ABSENT']:
                return JsonResponse({
                    'error': 'Invalid status value'
                }, status=400)
            try:
                attendance_date = datetime.fromisoformat(date.strip()).date()
            except ValueError:
                return JsonResponse({
                    'error': 'Invalid date format (YYYY-MM-DD)'
                }, status=400)
            
            try:
                employee = Employee.objects.get(id=employee_id)
            except Employee.DoesNotExist:
                return JsonResponse({
                    'error': 'Employee not found'
                }, status=404)
            
            attendance = Attendance.objects.create(
                employee=employee,
                date=attendance_date,
                status=status
            )
            return JsonResponse({
                'message': 'Attendance marked'
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid json'
            }, status=400)
        except IntegrityError:
            return JsonResponse({
                'error': 'Attendance already marked for this date'
            }, status=409)
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

def view_attendance(request, emp_id):
    if request.method == 'GET':
        try:
            employee = Employee.objects.get(id=emp_id)
        except Employee.DoesNotExist:
            return JsonResponse({
                'error': 'Employee not found'
            }, status=404)
        attendance = Attendance.objects.filter(employee=employee).order_by('-date')
        data = list(attendance.values(
            'date', 'status'
        ))
        return JsonResponse({
            'employee': employee.full_name,
            'data': data
        }, status=200)
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)