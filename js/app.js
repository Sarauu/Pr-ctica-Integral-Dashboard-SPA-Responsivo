

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de submódulos
  if (window.ChartsModule) window.ChartsModule.init();
  if (window.ServersModule) window.ServersModule.init();
  if (window.OverlayModule) window.OverlayModule.init();
  if (window.ControlsDemoModule) window.ControlsDemoModule.init();

  // Elementos de navegación
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link[data-view]');
  const views = document.querySelectorAll('.spa-view');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const sidebar = document.getElementById('app-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

  // Mapeo de títulos de vistas para breadcrumbs (¿Dónde estoy?)
  const viewTitles = {
    'dashboard': 'Métricas Bento Grid',
    'servers': 'Inventario de Servidores e Instancias'
  };

  /**
   * Cambia de vista en la SPA de forma instantánea y accesible
   */
  function navigateToView(viewId) {
    if (!viewTitles[viewId]) return;

    // Actualizar enlaces de navegación
    navLinks.forEach(link => {
      const isTarget = link.getAttribute('data-view') === viewId;
      link.classList.toggle('is-active', isTarget);
      if (isTarget) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Actualizar visibilidad de vistas
    views.forEach(view => {
      const isTarget = view.id === `view-${viewId}`;
      view.classList.toggle('is-active', isTarget);
    });

    // Actualizar miga de pan activa
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = viewTitles[viewId];
    }

    // Cerrar sidebar en pantallas móviles si estaba abierto
    closeMobileSidebar();

    // Scroll suave a la parte superior de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Vincular eventos a los enlaces del Sidebar
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      navigateToView(targetView);
    });
  });


  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('is-visible');
    document.body.classList.add('overlay-open');
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('is-visible');
    document.body.classList.remove('overlay-open');
  }

  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', openMobileSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Escuchar redimensionamiento para evitar bloqueos si el usuario pasa a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMobileSidebar();
    }
  });


  window.showToast = function (title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    let iconColor = 'var(--color-primary-500)';
    let svgIcon = `
      <svg class="toast-icon" style="color: ${iconColor};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;

    if (type === 'success') {
      iconColor = 'var(--color-success-500)';
      svgIcon = `
        <svg class="toast-icon" style="color: ${iconColor};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    } else if (type === 'warning') {
      iconColor = 'var(--color-warning-500)';
      svgIcon = `
        <svg class="toast-icon" style="color: ${iconColor};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
    } else if (type === 'danger') {
      iconColor = 'var(--color-danger-500)';
      svgIcon = `
        <svg class="toast-icon" style="color: ${iconColor};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${svgIcon}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="btn btn-ghost btn-icon" style="min-height:28px; width:28px; padding:0;" aria-label="Cerrar notificación" onclick="this.parentElement.remove()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    container.appendChild(toast);

    // Auto-descarte después de 4 segundos con animación de salida
    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, 4000);
  };

  // Atajo rápido: enlazar botones de acceso en el dashboard
  const quickNavButtons = document.querySelectorAll('[data-navigate]');
  quickNavButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-navigate');
      navigateToView(target);
    });
  });
});
