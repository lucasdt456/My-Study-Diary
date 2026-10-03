# Plan 001 — Mapa de calor de estudio

Cómo implementar la spec `specs/001-heat-map/spec.md` respetando la
constitución. Sin código: solo decisiones, responsabilidades y pseudocódigo.

## Archivos: qué se crea o modifica

- **`logica.js` (NUEVO)**: solo funciones puras del mapa (ventana, suma por
día, niveles). Sin DOM, sin localStorage: recibe listas y el día "hoy" como
parámetros. Cubre RF-1, RF-2, RF-3, RF-4 y RNF-3/RNF-4.
- **`test-mapa.js` (NUEVO)**: pruebas con `node --test` usando solo módulos
integrados de Node (`node:test`, `node:assert/strict`, `node:fs`,
`node:vm`). Carga `logica.js` en una caja aislada y comprueba la lógica.
Cubre RNF-4 y la puerta de tests de la finalización.
- **`index.html` (MODIFICA)**: añade la sección del mapa (título, rejilla y
leyenda) inmediatamente debajo de la tarjeta de marcadores y encima del
formulario, más una etiqueta `<script src="logica.js">` antes de `app.js`.
Cubre RF-5, RF-7 y RF-8.
- **`styles.css` (MODIFICA)**: estilos de la rejilla, los 5 estados visuales
(4 niveles + futuro atenuado con borde discontinuo) y la leyenda, con ajuste
a 375 px sin desplazamiento lateral. Cubre RF-3, RF-4, RF-5 y RNF-2.
- **`app.js` (MODIFICA, mínimo)**: solo el pegamento entre lo existente y lo
nuevo: llama a las funciones puras con las sesiones guardadas y el hoy local,
y pinta las 84 celdas al mostrar (carga y al guardar). No se toca la lógica
actual de rachas ni el formulario. Cubre RF-1 (refresco), RF-2 y RF-6.

## Funciones puras necesarias (en `logica.js`, código en inglés)

Todas reciben el día "hoy" (`today`, texto `AAAA-MM-DD`) como parámetro y
nunca tocan fecha real, DOM ni almacenamiento.

- **`mondayOfWeek(dateString)`**: devuelve el lunes de la semana de una
fecha, en hora local. Base de RF-1.
- **`weekWindow(today)`**: devuelve las 84 fechas (`AAAA-MM-DD`) de las 12
semanas naturales (actual + 11 anteriores), de lunes a domingo. Cubre RF-1.
- **`minutesPerDay(sessions)`**: agrupa las sesiones por día y suma minutos;
acepta formatos heredados (`fecha/date`, `minutos/minutes`); ignora sesiones
con fecha ilegible sin tocar los datos. Cubre RF-2.
- **`levelForMinutes(minutes)`**: 0 → vacío, 1–29 → suave, 30–59 → medio,
60+ → intenso. Cubre RF-3 y sus bordes.
- **`heatmapData(sessions, today)`**: combina lo anterior y devuelve una
celda por fecha: `{ date, minutes, level }`, donde las fechas posteriores a
`today` llevan marca de futuro en vez de nivel (aunque tengan sesiones).
Cubre RF-1, RF-2, RF-3 y RF-4.

## Algoritmo del mapa (pseudocódigo)

```
heatmapData(sesiones, hoy):
  ventana = weekWindow(hoy)            # 84 fechas lun–dom
  minutos = minutesPerDay(sesiones)    # día -> suma (heredados OK, ilegibles fuera)
  celdas = []
  para cada fecha en ventana:
    si fecha > hoy:                   # comparación de texto AAAA-MM-DD
      celdas.añadir({ fecha, futuro })
    si no:
      m = minutos[fecha] o 0
      celdas.añadir({ fecha, minutos: m, nivel: levelForMinutes(m) })
  devolver celdas
```

Las comparaciones de fechas son de texto (`AAAA-MM-DD` ordena bien) y toda
conversión usa hora local; prohibido `toISOString()` y
`new Date("AAAA-MM-DD")` (RNF-3).

## Cómo se pinta en la interfaz

