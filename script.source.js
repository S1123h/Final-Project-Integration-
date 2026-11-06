/**
 * Team Pulse — Mini Dashboard
 * Loads static JSON, renders metrics/chart/table, supports filtering/sorting.
 */
(function () {
  'use strict';

  const state = {
    data: [],
    team: 'all',
    status: 'all',
    search: '',
    sortKey: 'name',
    sortDirection: 'asc'
  };

  const statusElement = document.getElementById('data-status');
  const tableBody = document.getElementById('table-body');
  const tableSummary = document.getElementById('table-summary');
  const chartContainer = document.getElementById('chart-container');
  const chartSummary = document.getElementById('chart-summary');

  function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  function getFilteredData() {
    const query = state.search.trim().toLowerCase();

    return state.data.filter((member) => {
      const matchesTeam = state.team === 'all' || member.team === state.team;
      const matchesStatus = state.status === 'all' || member.status === state.status;
      const matchesSearch =
        query === '' ||
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query);

      return matchesTeam && matchesStatus && matchesSearch;
    });
  }

  function sortData(rows) {
    const direction = state.sortDirection === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => {
      const aValue = a[state.sortKey];
      const bValue = b[state.sortKey];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }

      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }

  function renderMetrics(rows) {
    document.getElementById('metric-members').textContent = formatNumber(rows.length);
    document.getElementById('metric-tasks').textContent = formatNumber(
      rows.reduce((total, member) => total + member.tasksCompleted, 0)
    );
    document.getElementById('metric-hours').textContent = formatNumber(
      rows.reduce((total, member) => total + member.hoursLogged, 0)
    );
    document.getElementById('metric-active').textContent = formatNumber(
      rows.filter((member) => member.status === 'Active').length
    );
  }

  function renderChart(rows) {
    const teams = ['Engineering', 'Design', 'Marketing'];
    const totals = teams.map((team) =>
      rows
        .filter((member) => member.team === team)
        .reduce((total, member) => total + member.tasksCompleted, 0)
    );

    const maxValue = Math.max(...totals, 1);
    const width = 640;
    const height = 300;
    const padding = { top: 24, right: 24, bottom: 48, left: 48 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = chartWidth / teams.length - 28;

    const bars = totals
      .map((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding.left + index * (chartWidth / teams.length) + 14;
        const y = padding.top + chartHeight - barHeight;
        const labelX = x + barWidth / 2;

        return `
          <g>
            <title>${teams[index]}: ${value} tasks completed</title>
            <rect class="bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" tabindex="0" role="img" aria-label="${teams[index]} completed ${value} tasks"></rect>
            <text class="bar-label" x="${labelX}" y="${height - padding.bottom + 22}" text-anchor="middle">${teams[index]}</text>
            <text class="bar-value" x="${labelX}" y="${y - 8}" text-anchor="middle">${value}</text>
          </g>`;
      })
      .join('');

    chartContainer.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-summary">
        <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#dbe3ec" stroke-width="2"></line>
        ${bars}
      </svg>`;

    const highest = Math.max(...totals);
    const highestTeam = teams[totals.indexOf(highest)];
    chartSummary.textContent =
      `Engineering completed ${totals[0]} tasks, Design completed ${totals[1]} tasks, and Marketing completed ${totals[2]} tasks. ${highestTeam} has the highest total.`;
  }

  function renderTable(rows) {
    if (rows.length === 0) {
      tableBody.innerHTML =
        '<tr class="empty-row"><td colspan="6">No team members match the selected filters.</td></tr>';
      tableSummary.textContent = '0 team members shown.';
      return;
    }

    tableBody.innerHTML = rows
      .map(
        (member) => `
        <tr>
          <th scope="row">${member.name}</th>
          <td>${member.team}</td>
          <td>${member.role}</td>
          <td class="${member.status === 'Active' ? 'status-active' : 'status-leave'}">${member.status}</td>
          <td>${formatNumber(member.tasksCompleted)}</td>
          <td>${formatNumber(member.hoursLogged)}</td>
        </tr>`
      )
      .join('');

    tableSummary.textContent = `${rows.length} of ${state.data.length} team members shown.`;
  }

  function updateSortIndicators() {
    document.querySelectorAll('.sort-button').forEach((button) => {
      const th = button.closest('th');
      const key = button.dataset.sort;

      if (key === state.sortKey) {
        th.setAttribute('aria-sort', state.sortDirection === 'asc' ? 'ascending' : 'descending');
        button.querySelector('.sort-indicator').textContent =
          state.sortDirection === 'asc' ? '▲' : '▼';
      } else {
        th.setAttribute('aria-sort', 'none');
        button.querySelector('.sort-indicator').textContent = '';
      }
    });
  }

  function render() {
    const filtered = getFilteredData();
    const sorted = sortData(filtered);

    renderMetrics(filtered);
    renderChart(filtered);
    renderTable(sorted);
    updateSortIndicators();
  }

  function bindEvents() {
    document.getElementById('team-filter').addEventListener('change', (event) => {
      state.team = event.target.value;
      render();
    });

    document.getElementById('status-filter').addEventListener('change', (event) => {
      state.status = event.target.value;
      render();
    });

    document.getElementById('search').addEventListener('input', (event) => {
      state.search = event.target.value;
      render();
    });

    document.getElementById('reset-controls').addEventListener('click', () => {
      state.team = 'all';
      state.status = 'all';
      state.search = '';
      state.sortKey = 'name';
      state.sortDirection = 'asc';

      document.getElementById('team-filter').value = 'all';
      document.getElementById('status-filter').value = 'all';
      document.getElementById('search').value = '';

      render();
    });

    document.querySelectorAll('.sort-button').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.sort;

        if (state.sortKey === key) {
          state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortKey = key;
          state.sortDirection = 'asc';
        }

        render();
      });
    });
  }

  async function loadData() {
    try {
      const response = await fetch('data/team-data.json');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Unable to load team data.`);
      }

      state.data = await response.json();

      if (!Array.isArray(state.data) || state.data.length === 0) {
        throw new Error('Team data is empty or invalid.');
      }

      statusElement.textContent = 'Dashboard data loaded successfully.';
      render();
    } catch (error) {
      console.error(error);
      statusElement.textContent = 'Unable to load dashboard data. Please refresh the page.';
      tableBody.innerHTML =
        '<tr class="empty-row"><td colspan="6">Dashboard data could not be loaded.</td></tr>';
      tableSummary.textContent = 'Data unavailable.';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    loadData();
  });
})();
