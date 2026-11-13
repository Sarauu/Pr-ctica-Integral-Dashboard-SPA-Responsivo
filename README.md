# CloudPulse | Dashboard SPA Responsivo para Monitoreo de Infraestructura Cloud

> El proyecto fue desarrollado exclusivamente con **HTML5 semántico**, **CSS nativo** y **JavaScript vanilla**, sin frameworks CSS prefabricados como Bootstrap, Tailwind o Foundation, garantizando el dominio total de los principios nativos.



## Escenario y Problemática

Una empresa proveedora de infraestructura tecnológica requería renovar su plataforma web de monitoreo de servidores e instancias cloud. La herramienta debía permitir a los ingenieros administradores (**DevOps / SRE**):
* Visualizar métricas de consumo en tiempo real (CPU, RAM, almacenamiento y tráfico de red).
* Configurar parámetros operacionales mediante paneles contextuales sin perder el contexto visual de trabajo.
* Ejecutar acciones críticas de administración (como reinicios y desmantelamiento de servidores) garantizando accesibilidad, confirmación segura con salvaguardas y retroalimentación inmediata.

---

##  Estructura del Proyecto

El código fuente está estructurado de manera modular y limpia:

```text
├── index.html                  # Marcado HTML5 semántico con las 3 zonas funcionales
├── css/
│   ├── variables.css          # Design Tokens, Modo Oscuro nativo (:root) y variables de tiempo
│   ├── base.css               # Reset moderno, accesibilidad WCAG y zonas de toque mínimas (44px)
│   ├── layout.css             # Layout Macro Mobile-First (CSS Grid) y Bento Grid de métricas
│   ├── components.css         # Botones (5 estados), controles de entrada, tablas y badges
│   └── overlays.css           # Zona 3: Drawer contextual y Modal dialog de acciones críticas
├── js/
│   ├── app.js                 # SPA Router, breadcrumbs dinámicos, sidebar móvil y toasts
│   ├── theme.js               # Switcher nativo Dark/Light con prefers-color-scheme y persistencia
│   ├── charts.js              # Gráficas dinámicas interactivas SVG nativas (sin librerías externas)
│   ├── servers-data.js        # Base de datos simulada, búsqueda, filtros y paginación
│   ├── modal-drawer.js        # Lógica accesible de Zona 3 (trampa de foco, tecla Esc, scroll lock)
│   └── controls-demo.js       # Laboratorio interactivo para verificar los 5 estados de control
├── docs
└── README.md                  # Este documento
```

---

## Fases de Desarrollo y Criterios Cubiertos


### Fase : Arquitectura de Interfaz en Tres Zonas
* **Zona 1 (Navegación):**
  * Header superior fijo con migas de pan (*Breadcrumbs*) que responden dinámicamente a: *¿De dónde vengo?* y *¿Dónde estoy?*.
  * Barra lateral (*Sidebar*) con enlace activo visualmente resaltado que responde a: *¿A dónde puedo ir?*.
* **Zona 2 (Contenido Dinámico):**
  * Núcleo de valor de negocio con 4 vistas conmutables instantáneamente: Dashboard Bento Grid, Tabla de Registros de Servidores con búsqueda y filtros, Laboratorio de Estados y Documentación UX.
* **Zona 3 (Interacción y Acciones Críticas):**
  * **Drawer Deslizante:** Panel contextual que emerge desde la derecha para editar parámetros de servidor.
  * **Modal de Confirmación Destructiva:** Diálogo con trampa de foco y salvaguarda que exige escribir `ELIMINAR` para destruir un servidor, previniendo errores operacionales catastróficos.
  * **Toasts Flotantes:** Notificaciones semánticas con auto-descarte tras 4 segundos.

### Fase 4: Mecanismos de Control, Estados y Tendencias
* **Controles de Entrada Completos:** Formulario con campo de texto, área de texto multilínea, selector con calendario (`input[type="date"]`), switch/toggle binario accesible y dropdown select.
* **Gestión Rigurosa de los 5 Estados:**
  1. *Default:* Apariencia limpia con contraste conforme a WCAG.
  2. *Hover:* Elevación sutil y oscurecimiento del fondo.
  3. *Focus:* Contorno visible de alto contraste con separación exterior (`outline: 3px solid var(--focus-ring-color); outline-offset: 2px`).
  4. *Disabled:* Opacidad al 45%, cursor `not-allowed` y bloqueo de eventos.
  5. *Loading:* Spinner giratorio asíncrono y bloqueo contra clics repetidos.
* **Modo Oscuro Nativo:** Paleta basada en variables CSS (`:root`), compatible con la media query del sistema (`prefers-color-scheme: dark`) y conmutador manual accesible guardado en `localStorage`.
* **Microinteracciones:** Transiciones fluidas en hover de tarjetas, botones y modales.

### Fase 5: Documentación de las 5 Dimensiones de IxD
* **1D - Palabras:** Textos claros y directos ("Configurar Servidor", "Confirmar Reinicio", "Destruir Instancia") y advertencias explícitas de impacto.
* **2D - Representaciones Visuales:** Iconografía SVG universal de 24x24 px, tipografía legible y colores semánticos funcionales.
* **3D - Objetos Físicos:** Zonas de toque ergonómicas con un tamaño mínimo de **44x44 px** para smartphone y precisión para mouse en escritorio.
* **4D - Tiempo:** Microinteracciones calibradas entre **200 ms y 350 ms** con curvas Bézier (`cubic-bezier(0.4, 0, 0.2, 1)`) y spinners de carga inmediata.
* **5D - Comportamiento:** Atajo con tecla `Escape` para cerrar overlays, trampa de foco accesible para teclado y confirmación de seguridad anti-errores.

---

## Instrucciones de Ejecución Local

Dado que el proyecto utiliza tecnologías web nativas puras (sin necesidad de compiladores, Node, Webpack ni dependencias de npm):

### Opción 1: Apertura Directa en el Navegador
1. Clona o descarga este repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd "Práctica Integral Dashboard SPA Responsivo "
   ```
2. Haz doble clic sobre el archivo `index.html` para abrirlo directamente en tu navegador web preferido (Chrome, Edge, Firefox, Safari).


* Proyecto desarrollado para la **Práctica Integral: Dashboard SPA Responsivo**.
* Licencia: MIT. Código abierto para fines académicos y de evaluación.
