# cve_app/models.py
from django.db import models

class CVE(models.Model):
    cve_id = models.CharField(max_length=50, unique=True, db_index=True)
    published_date = models.DateTimeField()
    last_modified_date = models.DateTimeField()
    status = models.CharField(max_length=50)
    description = models.TextField()
    raw_data = models.JSONField()

    # The default ordering is now handled in the API view
    # to allow for more flexible sorting.

    def __str__(self):
        return self.cve_id

