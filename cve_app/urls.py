# cve_app/urls.py
from django.urls import path
from . import views

app_name = 'cve_app'

urlpatterns = [
    path('cves/list/', views.cve_list_view, name='cve_list_page'),
    path('cves/<str:cve_id>/', views.cve_detail_view, name='cve_detail_page'),
    path('api/cves/', views.CVEListAPI.as_view(), name='api_cve_list'),
    path('api/cves/<str:cve_id>/', views.CVEDetailAPI.as_view(), name='api_cve_detail'),
]
