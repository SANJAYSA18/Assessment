from django.shortcuts import render
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from .models import CVE
from .serializers import CVEListSerializer, CVEDetailSerializer
from django.utils import timezone
from datetime import timedelta

def cve_list_view(request):
    return render(request, 'cve_app/list.html')

def cve_detail_view(request, cve_id):
    return render(request, 'cve_app/detail.html', {'cve_id': cve_id})

class StandardResultsSetPagination(PageNumberPagination):
    page_size_query_param = 'per_page'
    page_size = 10
    max_page_size = 100

class CVEListAPI(ListAPIView):
    serializer_class = CVEListSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['cve_id', 'published_date', 'last_modified_date', 'status']
    ordering = ['-last_modified_date']

    def get_queryset(self):
        """
        Override to apply filters based on query parameters.
        """
        queryset = CVE.objects.all()
        params = self.request.query_params

        
        cve_id = params.get('cve_id', None)
        if cve_id:
            queryset = queryset.filter(cve_id__icontains=cve_id)

        
        year = params.get('year', None)
        if year:
            queryset = queryset.filter(published_date__year=year)

        
        last_mod_days = params.get('lastModDays', None)
        if last_mod_days and last_mod_days.isdigit():
            days = int(last_mod_days)
            since_date = timezone.now() - timedelta(days=days)
            queryset = queryset.filter(last_modified_date__gte=since_date)

        
        score = params.get('score', None)
        if score:
            try:
                
                queryset = queryset.filter(raw_data__metrics__cvssMetricV2__0__cvssData__baseScore=float(score))
            except (ValueError, TypeError):
                
                pass

        return queryset


class CVEDetailAPI(RetrieveAPIView):
    queryset = CVE.objects.all()
    serializer_class = CVEDetailSerializer
    lookup_field = 'cve_id'

