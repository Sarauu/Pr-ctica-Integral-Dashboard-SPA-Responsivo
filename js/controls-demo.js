
const ControlsDemoModule = (function () {
  const demoForm = document.getElementById('demo-validation-form');
  const testLoadingBtn = document.getElementById('demo-test-loading-btn');
  const toggleDisableSwitch = document.getElementById('demo-toggle-disable-switch');

  function init() {
    // Probar Estado 5 (Loading) con un botón dedicado
    if (testLoadingBtn) {
      testLoadingBtn.addEventListener('click', () => {
        if (testLoadingBtn.classList.contains('is-loading')) return;

        testLoadingBtn.classList.add('is-loading');
        testLoadingBtn.disabled = true;

        if (window.showToast) {
          window.showToast('Estado: Loading activado', 'El botón está en proceso asíncrono y bloquea clics duplicados.', 'info');
        }

        setTimeout(() => {
          testLoadingBtn.classList.remove('is-loading');
          testLoadingBtn.disabled = false;
          if (window.showToast) {
            window.showToast('Estado: Resuelto', 'El proceso simulado finalizó y volvió a Default.', 'success');
          }
        }, 2200);
      });
    }

    // Alternar masivamente Estado 4 (Disabled) en controles del formulario de demostración
    if (toggleDisableSwitch) {
      toggleDisableSwitch.addEventListener('change', (e) => {
        const shouldDisable = e.target.checked;
        const targetInputs = document.querySelectorAll('.demo-toggleable-control');
        targetInputs.forEach(input => {
          input.disabled = shouldDisable;
        });

        if (window.showToast) {
          window.showToast(
            'Estado Dinámico Actualizado',
            shouldDisable ? 'Se activó el estado Disabled en los controles' : 'Se restablecieron los controles a Default',
            'info'
          );
        }
      });
    }

    // Validación del formulario de demostración
    if (demoForm) {
      demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = demoForm.querySelector('button[type="submit"]');

        if (submitBtn) {
          submitBtn.classList.add('is-loading');
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
          }

          if (window.showToast) {
            window.showToast(
              'Formulario Validado y Enviado',
              'Todos los controles (texto, fecha, dropdown, switches) procesados correctamente.',
              'success'
            );
          }
        }, 1500);
      });
    }
  }

  return {
    init
  };
})();

window.ControlsDemoModule = ControlsDemoModule;
