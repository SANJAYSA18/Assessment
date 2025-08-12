# cve_app/management/commands/ingest_cves.py.
import requests
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
from cve_app.models import CVE

NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"
RESULTS_PER_PAGE = 2000

class Command(BaseCommand):
    help = 'Fetches CVE data from the NVD API and stores it in the database.'

    def handle(self, *args, **options):
        self.stdout.write("Starting CVE data ingestion...")
        start_index = 0

        while True:
            self.stdout.write(f"Fetching records from index {start_index}...")
            try:
                response = requests.get(
                    NVD_API_URL,
                    params={"resultsPerPage": RESULTS_PER_PAGE, "startIndex": start_index},
                    timeout=30
                )
                response.raise_for_status()
                data = response.json()
            except requests.RequestException as e:
                self.stderr.write(self.style.ERROR(f"API request failed: {e}"))
                break

            vulnerabilities = data.get("vulnerabilities", [])
            if not vulnerabilities:
                self.stdout.write(self.style.SUCCESS("No more vulnerabilities found."))
                break

            for item in vulnerabilities:
                cve_data = item.get("cve", {})
                cve_id = cve_data.get("id")

                description = next((d['value'] for d in cve_data.get('descriptions', []) if d['lang'] == 'en'), "No description available.")

                CVE.objects.update_or_create(
                    cve_id=cve_id,
                    defaults={
                        'published_date': parse_datetime(cve_data.get("published")),
                        'last_modified_date': parse_datetime(cve_data.get("lastModified")),
                        'status': cve_data.get("vulnStatus"),
                        'description': description,
                        'raw_data': cve_data,
                    }
                )

            self.stdout.write(self.style.SUCCESS(f"Processed {len(vulnerabilities)} records."))
            start_index += len(vulnerabilities)

            if len(vulnerabilities) < RESULTS_PER_PAGE:
                break

        self.stdout.write(self.style.SUCCESS("CVE data ingestion complete."))
