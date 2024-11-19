// app.js

// Datos de calibres AWG
const awgData = {
  "AWG6": { diametro: 4.115, pesoPorKm: 118.23, corriente: 131 },
  "AWG7": { diametro: 3.665, pesoPorKm: 93.79, corriente: 104 },
  "AWG8": { diametro: 3.264, pesoPorKm: 74.39, corriente: 83 },
  "AWG9": { diametro: 2.906, pesoPorKm: 58.96, corriente: 65 },
  "AWG10": { diametro: 2.588, pesoPorKm: 46.76, corriente: 52 },
  "AWG11": { diametro: 2.304, pesoPorKm: 37.06, corriente: 41 },
  "AWG12": { diametro: 2.052, pesoPorKm: 29.40, corriente: 33 },
  "AWG13": { diametro: 1.829, pesoPorKm: 23.36, corriente: 26 },
  "AWG14": { diametro: 1.628, pesoPorKm: 18.51, corriente: 21 },
  "AWG15": { diametro: 1.450, pesoPorKm: 14.68, corriente: 16 },
  "AWG16": { diametro: 1.290, pesoPorKm: 11.62, corriente: 13 },
  "AWG17": { diametro: 1.151, pesoPorKm: 9.25, corriente: 10 },
  "AWG18": { diametro: 1.024, pesoPorKm: 7.32, corriente: 8.1 },
  "AWG19": { diametro: 0.912, pesoPorKm: 5.81, corriente: 6.4 },
  "AWG20": { diametro: 0.813, pesoPorKm: 4.62, corriente: 5.1 },
  "AWG21": { diametro: 0.724, pesoPorKm: 3.66, corriente: 4.1 },
  "AWG22": { diametro: 0.643, pesoPorKm: 2.89, corriente: 3.2 },
  "AWG23": { diametro: 0.574, pesoPorKm: 2.30, corriente: 2.6 },
  "AWG24": { diametro: 0.511, pesoPorKm: 1.82, corriente: 2.0 },
  "AWG25": { diametro: 0.455, pesoPorKm: 1.445, corriente: 1.6 },
  "AWG26": { diametro: 0.404, pesoPorKm: 1.140, corriente: 1.26 },
  "AWG27": { diametro: 0.361, pesoPorKm: 0.910, corriente: 1.01 },
  "AWG28": { diametro: 0.320, pesoPorKm: 0.7150, corriente: 0.79 },
  "AWG29": { diametro: 0.287, pesoPorKm: 0.5751, corriente: 0.64 },
  "AWG30": { diametro: 0.254, pesoPorKm: 0.4505, corriente: 0.50 },
  "AWG31": { diametro: 0.226, pesoPorKm: 0.3566, corriente: 0.40 },
  "AWG32": { diametro: 0.203, pesoPorKm: 0.2877, corriente: 0.32 },
  "AWG33": { diametro: 0.180, pesoPorKm: 0.2262, corriente: 0.25 },
  "AWG34": { diametro: 0.160, pesoPorKm: 0.1787, corriente: 0.20 },
  "AWG35": { diametro: 0.142, pesoPorKm: 0.1408, corriente: 0.16 },
  "AWG36": { diametro: 0.127, pesoPorKm: 0.1126, corriente: 0.13 },
  "AWG37": { diametro: 0.114, pesoPorKm: 0.09074, corriente: 0.101 },
  "AWG38": { diametro: 0.102, pesoPorKm: 0.07264, corriente: 0.080 },
  "AWG39": { diametro: 0.089, pesoPorKm: 0.05531, corriente: 0.061 },
  "AWG40": { diametro: 0.079, pesoPorKm: 0.04358, corriente: 0.048 }
};

