// Clave donde guardamos las sesiones en localStorage.
const CLAVE = "diario-estudio-sesiones";

const formulario = document.getElementById("formulario");
const campoFecha = document.getElementById("fecha");
const campoTema = document.getElementById("tema");
const campoMinutos = document.getElementById("minutos");
const mensajeError = document.getElementById("error");
const lista = document.getElementById("lista");
const textoVacio = document.getElementById("vacio");
const textoRacha = document.getElementById("racha");
const textoMejorRacha = document.getElementById("mejor-racha");
const textoMinutosSemana = document.getElementById("minutos-semana");
const textoDiasMes = document.getElementById("dias-mes");
const mapa = document.getElementById("mapa");

const NOMBRES_MES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const NOMBRES_NIVEL = {
  vacio: "vacío",
  suave: "suave",
  medio: "medio",
  intenso: "intenso",
  futuro: "día futuro"
};

// Devuelve la fecha de hoy en formato "AAAA-MM-DD" usando la hora local.
function hoyLocal() {
  const ahora = new Date();
  const ano = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return ano + "-" + mes + "-" + dia;
}

// Convierte "AAAA-MM-DD" en un objeto Date local (sin usar UTC).
function textoAFechaLocal(texto) {
  const partes = texto.split("-");
  const ano = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const dia = Number(partes[2]);
  return new Date(ano, mes, dia);
}

// Convierte un objeto Date local en texto "AAAA-MM-DD".
function fechaLocalATexto(fecha) {
  const ano = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return ano + "-" + mes + "-" + dia;
}

// Lee las sesiones guardadas. Si no hay nada, devuelve una lista vacía.
function cargarSesiones() {
  const texto = localStorage.getItem(CLAVE);
  if (!texto) {
    return [];
  }
  try {
    const datos = JSON.parse(texto);
    if (Array.isArray(datos)) {
      return datos;
    }
    return [];
  } catch (e) {
    return [];
  }
}

function guardarSesiones(sesiones) {
  localStorage.setItem(CLAVE, JSON.stringify(sesiones));
}

// Devuelve el día de una sesión ("AAAA-MM-DD").
// Acepta "fecha" (formato real) y "date" (formato descrito en AGENTS.md)
// para no perder sesiones ya guardadas.
function obtenerFecha(sesion) {
  return sesion.fecha || sesion.date;
}

// Calcula la racha: días seguidos con sesión que terminan hoy.
// Si hoy aún no tiene sesión, se empieza a contar desde ayer.
function calcularRacha(sesiones) {
  const diasConSesion = new Set(sesiones.map(obtenerFecha));

  let fecha = textoAFechaLocal(hoyLocal());

  // Si hoy no hay sesión, la racha sigue viva desde ayer.
  if (!diasConSesion.has(fechaLocalATexto(fecha))) {
    fecha.setDate(fecha.getDate() - 1);
  }

  let racha = 0;
  while (diasConSesion.has(fechaLocalATexto(fecha))) {
    racha = racha + 1;
    fecha.setDate(fecha.getDate() - 1);
  }
  return racha;
}

// Calcula la mejor racha: el grupo de días seguidos con sesión más largo.
// Ignora las fechas futuras y cuenta varias sesiones del mismo día como un día.
function calcularMejorRacha(sesiones) {
  const hoy = hoyLocal();
  const dias = Array.from(new Set(sesiones.map(obtenerFecha)))
    .filter(function (dia) { return dia && dia <= hoy; })
    .sort();

  let mejor = 0;
  let actual = 0;
  let anterior = null;

  dias.forEach(function (dia) {
    const fecha = textoAFechaLocal(dia);
    if (anterior !== null) {
      const copia = new Date(anterior.getTime());
      copia.setDate(copia.getDate() + 1);
      if (fechaLocalATexto(copia) === dia) {
        actual = actual + 1;
      } else {
        actual = 1;
      }
    } else {
      actual = 1;
    }
    anterior = fecha;
    if (actual > mejor) {
      mejor = actual;
    }
  });

  return mejor;
}

// Devuelve los minutos de una sesión.
// Acepta "minutos" (formato real) y "minutes" para no perder datos antiguos.
function obtenerMinutos(sesion) {
  return Number(sesion.minutos || sesion.minutes) || 0;
}

