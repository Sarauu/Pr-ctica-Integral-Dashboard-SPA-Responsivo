
const ServersModule = (function () {
  // Base de datos simulada en memoria
  let servers = [
    {
      id: 'srv-us-east-101',
      name: 'k8s-master-node-01',
      region: 'us-east-1 (N. Virginia)',
      ip: '10.0.12.44',
      os: 'Ubuntu 24.04 LTS',
      status: 'online',
      statusLabel: 'En Línea',
      cpu: 42,
      ram: 68,
      storage: '500 GB NVMe',
      autoScale: true,
      backupDate: '2026-11-09',
      notes: 'Nodo principal del clúster de producción Kubernetes.'
    },
    {
      id: 'srv-eu-west-204',
      name: 'db-postgres-primary',
      region: 'eu-west-1 (Ireland)',
      ip: '10.2.14.89',
      os: 'Debian 12 Bookworm',
      status: 'warning',
      statusLabel: 'Carga Elevada',
      cpu: 89,
      ram: 84,
      storage: '2 TB SSD',
      autoScale: false,
      backupDate: '2026-11-10',
      notes: 'Base de datos relacional de clientes y transacciones.'
    },
    {
      id: 'srv-sa-east-303',
      name: 'api-gateway-latam-01',
      region: 'sa-east-1 (São Paulo)',
      ip: '10.4.55.12',
      os: 'Alpine Linux 3.19',
      status: 'online',
      statusLabel: 'En Línea',
      cpu: 28,
      ram: 45,
      storage: '120 GB SSD',
      autoScale: true,
      backupDate: '2026-11-08',
      notes: 'Gateway NGINX con terminación SSL y rate limiting.'
    },
    {
      id: 'srv-us-west-408',
      name: 'ml-training-gpu-node',
      region: 'us-west-2 (Oregon)',
      ip: '10.8.21.77',
      os: 'Ubuntu 22.04 LTS',
      status: 'danger',
      statusLabel: 'Falla Crítica',
      cpu: 98,
      ram: 96,
      storage: '4 TB NVMe',
      autoScale: false,
      backupDate: '2026-11-07',
      notes: 'Instancia con 4x NVIDIA H100. Disipación térmica al límite.'
    },
    {
      id: 'srv-ap-se-512',
      name: 'cache-redis-session-cluster',
      region: 'ap-southeast-1 (Singapore)',
      ip: '10.9.10.33',
      os: 'Red Hat Enterprise 9',
      status: 'online',
      statusLabel: 'En Línea',
      cpu: 18,
      ram: 58,
      storage: '256 GB RAM-Disk',
      autoScale: true,
      backupDate: '2026-11-10',
      notes: 'Clúster Redis en memoria para tokens y sesiones activas.'
    },
    {
      id: 'srv-us-east-619',
      name: 'auth-vault-security-01',
      region: 'us-east-1 (N. Virginia)',
      ip: '10.0.19.102',
      os: 'Ubuntu 24.04 LTS',
      status: 'online',
      statusLabel: 'En Línea',
      cpu: 14,
      ram: 32,
      storage: '250 GB Encrypted',
      autoScale: false,
      backupDate: '2026-11-10',
      notes: 'Bóveda HashiCorp Vault para rotación de credenciales.'
    },
    {
      id: 'srv-eu-cent-720',
      name: 'worker-queue-celery-pool',
      region: 'eu-central-1 (Frankfurt)',
      ip: '10.3.88.19',
      os: 'Debian 12 Bookworm',
      status: 'warning',
      statusLabel: 'Cola Saturada',
      cpu: 76,
      ram: 79,
      storage: '300 GB SSD',
      autoScale: true,
      backupDate: '2026-11-09',
      notes: 'Procesamiento asíncrono de reportes masivos y emails.'
    },
    {
      id: 'srv-ap-ne-835',
      name: 'cdn-edge-proxy-tokyo',
      region: 'ap-northeast-1 (Tokyo)',
      ip: '10.7.34.61',
      os: 'Alpine Linux 3.19',
      status: 'online',
      statusLabel: 'En Línea',
      cpu: 31,
      ram: 40,
      storage: '500 GB NVMe',
      autoScale: true,
      backupDate: '2026-11-08',
      notes: 'Nodo de borde para entrega estática en región Asia-Pacífico.'
    }
  ];

  let searchQuery = '';
  let statusFilter = 'all';
  let currentPage = 1;
  const itemsPerPage = 5;

  /**
   * Filtra la lista de servidores según búsqueda y estado
   */
  function getFilteredServers() {
    return servers.filter(srv => {
      const matchSearch =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.ip.includes(searchQuery) ||
        srv.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || srv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }

  /**
   * Renderiza la tabla de servidores en el DOM
   */
  function renderTable() {
    const tableBody = document.getElementById('servers-table-body');
    const tableInfo = document.getElementById('table-pagination-info');
    const prevBtn = document.getElementById('table-prev-btn');
    const nextBtn = document.getElementById('table-next-btn');
    const totalCountEl = document.getElementById('servers-count-badge');

    if (!tableBody) return;

    const filtered = getFilteredServers();
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    if (totalCountEl) {
      totalCountEl.textContent = `${servers.length} instancias`;
    }

    if (paginatedItems.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
            <div style="display:flex; flex-direction:column; align-items:center; gap:var(--space-2);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>No se encontraron servidores que coincidan con los criterios.</span>
            </div>
          </td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = paginatedItems.map(srv => {
        let badgeClass = 'badge-info';
        if (srv.status === 'online') badgeClass = 'badge-success';
        if (srv.status === 'warning') badgeClass = 'badge-warning';
        if (srv.status === 'danger') badgeClass = 'badge-danger';

        return `
          <tr data-server-id="${srv.id}">
            <td>
              <div class="cell-primary">
                <span class="cell-title">${srv.name}</span>
                <span class="cell-sub">${srv.id} • ${srv.ip}</span>
              </div>
            </td>
            <td>
              <span style="font-size: var(--text-xs); color: var(--text-muted);">${srv.region}</span>
            </td>
            <td>
              <span class="badge ${badgeClass}">
                <span class="badge-dot"></span>
                ${srv.statusLabel}
              </span>
            </td>
            <td>
              <div style="display: flex; flex-direction: column; gap: 4px; width: 100px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                  <span>CPU</span>
                  <strong>${srv.cpu}%</strong>
                </div>
                <div style="height: 4px; background: var(--bg-subtle); border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; width: ${srv.cpu}%; background: ${srv.cpu > 80 ? 'var(--color-danger-500)' : srv.cpu > 60 ? 'var(--color-warning-500)' : 'var(--color-primary-500)'}"></div>
                </div>
              </div>
            </td>
            <td>
              <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted);">${srv.ram}% RAM</span>
            </td>
            <td style="text-align: right;">
              <div style="display: inline-flex; align-items: center; gap: var(--space-1);">
                <button
                  type="button"
                  class="btn btn-secondary btn-icon"
                  title="Configurar parámetros en Drawer"
                  aria-label="Configurar parámetros de ${srv.name}"
                  onclick="ServersModule.openConfigDrawer('${srv.id}')">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
                <button
                  type="button"
                  class="btn btn-secondary btn-icon"
                  title="Reiniciar instancia (Acción crítica)"
                  aria-label="Reiniciar instancia ${srv.name}"
                  onclick="ServersModule.openRebootModal('${srv.id}')">
                  <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-icon"
                  style="color: var(--color-danger-600);"
                  title="Terminar / Eliminar permanentemente (Acción destructiva)"
                  aria-label="Eliminar ${srv.name}"
                  onclick="ServersModule.openTerminateModal('${srv.id}')">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Paginación
    if (tableInfo) {
      const from = totalItems === 0 ? 0 : startIndex + 1;
      const to = Math.min(startIndex + itemsPerPage, totalItems);
      tableInfo.textContent = `Mostrando ${from}-${to} de ${totalItems} servidores`;
    }

    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
  }

  function getServerById(id) {
    return servers.find(s => s.id === id);
  }

  function updateServer(id, updatedFields) {
    const index = servers.findIndex(s => s.id === id);
    if (index !== -1) {
      servers[index] = { ...servers[index], ...updatedFields };
      renderTable();
      return true;
    }
    return false;
  }

  function deleteServer(id) {
    servers = servers.filter(s => s.id !== id);
    renderTable();
  }

  function openConfigDrawer(id) {
    const srv = getServerById(id);
    if (!srv) return;
    if (window.OverlayModule) {
      window.OverlayModule.openDrawer(srv);
    }
  }

  function openRebootModal(id) {
    const srv = getServerById(id);
    if (!srv) return;
    if (window.OverlayModule) {
      window.OverlayModule.openRebootModal(srv);
    }
  }

  function openTerminateModal(id) {
    const srv = getServerById(id);
    if (!srv) return;
    if (window.OverlayModule) {
      window.OverlayModule.openTerminateModal(srv);
    }
  }

  function init() {
    const searchInput = document.getElementById('table-search-input');
    const statusSelect = document.getElementById('table-status-filter');
    const prevBtn = document.getElementById('table-prev-btn');
    const nextBtn = document.getElementById('table-next-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        currentPage = 1;
        renderTable();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        statusFilter = e.target.value;
        currentPage = 1;
        renderTable();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(getFilteredServers().length / itemsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      });
    }

    renderTable();
  }

  return {
    init,
    renderTable,
    getServerById,
    updateServer,
    deleteServer,
    openConfigDrawer,
    openRebootModal,
    openTerminateModal,
    getServers: () => servers
  };
})();

window.ServersModule = ServersModule;