// Función para seleccionar el calibre AWG adecuado
function seleccionarCalibreAWG(corriente, obsolescencia = false) {
  const calibresOrdenados = Object.entries(awgData).sort((a, b) => b[1].corriente - a[1].corriente);

  for (let i = calibresOrdenados.length - 1; i >= 0; i--) {
    const [calibre, data] = calibresOrdenados[i];
    if (corriente <= data.corriente) {
      if (obsolescencia && i < calibresOrdenados.length - 1) {
        // Seleccionar el calibre siguiente (menor diámetro)
        const [calibreObsolescente, dataObsolescente] = calibresOrdenados[i + 1];
        return { calibre: calibreObsolescente, ...dataObsolescente };
      } else {
        return { calibre, ...data };
      }
    }
  }
  console.warn(`No se encontró un calibre AWG que soporte una corriente de ${corriente.toFixed(2)} A.`);
  return null;
}

// Función para calcular la sección transversal
function calcularSeccionTransversal(diametro) {
  return ((Math.PI * Math.pow(diametro, 2)) / 4) * 1e-6; // Área en m²
}

// Función para calcular la resistencia
function calcularResistencia(ρ, L, A) {
  return (ρ * L) / A; // Resistencia en Ω
}

// Función para guardar el cálculo en el historial
function guardarCalculoEnMemoria(resultados) {
  let calculosGuardados = JSON.parse(localStorage.getItem('historialCalculos')) || [];
  calculosGuardados.push(resultados);
  localStorage.setItem('historialCalculos', JSON.stringify(calculosGuardados));
}

// Función para mostrar el historial de cálculos
function mostrarHistorialCalculos() {
  const historialCalculos = JSON.parse(localStorage.getItem('historialCalculos')) || [];
  const historialDiv = document.getElementById('historial');

  if (historialCalculos.length === 0) {
    historialDiv.innerHTML = "<p>No hay cálculos previos almacenados.</p>";
  } else {
    let htmlHistorial = '<ul>';
    historialCalculos.forEach((calculo, index) => {
      htmlHistorial += `
        <li>
          <div class="historial-item">
            <p><strong>Cálculo ${index + 1}</strong></p>
            <p>V<sub>p</sub>: ${calculo.voltajePrimario} V, V<sub>s</sub>: ${calculo.voltajeSecundario} V, P: ${calculo.potencia} W</p>
            <p>Eficiencia: ${calculo.eficiencia.toFixed(2)}%</p>
            <button onclick="verResultado(${index})">Ver Detalles</button>
          </div>
        </li>
      `;
    });
    htmlHistorial += '</ul>';
    historialDiv.innerHTML = htmlHistorial;
  }
}

// Función para ver un resultado del historial
function verResultado(index) {
  localStorage.setItem('resultadoSeleccionado', index);
  window.location.href = 'resultadohistorial.html';
}

// Función para borrar el historial
function borrarHistorial() {
  localStorage.removeItem('historialCalculos');
  alert("Historial borrado.");
  window.location.reload();
}

// Función principal para calcular el transformador
function calcularTransformador(event) {
  event.preventDefault();

  try {
    const voltajePrimario = parseFloat(document.getElementById('voltajePrimario').value);
    const voltajeSecundario = parseFloat(document.getElementById('voltajeSecundario').value);
    const potencia = parseFloat(document.getElementById('potencia').value);
    const factorCorreccion = parseFloat(document.getElementById('factorCorreccion').value);
    const obsolescencia = document.getElementById('obsolescencia').value === '1';

    // Validaciones
    if (isNaN(voltajePrimario) || voltajePrimario <= 0) {
      throw new Error('El voltaje primario debe ser un número mayor a cero.');
    }
    if (isNaN(voltajeSecundario) || voltajeSecundario <= 0) {
      throw new Error('El voltaje secundario debe ser un número mayor a cero.');
    }
    if (isNaN(potencia) || potencia <= 0) {
      throw new Error('La potencia debe ser un número mayor a cero.');
    }
    if (isNaN(factorCorreccion) || factorCorreccion < 0.8 || factorCorreccion > 1.8) {
      throw new Error('El factor de corrección debe estar entre 0.8 y 1.8.');
    }

    // Guardar los valores iniciales en localStorage
    localStorage.setItem('voltajePrimario', voltajePrimario);
    localStorage.setItem('voltajeSecundario', voltajeSecundario);
    localStorage.setItem('potencia', potencia);
    localStorage.setItem('factorCorreccion', factorCorreccion);
    localStorage.setItem('obsolescencia', obsolescencia);

    // Realizar los cálculos iniciales y guardar en localStorage
    realizarCalculosYGuardar();

    // Guardar los resultados en el historial
    const eficiencia = parseFloat(localStorage.getItem('eficiencia'));
    const resultadosHTML = ''; // Se actualizará en la página de resultados
    const resultadosObj = {
      voltajePrimario,
      voltajeSecundario,
      potencia,
      factorCorreccion,
      obsolescencia,
      eficiencia,
      resultadosHTML,
    };
    guardarCalculoEnMemoria(resultadosObj);

    // Redirigir a la página de resultados
    window.location.href = 'resultados.html';

  } catch (error) {
    console.error('Error al calcular el transformador:', error);
    alert(error.message);
  }
}

