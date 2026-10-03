# Plan 002 — Objetivo semanal

Cómo implementar la spec `spec.md` (aprobada) respetando la constitución.
Sin código: solo decisiones, responsabilidades y pseudocódigo.

## Archivos: qué se crea o modifica

- **`logica.js` (MODIFICA, solo añade)**: tres funciones puras nuevas para el
objetivo (`weeklyMinutes`, `isValidGoal`, `goalStatus`). Sin DOM ni
localStorage: reciben sesiones, meta y "hoy" como parámetros. No se toca lo
existente. Cubre RF-4, RF-5, RF-6, RF-7 y RNF-5.
- **`test-objetivo.js` (NUEVO)**: pruebas con `node --test` y módulos
integrados, con el mismo cargador `fs`+`vm` que `test-mapa.js`. Cubre la
puerta de tests de finalización.
- **`index.html` (MODIFICA)**: nueva tarjeta "Objetivo semanal" con
formulario (número + botón), línea de progreso y línea de estado,
inmediatamente debajo de la tarjeta de marcadores y encima del mapa de
calor. Cubre RF-1, RF-4, RF-5 y RNF-1/RNF-2/RNF-3.
- **`app.js` (MODIFICA, mínimo)**: pegamento ya conocido: leer/guardar la
meta en una clave propia de localStorage (`diario-estudio-objetivo`, sin
tocar la clave de sesiones), validar al guardar y repintar en `mostrar()`.
Cubre RF-1, RF-2, RF-3, RF-4 y RNF-4.
- **`styles.css` (MODIFICA, mínimo)**: reutiliza los estilos de formulario y
tarjeta existentes; solo un estilo para la línea de estado cumplido. Cubre
RNF-1 y RNF-2.

## Funciones puras necesarias (en `logica.js`, código en inglés)

- **`weeklyMinutes(sessions, today)`**: suma los minutos de sesiones con
fecha entre el lunes de `today` y `today` (ambos incluidos, hora local);
futuras e ilegibles fuera. Reutiliza `mondayOfWeek` y `minutesPerDay`.
Cubre RF-4, RF-6, RF-7.
- **`isValidGoal(value)`**: verdadero solo si es entero entre 1 y 10080.
Cubre RF-1 y RF-2.
- **`goalStatus(minutes, goal)`**: devuelve `{ done, remaining }`, donde
`done` es verdadero si `minutes >= goal` y `remaining` es `goal - minutes`
(o 0 si cumplido). Cubre RF-5.

## Algoritmo (pseudocódigo)

```
weeklyMinutes(sesiones, hoy):
  lunes = mondayOfWeek(hoy)
  minutos = minutesPerDay(sesiones)   # heredados OK, ilegibles fuera
  total = 0
  para cada (dia, m) en minutos:
    si lunes <= dia <= hoy:
      total = total + m
  devolver total

goalStatus(minutos, meta):
  si minutos >= meta: devolver { cumplido: sí, faltan: 0 }
  si no: devolver { cumplido: no, faltan: meta - minutos }
```

Comparaciones de texto `AAAA-MM-DD`; hora local; prohibido `toISOString()`
y `new Date("AAAA-MM-DD")` (RF-7).

## Cómo se pinta en la interfaz

- Tarjeta "🎯 Objetivo semanal" con: formulario (etiqueta, número con
`min="1"`, `max="10080"`, `step="1"` y botón "Guardar objetivo"), línea de
progreso (`X de Y min`) y línea de estado ("Te faltan Z min" o
"¡Objetivo cumplido! 🎉").
- Sin meta guardada: se muestra el formulario y los minutos actuales de la
semana, sin progreso ni estado (caso límite de la spec).
- Valor no válido: mensaje de error junto al formulario; se conserva la meta
anterior (RF-2).
- El repintado reutiliza `mostrar()`: al cargar, al guardar sesión y al
guardar objetivo (RF-4).

## Decisiones técnicas (y alternativa descartada)

1. **Meta en clave propia (`diario-estudio-objetivo`), no dentro del array
de sesiones**: las sesiones son sagradas y su formato no cambia (RF-7 de
spec 002 y fuera de alcance). *Descartado*: guardar la meta junto a las
sesiones (rozaría el formato y obligaría a migrar datos).
2. **`weeklyMinutes` nueva en vez de reutilizar `calcularMinutosSemana`**:
la existente lee "hoy" de dentro y no es testeable con `today` como
parámetro (constitución 3). *Descartado*: testear la existente (imposible
sin fecha real) o duplicar su cuerpo en el test (no protegería el código).
3. **Límite 10080 documentado en spec y validado en lógica y formulario**:
minutos máximos de una semana; el HTML lo sugiere y la función pura lo
impone. *Descartado*: sin límite (metas absurdas) o solo límite HTML
(saltable desde consola).
4. **Sin meta inicial**: respeta "poder fijar" sin imponer una meta ajena;
el editor visible invita a fijarla. *Descartado*: meta por defecto 300
(cambiaría el comportamiento sin que el usuario lo pidiera).
5. **Posición entre marcadores y mapa**: el objetivo resume la semana, como
los marcadores; va con ellos, antes del detalle (mapa, sesiones).
*Descartado*: dentro de la tarjeta de marcadores (mezclaría editar con
mostrar) o al final (quedaría escondido).

## Estrategia de tests (`node --test`, sin paquetes)

- **Puerta**: primero `logica.js` + `test-objetivo.js` en verde; la interfaz
después. Prohibido avanzar en rojo.
- **Casos** (`today` fijado como texto):
  - `weeklyMinutes`: suma lunes–hoy; excluye domingo anterior, hoy futuro y
fechas ilegibles; semana vacía → 0; `today` en lunes → solo ese día.
  - `isValidGoal`: 1 y 10080 válidos; 0, -5, 2.5, 10081, texto y vacío no
válidos.
  - `goalStatus`: 300/300 cumplido con 0 restantes; 320/300 cumplido;
250/300 con 50 restantes.
- **No cubierto por tests** (verificación manual con DevTools): posición,
textos, error visible, 375 px, consola limpia y persistencia al recargar.

## Cobertura RF por parte del plan

- RF-1: formulario + `isValidGoal` + guardado en clave propia.
- RF-2: validación en lógica y formulario; se conserva la meta anterior.
- RF-3: lectura de la clave al cargar; la meta no depende de la semana.
- RF-4: `weeklyMinutes` + línea `X de Y min` + repintado en `mostrar()`.
- RF-5: `goalStatus` + línea de estado.
- RF-6: la ventana nace del lunes de `today`; al cambiar de semana el
cálculo parte de cero solo.
- RF-7: lunes–domingo local y exclusión de futuras en `weeklyMinutes`.
