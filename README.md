# CVE Dashboard Project

A full-stack web application designed to consume, store, and display cybersecurity vulnerability data from the **National Vulnerability Database (NVD)**.  
It provides a clean user interface to browse and view details of **Common Vulnerabilities and Exposures (CVEs)**.

---

## Features

- **Data Ingestion**: Robust management command to fetch all CVE data from the public NVD API.
- **Data Cleansing & De-duplication**: Ensures data quality by preventing duplicate records and standardizing data types upon ingestion.
- **REST API**: Well-structured API built with Django REST Framework to serve the stored CVE data.
- **Dynamic Frontend**: Interactive UI built with vanilla JavaScript that communicates with the internal REST API.
- **Pagination**: Server-side pagination to handle large datasets efficiently.
- **Sorting**: Server-side sorting for key columns like CVE ID and dates.
- **Admin Interface**: Django admin panel to easily view and manage raw data.

---

## Tech Stack

- **Backend**: Python, Django, Django REST Framework  
- **Database**: SQLite (for development)  
- **Frontend**: HTML, CSS, JavaScript  
- **HTTP Requests**: `requests` library  

---

## Setup and Installation

### 1. Prerequisites
- Python 3.8+
- pip (Python package installer)

### 2. Clone the Repository
```bash
git clone <your-repository-url>
cd cve_project