// Función para realizar los cálculos y guardar resultados
function realizarCalculosYGuardar(nuevoFactorCorreccion) {
  const voltajePrimario = parseFloat(localStorage.getItem('voltajePrimario'));
  const voltajeSecundario = parseFloat(localStorage.getItem('voltajeSecundario'));
  const potencia = parseFloat(localStorage.getItem('potencia'));
  const obsolescencia = localStorage.getItem('obsolescencia') === 'true';
  const factorCorreccion = nuevoFactorCorreccion !== undefined ? parseFloat(nuevoFactorCorreccion) : parseFloat(localStorage.getItem('factorCorreccion'));

  // Cálculos principales
  const seccionTransversal = Math.sqrt(potencia) * factorCorreccion;
  const ladoNucleo = Math.sqrt(seccionTransversal);
  const perimetroNucleo = 2 * (ladoNucleo + (ladoNucleo * 2));

  const relacionTransformacion = voltajePrimario / voltajeSecundario;
  const corrientePrimario = potencia / voltajePrimario;
  const corrienteSecundario = potencia / voltajeSecundario;

  const K = 37.54;
  const espirasPorVoltio = K / seccionTransversal;
  const espirasPrimario = espirasPorVoltio * voltajePrimario;
  const espirasSecundario = espirasPorVoltio * voltajeSecundario;

  const conductorPrimario = seleccionarCalibreAWG(corrientePrimario, obsolescencia);
  const conductorSecundario = seleccionarCalibreAWG(corrienteSecundario, obsolescencia);

  const longitudPrimario = ((perimetroNucleo * espirasPrimario) / 100) + 0.3;
  const longitudSecundario = ((perimetroNucleo * espirasSecundario) / 100) + 0.3;

  const pesoPrimario = conductorPrimario ? (longitudPrimario / 1000) * conductorPrimario.pesoPorKm : 0;
  const pesoSecundario = conductorSecundario ? (longitudSecundario / 1000) * conductorSecundario.pesoPorKm : 0;

  const areaPrimario = conductorPrimario ? calcularSeccionTransversal(conductorPrimario.diametro) : 0;
  const areaSecundario = conductorSecundario ? calcularSeccionTransversal(conductorSecundario.diametro) : 0;

  const ρ = 1.7e-8;
  const resistenciaPrimario = areaPrimario > 0 ? calcularResistencia(ρ, longitudPrimario, areaPrimario) : 0;
  const resistenciaSecundario = areaSecundario > 0 ? calcularResistencia(ρ, longitudSecundario, areaSecundario) : 0;

  const perdidasPrimario = corrientePrimario ** 2 * resistenciaPrimario;
  const perdidasSecundario = corrienteSecundario ** 2 * resistenciaSecundario;

  const potenciaSalida = potencia - (perdidasPrimario + perdidasSecundario);
  const eficiencia = (potenciaSalida / potencia) * 100;

  // Guardar resultados en localStorage
  localStorage.setItem('factorCorreccion', factorCorreccion);
  localStorage.setItem('seccionTransversal', seccionTransversal);
  localStorage.setItem('perimetroNucleo', perimetroNucleo);
  localStorage.setItem('relacionTransformacion', relacionTransformacion);
  localStorage.setItem('corrientePrimario', corrientePrimario);
  localStorage.setItem('corrienteSecundario', corrienteSecundario);
  localStorage.setItem('espirasPrimario', espirasPrimario);
  localStorage.setItem('espirasSecundario', espirasSecundario);
  localStorage.setItem('conductorPrimario', JSON.stringify(conductorPrimario));
  localStorage.setItem('conductorSecundario', JSON.stringify(conductorSecundario));
  localStorage.setItem('longitudPrimario', longitudPrimario);
  localStorage.setItem('longitudSecundario', longitudSecundario);
  localStorage.setItem('pesoPrimario', pesoPrimario);
  localStorage.setItem('pesoSecundario', pesoSecundario);
  localStorage.setItem('areaPrimario', areaPrimario);
  localStorage.setItem('areaSecundario', areaSecundario);
  localStorage.setItem('resistenciaPrimario', resistenciaPrimario);
  localStorage.setItem('resistenciaSecundario', resistenciaSecundario);
  localStorage.setItem('perdidasPrimario', perdidasPrimario);
  localStorage.setItem('perdidasSecundario', perdidasSecundario);
  localStorage.setItem('eficiencia', eficiencia);
}

