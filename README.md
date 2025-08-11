# CVE Dashboard Project

A full-stack web application designed to consume, store, and display cybersecurity vulnerability data from the **National Vulnerability Database (NVD)**.  
It provides a clean user interface to browse and view details of **Common Vulnerabilities and Exposures (CVEs)**.

---

## Features

- **Data Ingestion**: Robust management command to fetch all CVE data from the public NVD API.
- **Data Cleansing & De-duplication**: Ensures data quality by preventing duplicate records and standardizing data types upon ingestion.
- **REST API**: Well-structured API built with Django REST Framework to serve the stored CVE data.
- **Dynamic Frontend**: Interactive UI built with vanilla JavaScript that communicates with the internal REST API.
- **Sorting**: Server-side sorting for key columns like CVE ID and dates.

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
```
### 3. Install Dependencies
```` bash
pip install django djangorestframework requests
````

### 4. Set Up the Database
``` bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Ingest CVE Data
⚠️ This step will take time as it downloads all CVEs from the NVD.
Requires stable internet connection — may be blocked by firewalls/proxies.

``` bash
python manage.py ingest_cves
``` 
### 6. Create an Admin Superuser (Optional)
``` bash
python manage.py createsuperuser
```
Follow the prompts to create your username and password.

### 7. Run the Development Server
``` bash
python manage.py runserver
```
The application will be available at:
http://127.0.0.1:8000/

Usage
Main Page: Navigate to http://127.0.0.1:8000/ — you'll be redirected to the CVE list page.

View Details: Click on a row in the table to view details for that CVE.


<img width="1920" height="1025" alt="image" src="https://github.com/user-attachments/assets/19a8bb17-15ca-4b4c-bc75-8ee3fae9d0c3" />


<img width="1920" height="1025" alt="image" src="https://github.com/user-attachments/assets/5e042ec6-c3b3-4911-83bf-712c28c9083a" />

