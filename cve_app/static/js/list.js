document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#cve-table tbody');
    const totalRecordsElem = document.getElementById('total-records');
    const pageInfoElem = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const resultsPerPageSelect = document.getElementById('results-per-page');
    const sortableHeaders = document.querySelectorAll('th.sortable');

    let currentPage = 1;
    let resultsPerPage = 10;
    let currentSort = '-last_modified_date'; // Default sort

    async function fetchCves(page = 1, perPage = 10, ordering = '-last_modified_date') {
        const apiUrl = `/api/cves/?page=${page}&per_page=${perPage}&ordering=${ordering}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            updateTable(data.results);
            updatePagination(data.count, page, perPage, data.previous, data.next);
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

    function updatePagination(totalRecords, page, perPage, prevUrl, nextUrl) {
        totalRecordsElem.textContent = `Total Records: ${totalRecords}`;
        const totalPages = Math.ceil(totalRecords / perPage);
        pageInfoElem.textContent = `Page ${page} of ${totalPages}`;

        prevButton.disabled = !prevUrl;
        nextButton.disabled = !nextUrl;

        prevButton.onclick = () => fetchCves(page - 1, perPage, currentSort);
        nextButton.onclick = () => fetchCves(page + 1, perPage, currentSort);
    }

    function handleSort(e) {
        const newSort = e.target.dataset.sort;

        // If clicking the same header, reverse the sort order
        if (currentSort === newSort) {
            currentSort = `-${newSort}`;
        } else {
            currentSort = newSort;
        }

        // Update visual indicators
        sortableHeaders.forEach(th => {
            th.classList.remove('asc', 'desc');
            if (th.dataset.sort === newSort) {
                th.classList.add(currentSort.startsWith('-') ? 'desc' : 'asc');
            } else if (th.dataset.sort === currentSort.substring(1)) {
                 th.classList.add('desc');
            }
        });

        fetchCves(1, resultsPerPage, currentSort); // Fetch sorted data from page 1
    }

    resultsPerPageSelect.addEventListener('change', (e) => {
        resultsPerPage = parseInt(e.target.value, 10);
        currentPage = 1;
        fetchCves(currentPage, resultsPerPage, currentSort);
    });

    sortableHeaders.forEach(th => th.addEventListener('click', handleSort));

    // Initial load
    fetchCves(currentPage, resultsPerPage, currentSort);
    // Set initial sort indicator
    document.querySelector('[data-sort="last_modified_date"]').classList.add('desc');
});

