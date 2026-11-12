

const ChartsModule = (function () {
  let cpuDataPoints = [32, 45, 38, 52, 48, 62, 58, 71, 65, 59, 74, 68];
  let networkInData = [120, 145, 132, 198, 220, 210, 245, 290, 275, 310];
  let networkOutData = [80, 95, 110, 140, 135, 160, 180, 195, 210, 220];
  let updateInterval = null;

  function renderCpuChart(points) {
    const svg = document.getElementById('cpu-sparkline-svg');
    if (!svg) return;

    const width = 360;
    const height = 110;
    const padding = 10;
    const maxVal = 100;
    const minVal = 0;

    const stepX = (width - padding * 2) / (points.length - 1);
    const coords = points.map((p, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((p - minVal) / (maxVal - minVal)) * (height - padding * 2);
      return { x, y };
    });

    let dLine = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      // Curva Bézier cúbica suave
      const prev = coords[i - 1];
      const curr = coords[i];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      dLine += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    const dArea = `${dLine} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    const pathLine = document.getElementById('cpu-line-path');
    const pathArea = document.getElementById('cpu-area-path');

    if (pathLine) pathLine.setAttribute('d', dLine);
    if (pathArea) pathArea.setAttribute('d', dArea);

    // Actualizar valor numérico actual
    const lastValue = points[points.length - 1];
    const valueEl = document.getElementById('bento-cpu-val');
    if (valueEl) {
      valueEl.textContent = `${lastValue}%`;
    }
  }

  /**
   * Actualiza el indicador radial (Gauge) de Memoria RAM
   */
  function updateRamGauge(percent) {
    const circle = document.getElementById('ram-gauge-circle');
    const textEl = document.getElementById('bento-ram-val');
    if (!circle || !textEl) return;

    const radius = 42;
    const circumference = 2 * Math.PI * radius; // ~263.89
    const offset = circumference - (percent / 100) * circumference;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${offset}`;
    textEl.textContent = `${percent}%`;

    // Color semántico según consumo
    if (percent > 85) {
      circle.style.stroke = 'var(--color-danger-500)';
    } else if (percent > 70) {
      circle.style.stroke = 'var(--color-warning-500)';
    } else {
      circle.style.stroke = 'var(--color-primary-500)';
    }
  }

  /**
   * Renderiza el gráfico de tráfico de red
   */
  function renderNetworkChart() {
    const svg = document.getElementById('network-chart-svg');
    if (!svg) return;

    const width = 300;
    const height = 80;
    const padding = 6;
    const maxVal = 400;

    const generatePath = (arr) => {
      const stepX = (width - padding * 2) / (arr.length - 1);
      return arr.reduce((acc, val, i) => {
        const x = padding + i * stepX;
        const y = height - padding - (val / maxVal) * (height - padding * 2);
        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '');
    };

    const inPath = document.getElementById('net-in-path');
    const outPath = document.getElementById('net-out-path');

    if (inPath) inPath.setAttribute('d', generatePath(networkInData));
    if (outPath) outPath.setAttribute('d', generatePath(networkOutData));

    const netValEl = document.getElementById('bento-net-val');
    if (netValEl) {
      const lastIn = networkInData[networkInData.length - 1];
      const lastOut = networkOutData[networkOutData.length - 1];
      netValEl.textContent = `${(lastIn + lastOut) / 10} MB/s`;
    }
  }

  /**
   * Ciclo de simulación en tiempo real (métrica viva de telemetría)
   */
  function startSimulation() {
    if (updateInterval) clearInterval(updateInterval);

    updateInterval = setInterval(() => {
      // Simular variación de CPU
      const lastCpu = cpuDataPoints[cpuDataPoints.length - 1];
      const deltaCpu = (Math.random() - 0.48) * 8;
      const nextCpu = Math.min(96, Math.max(22, Math.round(lastCpu + deltaCpu)));
      cpuDataPoints.shift();
      cpuDataPoints.push(nextCpu);
      renderCpuChart(cpuDataPoints);

      // Simular variación de RAM
      const nextRam = Math.min(94, Math.max(50, Math.round(68 + (Math.random() - 0.5) * 6)));
      updateRamGauge(nextRam);

      // Simular variación de Red
      const nextIn = Math.round(Math.min(380, Math.max(90, networkInData[networkInData.length - 1] + (Math.random() - 0.48) * 40)));
      const nextOut = Math.round(Math.min(300, Math.max(70, networkOutData[networkOutData.length - 1] + (Math.random() - 0.48) * 30)));
      networkInData.shift();
      networkInData.push(nextIn);
      networkOutData.shift();
      networkOutData.push(nextOut);
      renderNetworkChart();
    }, 3200);
  }

  function init() {
    renderCpuChart(cpuDataPoints);
    updateRamGauge(72);
    renderNetworkChart();
    startSimulation();
  }

  return {
    init,
    updateRamGauge,
  };
})();

window.ChartsModule = ChartsModule;
