document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements for table and pagination
    const tableBody = document.querySelector('#cve-table tbody');
    const totalRecordsElem = document.getElementById('total-records');
    const pageInfoElem = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const resultsPerPageSelect = document.getElementById('results-per-page');
    const sortableHeaders = document.querySelectorAll('th.sortable');

    // DOM Elements for filtering
    const filterCveIdInput = document.getElementById('filter-cve-id');
    const filterYearInput = document.getElementById('filter-year');
    const filterScoreInput = document.getElementById('filter-score');
    const filterDaysInput = document.getElementById('filter-days');
    const filterBtn = document.getElementById('filter-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // State variables
    let currentPage = 1;
    let resultsPerPage = 10;
    let currentSort = '-last_modified_date';
    let currentFilters = {};

    async function fetchCves() {
        // Build the query parameters
        const params = new URLSearchParams({
            page: currentPage,
            per_page: resultsPerPage,
            ordering: currentSort,
        });

        // Add filter values to the parameters if they exist
        Object.keys(currentFilters).forEach(key => {
            if (currentFilters[key]) {
                params.append(key, currentFilters[key]);
            }
        });

        const apiUrl = `/api/cves/?${params.toString()}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            updateTable(data.results);
            updatePagination(data.count, data.previous, data.next);
        } catch (error) {
            console.error('Failed to fetch CVEs:', error);
            tableBody.innerHTML = '<tr><td colspan="5">Failed to load data. Please try again later.</td></tr>';
        }
    }

    function updateTable(cves) {
        tableBody.innerHTML = '';
        if (cves.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No records found.</td></tr>';
            return;
        }
        cves.forEach(cve => {
            const row = document.createElement('tr');
            row.dataset.cveId = cve.cve_id;
            row.innerHTML = `
                <td>${cve.cve_id}</td>
                <td>cve@mitre.org</td>
                <td>${cve.published_date}</td>
                <td>${cve.last_modified_date}</td>
                <td>${cve.status}</td>
            `;
            row.addEventListener('click', () => {
                window.location.href = `/cves/${row.dataset.cveId}/`;
            });
            tableBody.appendChild(row);
        });
    }

    function updatePagination(totalRecords, prevUrl, nextUrl) {
        totalRecordsElem.textContent = `Total Records: ${totalRecords}`;
        const totalPages = Math.ceil(totalRecords / resultsPerPage);
        pageInfoElem.textContent = `Page ${currentPage} of ${totalPages}`;

        prevButton.disabled = !prevUrl;
        nextButton.disabled = !nextUrl;
    }

    function applyFilters() {
        currentFilters = {
            cve_id: filterCveIdInput.value,
            year: filterYearInput.value,
            score: filterScoreInput.value,
            lastModDays: filterDaysInput.value,
        };
        currentPage = 1; // Reset to first page when filters change
        fetchCves();
    }

    function clearFilters() {
        filterCveIdInput.value = '';
        filterYearInput.value = '';
        filterScoreInput.value = '';
        filterDaysInput.value = '';
        applyFilters(); // Re-fetch with empty filters
    }

    // --- Event Listeners ---
    filterBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchCves();
        }
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        fetchCves();
    });

    resultsPerPageSelect.addEventListener('change', (e) => {
        resultsPerPage = parseInt(e.target.value, 10);
        currentPage = 1;
        fetchCves();
    });

    sortableHeaders.forEach(th => {
        th.addEventListener('click', (e) => {
            const newSort = e.target.dataset.sort;
            if (currentSort === newSort) {
                currentSort = `-${newSort}`;
            } else {
                currentSort = newSort;
            }
            sortableHeaders.forEach(header => header.classList.remove('asc', 'desc'));
            e.target.classList.add(currentSort.startsWith('-') ? 'desc' : 'asc');
            currentPage = 1;
            fetchCves();
        });
    });

    // Initial load
    fetchCves();
    document.querySelector('[data-sort="last_modified_date"]').classList.add('desc');
});