// Evento para el formulario
const transformerForm = document.getElementById('transformerForm');
if (transformerForm) {
  transformerForm.addEventListener('submit', calcularTransformador);
}

// Mostrar resultados y gráficas en resultados.html
if (document.getElementById('resultados')) {
  function mostrarResultados() {
    const voltajePrimario = parseFloat(localStorage.getItem('voltajePrimario'));
    const voltajeSecundario = parseFloat(localStorage.getItem('voltajeSecundario'));
    const potencia = parseFloat(localStorage.getItem('potencia'));
    const factorCorreccion = parseFloat(localStorage.getItem('factorCorreccion'));
    const seccionTransversal = parseFloat(localStorage.getItem('seccionTransversal'));
    const perimetroNucleo = parseFloat(localStorage.getItem('perimetroNucleo'));
    const relacionTransformacion = parseFloat(localStorage.getItem('relacionTransformacion'));
    const corrientePrimario = parseFloat(localStorage.getItem('corrientePrimario'));
    const corrienteSecundario = parseFloat(localStorage.getItem('corrienteSecundario'));
    const espirasPrimario = parseFloat(localStorage.getItem('espirasPrimario'));
    const espirasSecundario = parseFloat(localStorage.getItem('espirasSecundario'));
    const conductorPrimario = JSON.parse(localStorage.getItem('conductorPrimario'));
    const conductorSecundario = JSON.parse(localStorage.getItem('conductorSecundario'));
    const longitudPrimario = parseFloat(localStorage.getItem('longitudPrimario'));
    const longitudSecundario = parseFloat(localStorage.getItem('longitudSecundario'));
    const pesoPrimario = parseFloat(localStorage.getItem('pesoPrimario'));
    const pesoSecundario = parseFloat(localStorage.getItem('pesoSecundario'));
    const areaPrimario = parseFloat(localStorage.getItem('areaPrimario'));
    const areaSecundario = parseFloat(localStorage.getItem('areaSecundario'));
    const resistenciaPrimario = parseFloat(localStorage.getItem('resistenciaPrimario'));
    const resistenciaSecundario = parseFloat(localStorage.getItem('resistenciaSecundario'));
    const perdidasPrimario = parseFloat(localStorage.getItem('perdidasPrimario'));
    const perdidasSecundario = parseFloat(localStorage.getItem('perdidasSecundario'));
    const eficiencia = parseFloat(localStorage.getItem('eficiencia'));

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `
      <p><i class="fas fa-ruler-combined"></i> <strong>Sección Transversal del Núcleo (ajustada):</strong> ${seccionTransversal.toFixed(2)} cm²</p>
      <p><i class="fas fa-expand-arrows-alt"></i> <strong>Perímetro Medio del Núcleo:</strong> ${perimetroNucleo.toFixed(2)} cm</p>
      <p><i class="fas fa-exchange-alt"></i> <strong>Relación de Transformación:</strong> ${relacionTransformacion.toFixed(2)}</p>
      <p><i class="fas fa-bolt"></i> <strong>Corriente en el Primario:</strong> ${corrientePrimario.toFixed(2)} A</p>
      <p><i class="fas fa-bolt"></i> <strong>Corriente en el Secundario:</strong> ${corrienteSecundario.toFixed(2)} A</p>
      <p><i class="fas fa-coil"></i> <strong>Espiras en el Primario:</strong> ${espirasPrimario.toFixed(0)}</p>
      <p><i class="fas fa-coil"></i> <strong>Espiras en el Secundario:</strong> ${espirasSecundario.toFixed(0)}</p>
      <p><i class="fas fa-wire"></i> <strong>Calibre AWG Primario:</strong> ${conductorPrimario ? conductorPrimario.calibre : "No se encontró un calibre adecuado para el primario"}</p>
      <p><i class="fas fa-wire"></i> <strong>Calibre AWG Secundario:</strong> ${conductorSecundario ? conductorSecundario.calibre : "No se encontró un calibre adecuado para el secundario"}</p>
      <p><i class="fas fa-ruler"></i> <strong>Longitud del Conductor Primario:</strong> ${longitudPrimario.toFixed(2)} m</p>
      <p><i class="fas fa-weight-hanging"></i> <strong>Peso del Conductor Primario:</strong> ${pesoPrimario.toFixed(2)} kg</p>
      <p><i class="fas fa-ruler"></i> <strong>Longitud del Conductor Secundario:</strong> ${longitudSecundario.toFixed(2)} m</p>
      <p><i class="fas fa-weight-hanging"></i> <strong>Peso del Conductor Secundario:</strong> ${pesoSecundario.toFixed(2)} kg</p>
      <p><i class="fas fa-circle"></i> <strong>Área de la Sección Transversal del Primario:</strong> ${(areaPrimario * 1e6).toFixed(2)} mm²</p>
      <p><i class="fas fa-circle"></i> <strong>Área de la Sección Transversal del Secundario:</strong> ${(areaSecundario * 1e6).toFixed(2)} mm²</p>
      <p><i class="fas fa-resistance"></i> <strong>Resistencia Primario:</strong> ${resistenciaPrimario.toFixed(6)} Ω</p>
      <p><i class="fas fa-resistance"></i> <strong>Resistencia Secundario:</strong> ${resistenciaSecundario.toFixed(6)} Ω</p>
      <p><i class="fas fa-fire-alt"></i> <strong>Pérdidas en el Cobre Primario:</strong> ${perdidasPrimario.toFixed(2)} W</p>
      <p><i class="fas fa-fire-alt"></i> <strong>Pérdidas en el Cobre Secundario:</strong> ${perdidasSecundario.toFixed(2)} W</p>
      <p><i class="fas fa-percentage"></i> <strong>Eficiencia del Transformador:</strong> ${eficiencia.toFixed(2)}%</p>
    `;

    // Actualizar el historial con el resultadosHTML
    const index = JSON.parse(localStorage.getItem('historialCalculos')).length - 1;
    const historialCalculos = JSON.parse(localStorage.getItem('historialCalculos'));
    historialCalculos[index].resultadosHTML = resultadosDiv.innerHTML;
    localStorage.setItem('historialCalculos', JSON.stringify(historialCalculos));

    // Mostrar los gráficos
    generarGraficos();
  }

  mostrarResultados();

  // Función para actualizar la simulación en tiempo real
  window.actualizarSimulacion = function(nuevoFactorCorreccion) {
    document.getElementById('factorCorreccionValor').innerText = nuevoFactorCorreccion;

    // Actualizar el factor de corrección en localStorage
    localStorage.setItem('factorCorreccion', nuevoFactorCorreccion);

    // Recalcular los resultados y mostrarlos
    realizarCalculosYGuardar(nuevoFactorCorreccion);
    mostrarResultados();
  };

  // Función para generar los gráficos
  function generarGraficos() {
    const voltajePrimario = parseFloat(localStorage.getItem('voltajePrimario'));
    const voltajeSecundario = parseFloat(localStorage.getItem('voltajeSecundario'));
    const potencia = parseFloat(localStorage.getItem('potencia'));
    const corrientePrimario = parseFloat(localStorage.getItem('corrientePrimario'));
    const corrienteSecundario = parseFloat(localStorage.getItem('corrienteSecundario'));
    const resistenciaPrimario = parseFloat(localStorage.getItem('resistenciaPrimario'));
    const resistenciaSecundario = parseFloat(localStorage.getItem('resistenciaSecundario'));

    // Simulaciones
    let cargasSimuladas = [];
    let eficienciasSimuladas = [];
    let perdidasTotalesSimuladas = [];
    let regulacionesSimuladas = [];

    // Datos para los nuevos gráficos
    let voltajes = [];
    let corrientes = [];
    let potencias = [];

    const puntosSimulacion = 20;
    const rangoMinCarga = 0;
    const rangoMaxCarga = 100;

    for (let i = 0; i <= puntosSimulacion; i++) {
      const carga = rangoMinCarga + ((rangoMaxCarga - rangoMinCarga) / puntosSimulacion) * i;
      const cargaPorcentaje = carga / 100;
      cargasSimuladas.push(carga.toFixed(2));

      const corrienteSecundarioCarga = corrienteSecundario * cargaPorcentaje;
      const corrientePrimarioCarga = corrientePrimario * cargaPorcentaje;

      const perdidasCobrePrimario = Math.pow(corrientePrimarioCarga, 2) * resistenciaPrimario;
      const perdidasCobreSecundario = Math.pow(corrienteSecundarioCarga, 2) * resistenciaSecundario;
      const perdidasTotales = perdidasCobrePrimario + perdidasCobreSecundario;

      const potenciaEntrada = potencia * cargaPorcentaje;
      const potenciaSalida = potenciaEntrada - perdidasTotales;
      const eficiencia = (potenciaSalida / potenciaEntrada) * 100;

      // Regulación de voltaje
      const caidaVoltajeSecundario = corrienteSecundarioCarga * resistenciaSecundario;
      const voltajeSalida = voltajeSecundario - caidaVoltajeSecundario;
      const regulacionVoltaje = ((voltajeSecundario - voltajeSalida) / voltajeSecundario) * 100;

      eficienciasSimuladas.push(eficiencia.toFixed(2));
      perdidasTotalesSimuladas.push(perdidasTotales.toFixed(2));
      regulacionesSimuladas.push(regulacionVoltaje.toFixed(2));

      // Datos para los nuevos gráficos
      voltajes.push(voltajeSalida.toFixed(2));
      corrientes.push(corrienteSecundarioCarga.toFixed(2));
      potencias.push((voltajeSalida * corrienteSecundarioCarga).toFixed(2));
    }

    // Gráfica de Eficiencia y Pérdidas
    const ctxEficiencia = document.getElementById('graficoEficienciaCarga').getContext('2d');
    new Chart(ctxEficiencia, {
      type: 'line',
      data: {
        labels: cargasSimuladas,
        datasets: [
          {
            label: 'Eficiencia (%)',
            data: eficienciasSimuladas,
            borderColor: 'green',
            fill: false
          },
          {
            label: 'Pérdidas Totales (W)',
            data: perdidasTotalesSimuladas,
            borderColor: 'red',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
            },
            zoom: {
              enabled: true,
              mode: 'xy',
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Carga (%)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Valor'
            }
          }
        }
      }
    });

    // Gráfica de Regulación de Voltaje
    const ctxRegulacion = document.getElementById('graficoRegulacionVoltaje').getContext('2d');
    new Chart(ctxRegulacion, {
      type: 'line',
      data: {
        labels: cargasSimuladas,
        datasets: [
          {
            label: 'Regulación de Voltaje (%)',
            data: regulacionesSimuladas,
            borderColor: 'blue',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
            },
            zoom: {
              enabled: true,
              mode: 'xy',
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Carga (%)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Regulación (%)'
            }
          }
        }
      }
    });

    // Gráfico de Voltaje vs Corriente
    const ctxVoltajeCorriente = document.getElementById('graficoVoltajeCorriente').getContext('2d');
    new Chart(ctxVoltajeCorriente, {
      type: 'line',
      data: {
        labels: cargasSimuladas,
        datasets: [
          {
            label: 'Voltaje de Salida (V)',
            data: voltajes,
            borderColor: 'orange',
            fill: false,
            yAxisID: 'y1',
          },
          {
            label: 'Corriente de Salida (A)',
            data: corrientes,
            borderColor: 'purple',
            fill: false,
            yAxisID: 'y2',
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
            },
            zoom: {
              enabled: true,
              mode: 'xy',
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Carga (%)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Voltaje (V)'
            }
          },
          y2: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Corriente (A)'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    });

    // Gráfico de Potencia vs Corriente
    const ctxPotenciaCorriente = document.getElementById('graficoPotenciaCorriente').getContext('2d');
    new Chart(ctxPotenciaCorriente, {
      type: 'line',
      data: {
        labels: cargasSimuladas,
        datasets: [
          {
            label: 'Potencia de Salida (W)',
            data: potencias,
            borderColor: 'brown',
            fill: false,
            yAxisID: 'y1',
          },
          {
            label: 'Corriente de Salida (A)',
            data: corrientes,
            borderColor: 'purple',
            fill: false,
            yAxisID: 'y2',
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
            },
            zoom: {
              enabled: true,
              mode: 'xy',
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Carga (%)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Potencia (W)'
            }
          },
          y2: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Corriente (A)'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    });
  }
}

// Código para manejar el contenido colapsable en las fórmulas
document.addEventListener('DOMContentLoaded', function() {
  const coll = document.getElementsByClassName('collapsible');
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    });
  }

  // Mostrar historial si estamos en historial.html
  if (document.getElementById('historial')) {
    mostrarHistorialCalculos();
  }
});

// Función para exportar los resultados a PDF
function exportarResultados() {
  const resultados = document.body;
  html2canvas(resultados).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('resultados.pdf');
  });
}

// Mostrar historial seleccionado en resultadohistorial.html
if (document.getElementById('resultado')) {
  const index = localStorage.getItem('resultadoSeleccionado');
  const historialCalculos = JSON.parse(localStorage.getItem('historialCalculos')) || [];

  if (index !== null && historialCalculos[index]) {
    document.getElementById('resultado').innerHTML = historialCalculos[index].resultadosHTML;
  } else {
    document.getElementById('resultado').innerHTML = "<p>No se encontró el cálculo seleccionado.</p>";
  }
}

// Manejo de ejercicios prácticos
if (document.getElementById('ejercicio1Form')) {
  document.getElementById('ejercicio1Form').addEventListener('submit', function(event) {
    event.preventDefault();
    const respuesta = parseFloat(document.getElementById('respuesta1').value);
    const respuestaCorrecta = 220 / 110; // Relación de transformación

    if (Math.abs(respuesta - respuestaCorrecta) < 0.01) {
      document.getElementById('feedback1').innerHTML = '<p style="color: green;">¡Correcto!</p>';
    } else {
      document.getElementById('feedback1').innerHTML = '<p style="color: red;">Incorrecto. Intenta nuevamente.</p>';
    }
  });
}
