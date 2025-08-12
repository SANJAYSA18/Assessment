# cve_app/views.py
from django.shortcuts import render
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from .models import CVE
from .serializers import CVEListSerializer, CVEDetailSerializer

def cve_list_view(request):
    return render(request, 'cve_app/list.html')

def cve_detail_view(request, cve_id):
    return render(request, 'cve_app/detail.html', {'cve_id': cve_id})

class StandardResultsSetPagination(PageNumberPagination):
    page_size_query_param = 'per_page'
    page_size = 10
    max_page_size = 100

class CVEListAPI(ListAPIView):
    queryset = CVE.objects.all()
    serializer_class = CVEListSerializer
    pagination_class = StandardResultsSetPagination
    
    filter_backends = [OrderingFilter]
    
    ordering_fields = ['cve_id', 'published_date', 'last_modified_date', 'status']
    
    ordering = ['-last_modified_date']

class CVEDetailAPI(RetrieveAPIView):
    queryset = CVE.objects.all()
    serializer_class = CVEDetailSerializer
    lookup_field = 'cve_id'

