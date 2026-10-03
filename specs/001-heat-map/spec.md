# Especificación 001 — Mapa de calor de estudio

## Contexto y objetivo

El Diario de Estudio ya muestra la racha actual, la mejor racha y los totales
semanal y mensual, pero son números aislados: no se ve de un vistazo la
constancia a lo largo del tiempo ni dónde están los huecos sin estudio.

El objetivo es añadir un mapa de calor estilo GitHub que muestre los días
estudiados de las últimas 12 semanas. Cada día se pinta con una intensidad de
color según los minutos estudiados: de un vistazo se ve la constancia, las
rachas largas y los días flojos. Es solo visual: no sustituye a la lista de
sesiones ni a los marcadores existentes.

## Usuarios

- **Estudiante (usuario único)**: quiere motivarse viendo su constancia y
detectar de un vistazo los días que no estudió.

## Historias de usuario

- **HU-1**: Como estudiante, quiero ver mis últimas 12 semanas en una rejilla
de días coloreados para apreciar mi constancia de un vistazo.
- **HU-2**: Como estudiante, quiero que los días con más minutos se vean más
intensos para distinguir el esfuerzo de cada día.
- **HU-3**: Como estudiante, quiero distinguir los días futuros de los días
pasados sin estudio para no confundir "aún no llega" con "no estudié".

## Requisitos funcionales

- **RF-1 — Ventana de 12 semanas naturales**: el mapa muestra 12 semanas
naturales de lunes a domingo: la semana actual más las 11 anteriores.
  - *Criterio (EARS, evento)*: Cuando se carga la página, el sistema deberá
mostrar un día por cada fecha de esas 12 semanas, hasta el domingo de la
semana actual (los días posteriores a hoy se atenúan según RF-4).
- **RF-2 — Minutos por día**: los minutos de un día son la suma de todas sus
sesiones.
  - *Criterio (EARS, ubicuo)*: El sistema deberá sumar los minutos de todas
las sesiones del mismo día para calcular su intensidad.
- **RF-3 — Niveles de intensidad fijos**: cada día pasado se pinta según sus
minutos con 4 niveles: 0 = vacío, 1–29 = suave, 30–59 = medio, 60 o más =
intenso.
  - *Criterio (EARS, estado)*: Mientras un día pasado tenga 0 minutos, el
sistema deberá pintarlo con el color vacío; si tiene entre 1 y 29, con el
suave; si tiene entre 30 y 59, con el medio; si tiene 60 o más, con el
intenso.
  - *Criterio (EARS, evento)*: Cuando un día acumule minutos que crucen un
umbral (por ejemplo de 29 a 30), el sistema deberá subirlo al nivel
correspondiente al mostrar el mapa.
- **RF-4 — Días futuros atenuados**: los días posteriores a hoy dentro de la
ventana se muestran apagados, sin nivel de intensidad.
  - *Criterio (EARS, estado)*: Mientras una fecha sea posterior a hoy, el
sistema deberá mostrarla atenuada y no aplicarle ningún nivel de intensidad,
aunque tenga sesiones registradas.
- **RF-5 — Leyenda en español**: el mapa incluye una leyenda con los
4 niveles usando solo etiquetas (vacío, suave, medio, intenso), sin rangos
numéricos.
  - *Criterio (EARS, ubicuo)*: El sistema deberá mostrar siempre la leyenda
junto al mapa con los 4 niveles y sus textos en español.
- **RF-6 — Solo visual**: las celdas no tienen tooltip, clic ni detalle por
día; toda la información sigue estando en la lista de sesiones.
  - *Criterio (EARS, no deseado)*: Si el usuario interactúa con una celda
(pasar el cursor, tocarla), el sistema no deberá mostrar información
adicional ni navegar a otra vista.
- **RF-7 — Posición**: el mapa se muestra debajo de los marcadores de racha.
  - *Criterio (EARS, evento)*: Cuando se carga la página, el sistema deberá
mostrar el mapa de calor debajo de los marcadores de racha actual y mejor
racha.

## Requisitos no funcionales

- **RNF-1 — Comprensible**: cualquier día del mapa se entiende sin explicación
previa gracias a la leyenda en español.
- **RNF-2 — Móvil**: el mapa se ve completo y legible en una pantalla de
375 px de ancho.
- **RNF-3 — Coherencia con el diario**: usa las mismas reglas de fechas que
el resto de la app (hora local del usuario; las sesiones futuras no cuentan
para la intensidad de los días pasados y los días futuros nunca suben de
nivel).
- **RNF-4 — Lógica verificable**: el cálculo de niveles e intensidades está
cubierto por pruebas automatizadas que fijan el día "hoy" como parámetro,
sin depender de la fecha real.

## Casos límite

- Día con varias sesiones: se suman (p. ej. 20 + 15 = 35 → nivel medio).
- Minutos justo en el borde: 29 es suave, 30 es medio; 59 es medio, 60 es
intenso.
- Día de hoy sin sesiones: se pinta como vacío, igual que cualquier día
pasado sin estudio.
- Sin sesiones en toda la ventana: el mapa se muestra entero en color vacío
con su leyenda, sin errores ni avisos.
- Sesiones registradas en fechas futuras: no alteran ningún día pasado; los
días futuros siguen atenuados.
- Cambio de día con la página abierta: al recargar, la ventana se recalcula
sobre el nuevo hoy.

## Fuera de alcance

- Detalle por día (tooltips, clics, ventanas con fecha y minutos).
- Umbrales o número de semanas configurables por el usuario.
- Otras ventanas temporales (mes, año, toda la historia) o navegación entre
periodos.
- Personalización de colores o modo oscuro.
- Cambios en el formato de los datos guardados o en el formulario de
sesiones.

## Criterios de finalización

- Todos los criterios de aceptación de RF-1 a RF-7 se cumplen.
- Los casos límite se comportan como se describe.
- La página no muestra errores en la consola.
- El mapa se revisa en vista móvil de 375 px y es legible sin desplazamiento
lateral.
- No queda ninguna duda abierta sin resolver.

## Dudas abiertas

Sin dudas abiertas: las tres iniciales se resolvieron el 03/10/2026
(ventana = 12 semanas naturales lun–dom; posición = debajo de los
marcadores; leyenda = solo etiquetas) y están recogidas en RF-1, RF-5
y RF-7.