// Calcula los minutos estudiados esta semana (lunes a domingo en fecha local).
// Solo suma días entre el lunes y hoy: las fechas futuras no cuentan.
function calcularMinutosSemana(sesiones) {
  const hoyTexto = hoyLocal();
  const hoyFecha = textoAFechaLocal(hoyTexto);
  const diasDesdeLunes = (hoyFecha.getDay() + 6) % 7;
  const lunes = new Date(hoyFecha.getTime());
  lunes.setDate(lunes.getDate() - diasDesdeLunes);
  const lunesTexto = fechaLocalATexto(lunes);

  let total = 0;
  sesiones.forEach(function (sesion) {
    const dia = obtenerFecha(sesion);
    if (dia && dia >= lunesTexto && dia <= hoyTexto) {
      total = total + obtenerMinutos(sesion);
    }
  });
  return total;
}

// Calcula cuántos días distintos se ha estudiado este mes (mes natural en fecha local).
// Solo cuenta días entre el día 1 y hoy: las fechas futuras no cuentan.
function calcularDiasMes(sesiones) {
  const hoy = hoyLocal();
  const prefijoMes = hoy.slice(0, 7);
  const dias = new Set();
  sesiones.forEach(function (sesion) {
    const dia = obtenerFecha(sesion);
    if (dia && dia.slice(0, 7) === prefijoMes && dia <= hoy) {
      dias.add(dia);
    }
  });
  return dias.size;
}

// Muestra la fecha "AAAA-MM-DD" como "12/03/2026".
function formatoCorto(texto) {
  const partes = texto.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Muestra la fecha "AAAA-MM-DD" como "3 de octubre de 2026".
function formatoLargo(texto) {
  const partes = texto.split("-");
  const dia = Number(partes[2]);
  const mes = NOMBRES_MES[Number(partes[1]) - 1];
  return dia + " de " + mes + " de " + partes[0];
}

// Pinta el mapa de calor con las sesiones guardadas.
// Cada celda solo muestra color: el detalle va en el aria-label en español.
function mostrarMapa(sesiones) {
  const celdas = heatmapData(sesiones, hoyLocal());
  mapa.innerHTML = "";
  celdas.forEach(function (celda) {
    const item = document.createElement("li");
    item.className = "nivel-" + celda.level;
    item.setAttribute("aria-label", formatoLargo(celda.date) + ", " + NOMBRES_NIVEL[celda.level]);
    mapa.appendChild(item);
  });
}

function mostrar() {
  const sesiones = cargarSesiones();

  // Ordenar de la más reciente a la más antigua.
  sesiones.sort(function (a, b) {
    const fechaA = obtenerFecha(a);
    const fechaB = obtenerFecha(b);
    if (fechaA < fechaB) return 1;
    if (fechaA > fechaB) return -1;
    return 0;
  });

  textoRacha.textContent = calcularRacha(sesiones);
  textoMejorRacha.textContent = calcularMejorRacha(sesiones);
  textoMinutosSemana.textContent = calcularMinutosSemana(sesiones);
  textoDiasMes.textContent = calcularDiasMes(sesiones);
  mostrarMapa(sesiones);

  lista.innerHTML = "";
  textoVacio.hidden = sesiones.length > 0;

  sesiones.forEach(function (sesion) {
    const item = document.createElement("li");

    const izquierda = document.createElement("div");
    const tema = document.createElement("p");
    tema.className = "sesion-tema";
    tema.textContent = sesion.tema || sesion.topic;
    const fecha = document.createElement("p");
    fecha.className = "sesion-fecha";
    fecha.textContent = "📅 " + formatoCorto(obtenerFecha(sesion));
    izquierda.appendChild(tema);
    izquierda.appendChild(fecha);

    const minutos = document.createElement("span");
    minutos.className = "sesion-minutos";
    minutos.textContent = (sesion.minutos || sesion.minutes) + " min";

    item.appendChild(izquierda);
    item.appendChild(minutos);
    lista.appendChild(item);
  });
}

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.hidden = false;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeError.hidden = true;

  const fecha = campoFecha.value;
  const tema = campoTema.value.trim();
  const minutos = Number(campoMinutos.value);

  if (!fecha) {
    mostrarError("Elige una fecha.");
    return;
  }
  if (!tema) {
    mostrarError("Escribe un tema.");
    return;
  }
  if (!Number.isInteger(minutos) || minutos <= 0) {
    mostrarError("Los minutos tienen que ser un número mayor que 0.");
    return;
  }

  const sesiones = cargarSesiones();
  sesiones.push({ fecha: fecha, tema: tema, minutos: minutos });
  guardarSesiones(sesiones);

  // Dejar el formulario listo para la próxima sesión.
  campoFecha.value = hoyLocal();
  campoTema.value = "";
  campoMinutos.value = "";

  mostrar();
});

// Al abrir la página, la fecha empieza en hoy y se muestra lo guardado.
campoFecha.value = hoyLocal();
mostrar();
