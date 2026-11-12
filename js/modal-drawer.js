

const OverlayModule = (function () {
  let activeTriggerElement = null;
  let currentServerTarget = null;
  let activeModalAction = null; // 'reboot' | 'terminate'

  // Elementos DOM
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('config-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerCancelBtn = document.getElementById('drawer-cancel-btn');
  const drawerForm = document.getElementById('drawer-config-form');
  const drawerSaveBtn = document.getElementById('drawer-save-btn');

  // Campos del Drawer
  const drawerServerId = document.getElementById('drawer-server-id');
  const drawerServerName = document.getElementById('drawer-server-name');
  const drawerServerRegion = document.getElementById('drawer-server-region');
  const drawerServerBackup = document.getElementById('drawer-server-backup');
  const drawerServerAutoscale = document.getElementById('drawer-server-autoscale');
  const drawerServerNotes = document.getElementById('drawer-server-notes');

  // Elementos del Modal
  const modalBackdrop = document.getElementById('confirm-modal-backdrop');
  const modalDialog = document.getElementById('confirm-modal-dialog');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalAlertBox = document.getElementById('modal-alert-box');
  const modalSecurityInputContainer = document.getElementById('modal-security-input-container');
  const modalSecurityInput = document.getElementById('modal-security-input');

  /**
   * Bloqueo accesible de scroll del body
   */
  function lockScroll() {
    document.body.classList.add('overlay-open');
  }

  function unlockScroll() {
    document.body.classList.remove('overlay-open');
  }

  /**
   * Trampa de foco accesible (Focus Trap)
   */
  function trapFocus(container, event) {
    if (event.key !== 'Tab') return;

    const focusable = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  function openDrawer(server) {
    activeTriggerElement = document.activeElement;
    currentServerTarget = server;

    // Llenar campos del formulario
    if (drawerServerId) drawerServerId.textContent = server.id;
    if (drawerServerName) drawerServerName.value = server.name;
    if (drawerServerRegion) drawerServerRegion.value = server.region;
    if (drawerServerBackup) drawerServerBackup.value = server.backupDate || '2026-11-10';
    if (drawerServerAutoscale) drawerServerAutoscale.checked = Boolean(server.autoScale);
    if (drawerServerNotes) drawerServerNotes.value = server.notes || '';

    // Restablecer estado del botón de guardar
    if (drawerSaveBtn) {
      drawerSaveBtn.classList.remove('is-loading');
      drawerSaveBtn.disabled = false;
      drawerSaveBtn.textContent = 'Guardar Parámetros';
    }

    drawerBackdrop.classList.add('is-active');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    lockScroll();

    // Enfocar primer campo
    setTimeout(() => {
      if (drawerServerName) drawerServerName.focus();
    }, 100);
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('is-active');
    unlockScroll();

    if (activeTriggerElement && typeof activeTriggerElement.focus === 'function') {
      activeTriggerElement.focus();
    }
    currentServerTarget = null;
  }

  /**
   * Guarda los cambios con simulación de llamada asíncrona y los 5 Estados
   */
  function handleDrawerSubmit(e) {
    e.preventDefault();
    if (!currentServerTarget || !drawerSaveBtn) return;

    // Activar Estado 5: Loading (bloquea reenvíos duplicados)
    drawerSaveBtn.classList.add('is-loading');
    drawerSaveBtn.disabled = true;

    setTimeout(() => {
      const updatedFields = {
        name: drawerServerName.value.trim() || currentServerTarget.name,
        region: drawerServerRegion.value,
        backupDate: drawerServerBackup.value,
        autoScale: drawerServerAutoscale.checked,
        notes: drawerServerNotes.value.trim()
      };

      if (window.ServersModule) {
        window.ServersModule.updateServer(currentServerTarget.id, updatedFields);
      }

      drawerSaveBtn.classList.remove('is-loading');
      drawerSaveBtn.disabled = false;
      closeDrawer();

      if (window.showToast) {
        window.showToast(
          'Parámetros Actualizados',
          `Se guardó la configuración para la instancia ${updatedFields.name}`,
          'success'
        );
      }
    }, 1200);
  }

  function openRebootModal(server) {
    activeTriggerElement = document.activeElement;
    currentServerTarget = server;
    activeModalAction = 'reboot';

    modalTitle.textContent = `¿Reiniciar instancia ${server.name}?`;
    modalDescription.textContent = `La máquina virtual se reiniciará inmediatamente. Todos los servicios enlazados experimentarán una interrupción temporal de aproximadamente 90 a 120 segundos.`;

    modalAlertBox.style.display = 'block';
    modalAlertBox.style.backgroundColor = 'var(--color-warning-bg)';
    modalAlertBox.style.borderColor = 'var(--color-warning-border)';
    modalAlertBox.style.color = 'var(--color-warning-text)';
    modalAlertBox.innerHTML = `<strong>Aviso de Disponibilidad:</strong> Los balanceadores de carga redirigirán temporalmente el tráfico a nodos redundantes.`;

    if (modalSecurityInputContainer) {
      modalSecurityInputContainer.style.display = 'none';
    }

    modalConfirmBtn.className = 'btn btn-primary';
    modalConfirmBtn.textContent = 'Confirmar Reinicio';
    modalConfirmBtn.disabled = false;
    modalConfirmBtn.classList.remove('is-loading');

    showModal();
  }

  function openTerminateModal(server) {
    activeTriggerElement = document.activeElement;
    currentServerTarget = server;
    activeModalAction = 'terminate';

    modalTitle.textContent = `¿Eliminar permanentemente ${server.name}?`;
    modalDescription.textContent = `Esta acción es completamente irreversible. Se destruirán todos los volúmenes SSD asociados, las direcciones IP elásticas asignadas y el historial de telemetría de ${server.id}.`;

    modalAlertBox.style.display = 'block';
    modalAlertBox.style.backgroundColor = 'var(--color-danger-bg)';
    modalAlertBox.style.borderColor = 'var(--color-danger-border)';
    modalAlertBox.style.color = 'var(--color-danger-text)';
    modalAlertBox.innerHTML = `<strong>Acción Destructiva Crítica:</strong> Para evitar borrados accidentales, escribe la palabra <code>ELIMINAR</code> en el campo inferior para habilitar el botón.`;

    if (modalSecurityInputContainer) {
      modalSecurityInputContainer.style.display = 'block';
      if (modalSecurityInput) {
        modalSecurityInput.value = '';
      }
    }

    modalConfirmBtn.className = 'btn btn-danger';
    modalConfirmBtn.textContent = 'Destruir Instancia';
    modalConfirmBtn.disabled = true; // Empieza deshabilitado como mecanismo de seguridad
    modalConfirmBtn.classList.remove('is-loading');

    showModal();
  }

  function showModal() {
    modalBackdrop.classList.add('is-active');
    modalDialog.setAttribute('aria-hidden', 'false');
    lockScroll();

    setTimeout(() => {
      if (activeModalAction === 'terminate' && modalSecurityInput) {
        modalSecurityInput.focus();
      } else if (modalConfirmBtn) {
        modalConfirmBtn.focus();
      }
    }, 100);
  }

  function closeModal() {
    modalBackdrop.classList.remove('is-active');
    modalDialog.setAttribute('aria-hidden', 'true');
    unlockScroll();

    if (activeTriggerElement && typeof activeTriggerElement.focus === 'function') {
      activeTriggerElement.focus();
    }
    currentServerTarget = null;
    activeModalAction = null;
  }

  function handleConfirmAction() {
    if (!currentServerTarget || !modalConfirmBtn) return;

    // Activar estado Loading y deshabilitar botón
    modalConfirmBtn.classList.add('is-loading');
    modalConfirmBtn.disabled = true;

    setTimeout(() => {
      const serverName = currentServerTarget.name;
      const serverId = currentServerTarget.id;

      if (activeModalAction === 'terminate') {
        if (window.ServersModule) {
          window.ServersModule.deleteServer(serverId);
        }
        if (window.showToast) {
          window.showToast(
            'Instancia Terminada',
            `El servidor ${serverName} (${serverId}) ha sido eliminado permanentemente del clúster.`,
            'danger'
          );
        }
      } else if (activeModalAction === 'reboot') {
        if (window.showToast) {
          window.showToast(
            'Reinicio Iniciado',
            `La señal de reinicio fue enviada con éxito a ${serverName}.`,
            'info'
          );
        }
      }

      modalConfirmBtn.classList.remove('is-loading');
      modalConfirmBtn.disabled = false;
      closeModal();
    }, 1400);
  }

  function init() {
    // Eventos del Drawer
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerCancelBtn) drawerCancelBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === drawerBackdrop) closeDrawer();
      });
    }
    if (drawerForm) drawerForm.addEventListener('submit', handleDrawerSubmit);

    // Eventos del Modal
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }
    if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', handleConfirmAction);

    // Validación reactiva de palabra de seguridad para acción destructiva
    if (modalSecurityInput) {
      modalSecurityInput.addEventListener('input', (e) => {
        const value = e.target.value.trim().toUpperCase();
        if (activeModalAction === 'terminate') {
          modalConfirmBtn.disabled = value !== 'ELIMINAR';
        }
      });
    }

    // Atajo de teclado: Escape para cerrar cualquier overlay activo
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modalBackdrop.classList.contains('is-active')) {
          closeModal();
        } else if (drawer.classList.contains('is-open')) {
          closeDrawer();
        }
      }

      // Trampa de foco
      if (modalBackdrop.classList.contains('is-active')) {
        trapFocus(modalDialog, e);
      } else if (drawer.classList.contains('is-open')) {
        trapFocus(drawer, e);
      }
    });
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    openRebootModal,
    openTerminateModal,
    closeModal
  };
})();

window.OverlayModule = OverlayModule;
