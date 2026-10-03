# Especificación 001 — Mapa de calor de estudio

## Contexto y objetivo

El Diario de Estudio ya muestra la racha actual, la mejor racha y los totales
semanal y mensual, pero son números aislados: no se ve de un vistazo la
constancia a lo largo del tiempo ni dónde están los huecos sin estudio.

El objetivo es añadir un mapa de calor estilo GitHub que muestre los días
estudiados de las 12 semanas naturales (la semana actual más las 11
anteriores). Cada día se pinta con una intensidad de
color según los minutos estudiados: de un vistazo se ve la constancia, las
rachas largas y los días flojos. Es solo visual: no sustituye a la lista de
sesiones ni a los marcadores existentes.

## Usuarios

- **Estudiante (usuario único)**: quiere motivarse viendo su constancia y
detectar de un vistazo los días que no estudió.

## Historias de usuario

- **HU-1**: Como estudiante, quiero ver las 12 semanas naturales (actual +
11 anteriores) en una rejilla de días coloreados para apreciar mi constancia
de un vistazo.
- **HU-2**: Como estudiante, quiero que los días con más minutos se vean más
intensos para distinguir el esfuerzo de cada día.
- **HU-3**: Como estudiante, quiero distinguir los días futuros de los días
pasados sin estudio para no confundir "aún no llega" con "no estudié".

## Requisitos funcionales

- **RF-1 — Ventana de 12 semanas naturales**: el mapa muestra 12 semanas
naturales de lunes a domingo: la semana actual más las 11 anteriores. Cada
semana es una columna; dentro de cada columna los días van de lunes (arriba)
a domingo (abajo); las columnas van de más antigua (izquierda) a más
reciente (derecha).
  - *Criterio (EARS, evento)*: Cuando se carga la página, el sistema deberá
mostrar un día por cada fecha de esas 12 semanas, hasta el domingo de la
semana actual (los días posteriores a hoy se atenúan según RF-4).
  - *Criterio (EARS, evento)*: Cuando se guarda una sesión, el sistema deberá
actualizar el mapa sin necesidad de recargar la página.
- **RF-2 — Minutos por día**: los minutos de un día son la suma de todas sus
sesiones guardadas en el diario. Las sesiones con fecha posterior a hoy no
suman en ningún día. Los formatos heredados se leen con las mismas reglas
que el resto de la app y los datos guardados nunca se modifican.
  - *Criterio (EARS, ubicuo)*: El sistema deberá sumar, para cada día no
futuro, los minutos de todas sus sesiones guardadas para calcular su
intensidad.
  - *Criterio (EARS, no deseado)*: Si una sesión tiene una fecha ilegible, el
sistema deberá excluirla del mapa sin modificar ni borrar los datos
guardados.
- **RF-3 — Niveles de intensidad fijos**: cada día no futuro (incluido hoy)
se pinta según sus minutos con 4 niveles: 0 = vacío, 1–29 = suave, 30–59 =
medio, 60 o más = intenso.
  - *Criterio (EARS, estado)*: Mientras un día no futuro tenga 0 minutos, el
sistema deberá pintarlo con el color vacío; si tiene entre 1 y 29, con el
suave; si tiene entre 30 y 59, con el medio; si tiene 60 o más, con el
intenso.
  - *Criterio (EARS, evento)*: Cuando un día acumule minutos que crucen un
umbral (por ejemplo de 29 a 30), el sistema deberá subirlo al nivel
correspondiente al mostrar el mapa.
- **RF-4 — Días futuros atenuados**: los días posteriores a hoy dentro de la
ventana se muestran con un estilo atenuado claramente distinto del color
vacío (fondo neutro con borde discontinuo), sin nivel de intensidad.
  - *Criterio (EARS, estado)*: Mientras una fecha sea posterior a hoy, el
sistema deberá mostrarla atenuada y no aplicarle ningún nivel de intensidad,
aunque tenga sesiones registradas.
- **RF-5 — Leyenda en español**: el mapa incluye una leyenda con los
4 niveles usando solo etiquetas (vacío, suave, medio, intenso), sin rangos
numéricos, más el estado de día futuro.
  - *Criterio (EARS, ubicuo)*: El sistema deberá mostrar siempre la leyenda
junto al mapa con los 4 niveles y el estado de día futuro, con sus textos
en español.
- **RF-6 — Solo visual**: las celdas no tienen tooltip, clic ni detalle por
día; toda la información sigue estando en la lista de sesiones.
  - *Criterio (EARS, no deseado)*: Si el usuario interactúa con una celda
(pasar el cursor, tocarla), el sistema no deberá mostrar información
adicional ni navegar a otra vista.
- **RF-7 — Posición**: el mapa se muestra inmediatamente debajo de la tarjeta
de marcadores de racha (racha actual y mejor racha), antes que el formulario
de nueva sesión.
  - *Criterio (EARS, evento)*: Cuando se carga la página, el sistema deberá
mostrar el mapa de calor inmediatamente debajo de la tarjeta de marcadores
y encima del formulario de nueva sesión.
- **RF-8 — Accesible al lector de pantalla**: cada celda expone en español su
fecha y su nivel (o día futuro) al lector de pantalla, sin cambiar el diseño
visual ni añadir información visible.
  - *Criterio (EARS, ubicuo)*: El sistema deberá anunciar cada celda con su
fecha y su nivel en español, de modo que el mapa se entiende sin verlo.

## Requisitos no funcionales

- **RNF-1 — Comprensible**: cualquier día del mapa se entiende sin explicación
previa gracias a la leyenda en español.
- **RNF-2 — Móvil**: el mapa se ve completo y legible en una pantalla de
375 px de ancho, sin desplazamiento lateral.
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
- Día con una sesión de 0 minutos: cuenta como nivel vacío.
- Sin sesiones en toda la ventana: los días no futuros se muestran en color
vacío y los días futuros atenuados, con su leyenda, sin errores ni avisos.
- Sesión con fecha ilegible o formato heredado: se lee con las mismas reglas
que el resto de la app; si la fecha no se puede interpretar, no altera el
mapa y los datos guardados no cambian.
- Ventana que cruza un cambio de año: las semanas se siguen calculando de
lunes a domingo en hora local.
- Hoy es domingo: la ventana no contiene días futuros y el mapa muestra solo
días no futuros.
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

- Todos los criterios de aceptación de RF-1 a RF-8 se cumplen.
- Los casos límite se comportan como se describe.
- Las pruebas automatizadas están en verde.
- La página no muestra errores en la consola.
- El mapa se revisa en vista móvil de 375 px y es legible sin desplazamiento
lateral.
- No queda ninguna duda abierta sin resolver.

## Dudas abiertas

Sin dudas abiertas: las tres iniciales se resolvieron el 03/10/2026
(ventana = 12 semanas naturales lun–dom; posición = debajo de los
marcadores; leyenda = solo etiquetas) y están recogidas en RF-1, RF-5
y RF-7. La revisión QA del 03/10/2026 (20 puntos) se resolvió en RF-1,
RF-2, RF-3, RF-4, RF-5, RF-7, RF-8 (nuevo), RNF-2, casos límite y
finalización.
