document.addEventListener('DOMContentLoaded', () => {
    if (typeof CVE_ID === 'undefined') {
        console.error('CVE_ID not found.');
        return;
    }

    const cveDescription = document.getElementById('cve-description');
    const metricsSection = document.getElementById('metrics-section');
    const cpeTableBody = document.querySelector('#cpe-table tbody');

    async function fetchCveDetail() {
        try {
            const response = await fetch(`/api/cves/${CVE_ID}/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const cve = await response.json();
            renderCveDetails(cve.raw_data);
        } catch (error) {
            console.error('Failed to fetch CVE details:', error);
            document.getElementById('cve-id-header').textContent = 'Error';
            cveDescription.textContent = 'Could not load details for this CVE.';
        }
    }

    function renderCveDetails(cve) {
        const description = cve.descriptions.find(d => d.lang === 'en')?.value || 'No description available.';
        cveDescription.textContent = description;

        renderMetrics(cve.metrics);
        renderCpe(cve.configurations);
    }

    function renderMetrics(metrics) {
        metricsSection.innerHTML = '';
        const v2 = metrics.cvssMetricV2 && metrics.cvssMetricV2[0];
        if (v2) {
            const cvssData = v2.cvssData;
            const html = `
                <h2>CVSS V2 Metrics</h2>
                <p><strong>Severity:</strong> ${v2.baseSeverity} | <strong>Score:</strong> ${cvssData.baseScore}</p>
                <p><strong>Vector:</strong> ${cvssData.vectorString}</p>
                <div class="table-container">
                    <table>
                        <thead><tr><th>Access Vector</th><th>Access Complexity</th><th>Authentication</th><th>Confidentiality</th><th>Integrity</th><th>Availability</th></tr></thead>
                        <tbody><tr><td>${cvssData.accessVector}</td><td>${cvssData.accessComplexity}</td><td>${cvssData.authentication}</td><td>${cvssData.confidentialityImpact}</td><td>${cvssData.integrityImpact}</td><td>${cvssData.availabilityImpact}</td></tr></tbody>
                    </table>
                </div>
                <p><strong>Exploitability Score:</strong> ${v2.exploitabilityScore} | <strong>Impact Score:</strong> ${v2.impactScore}</p>
            `;
            metricsSection.innerHTML += html;
        } else {
             metricsSection.innerHTML = '<h2>Metrics</h2><p>No CVSS V2 data available.</p>';
        }
    }

    function renderCpe(configurations) {
        cpeTableBody.innerHTML = '';
        if (!configurations || configurations.length === 0) {
            cpeTableBody.innerHTML = '<tr><td colspan="3">No configuration data available.</td></tr>';
            return;
        }

        configurations.forEach(config => {
            config.nodes.forEach(node => {
                node.cpeMatch.forEach(cpe => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cpe.criteria}</td>
                        <td>${cpe.matchCriteriaId}</td>
                        <td>${cpe.vulnerable ? 'Yes' : 'No'}</td>
                    `;
                    cpeTableBody.appendChild(row);
                });
            });
        });
    }

    fetchCveDetail();
});