- La rejilla es una lista (`ul`) de 84 celdas (`li`), una por día, ordenada
por columnas de lunes a domingo con CSS grid: 12 columnas × 7 filas, de más
antigua (izquierda) a más reciente (derecha) (RF-1).
- Cada celda lleva la clase de su estado (4 niveles + futuro atenuado) y un
`aria-label` en español con fecha y nivel, p. ej. "3 de octubre de 2026,
nivel medio" o "5 de octubre de 2026, día futuro" (RF-3, RF-4, RF-8).
- La leyenda muestra los 4 niveles con solo etiquetas más el estado futuro,
todo en español (RF-5, RNF-1).
- Las celdas no tienen tooltip, clic ni enlaces: son `li` sin interacción
(RF-6).
- El repintado reutiliza el `mostrar()` existente: al cargar y al guardar una
sesión se recalcula y repinta el mapa (RF-1, segundo criterio).

## Decisiones técnicas (y alternativa descartada)

1. **Lógica en `logica.js` aparte, no dentro de `app.js`**: `app.js` toca el
DOM al cargarse y no puede ejecutarse en Node; un archivo solo de funciones
puras sí es testeable. *Descartado*: meterlo todo en `app.js` (impediría
probar la lógica sin navegador).
2. **Tests cargan `logica.js` con `node:fs` + `node:vm`** (módulos integrados,
sin paquetes): el navegador lo usa con `<script>` clásico y los tests leen
el mismo archivo, así se prueba el código real. *Descartado*: módulos ES
(rompen `file://` por CORS) y duplicar la lógica en el test (no protegería
el código real).
3. **Rejilla con CSS grid sobre lista `ul/li`**: simple, responsive y cada
celda puede llevar su `aria-label`. *Descartado*: canvas (no accesible, dibujo
manual) y tabla (semántica incorrecta y peor en móvil).
4. **Código nuevo en inglés, pegamento mínimo en español**: la constitución
exige código en inglés; lo existente en español no se reescribe (cambios
pequeños). *Descartado*: seguir en español en lo nuevo (incumpliría la
constitución) o traducir `app.js` entero (reescritura prohibida por
AGENTS.md).
5. **Repintar dentro del `mostrar()` existente**: un único punto de refresco
para carga y guardado. *Descartado*: función de refresco separada llamada
desde varios sitios (dos caminos que mantener sincronizados).

## Estrategia de tests (`node --test`, sin paquetes)

- **Puerta**: primero se escriben `logica.js` y `test-mapa.js`; no se toca la
interfaz hasta que todo está en verde. Prohibido avanzar en rojo.
- **Casos** (cada uno fija `today` como texto, sin fecha real):
  - Umbrales: 0→vacío, 1 y 29→suave, 30 y 59→medio, 60 y 120→intenso.
  - Suma del mismo día: 20+15=35→medio; sesión de 0 min→vacío.
  - Futuros: sesiones posteriores a `today` no suman; esas celdas van
marcadas futuro aunque tengan sesiones.
  - Ventana: empieza en lunes, 84 días, cruza cambio de año; con `today` en
domingo no hay futuros; con `today` en lunes hay 6 futuros.
  - Heredados e ilegibles: `date/topic/minutes` se leen; fecha ilegible se
excluye sin errores.
- **Lo que NO cubren los tests** (se verifica a mano con el MCP de Chrome
DevTools según AGENTS.md): posición RF-7, leyenda RF-5, ausencia de
interacción RF-6, `aria-labels` RF-8, 375 px sin scroll RNF-2, consola
limpia y refresco al guardar.

## Cobertura RF por parte del plan

- RF-1: `weekWindow` + `heatmapData` + repintado en `mostrar()` + grid de
12 columnas.
- RF-2: `minutesPerDay` (+ criterio de ilegibles) y tests de suma,
heredados y futuros.
- RF-3: `levelForMinutes` + clases CSS + tests de bordes.
- RF-4: marca de futuro en `heatmapData` + estilo atenuado + tests.
- RF-5: leyenda en `index.html` + estilos (verificación manual).
- RF-6: celdas sin interacción (verificación manual).
- RF-7: sección en `index.html` en la posición exacta (verificación manual).
- RF-8: `aria-label` por celda (verificación manual con DevTools).
