# cve_app/serializers.py
from rest_framework import serializers
from .models import CVE

class CVEListSerializer(serializers.ModelSerializer):
    published_date = serializers.DateTimeField(format="%d %b %Y")
    last_modified_date = serializers.DateTimeField(format="%d %b %Y")

    class Meta:
        model = CVE
        fields = ['cve_id', 'published_date', 'last_modified_date', 'status']

class CVEDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CVE
        fields = ['raw_data']
