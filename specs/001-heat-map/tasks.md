# Tareas 001 — Mapa de calor de estudio

Fuente: `spec.md` (qué) y `plan.md` (cómo). Orden de dependencia: primero
lógica + tests en verde (puerta), después interfaz, al final verificación.
Nada de atajos: prohibido avanzar con tests en rojo.

## Fase 1 — Lógica pura y tests

- [x] **T1 — Ventana de 12 semanas (`mondayOfWeek`, `weekWindow`)**. RF: RF-1.
  Hecho cuando: `node --test test-mapa.js` está en verde con casos de lunes
  de semana dada, ventana de 84 días que empieza en lunes, cruce de año y
  `today` en domingo sin futuros.
- [x] **T2 — Minutos y niveles (`minutesPerDay`, `levelForMinutes` )**. RF: RF-2, RF-3.
  Hecho cuando: tests en verde con bordes 0/1/29/30/59/60, suma del mismo día
  (20+15→medio), sesión de 0 min→vacío, formatos heredados y fecha ilegible
  excluida sin errores.
- [x] **T3 — Datos del mapa (`heatmapData`)**. RF: RF-1, RF-2, RF-3, RF-4.
  Hecho cuando: tests en verde con 84 celdas, días futuros marcados aunque
  tengan sesiones, sesiones futuras que no suman, hoy sin sesiones en vacío y
  ventana sin sesiones sin errores.

## Fase 2 — Interfaz

- [x] **T4 — Sección HTML (mapa + leyenda) en su posición**. RF: RF-5, RF-7, RF-8.
  Hecho cuando: el snapshot de DevTools muestra la sección inmediatamente
  debajo de la tarjeta de marcadores y encima del formulario, con la leyenda
  de 4 etiquetas más día futuro, todo en español.
- [x] **T5 — Estilos (grid, 5 estados, móvil)**. RF: RF-3, RF-4, RF-5.
  Hecho cuando: captura a 375 px muestra 12 columnas × 7 filas sin
  desplazamiento lateral, niveles distinguibles y futuros con borde
  discontinuo distinto del vacío.
- [x] **T6 — Pegamento en `app.js` (pintar + refresco + aria)**. RF: RF-1, RF-2, RF-6, RF-8.
  Hecho cuando: registrar 3 sesiones (hoy/ayer/anteayer) actualiza el mapa sin
  recargar con niveles correctos, cada celda tiene su `aria-label` en español
  y la consola está limpia.

## Fase 3 — Verificación final

- [x] **T7 — Pase completo de criterios de finalización**. RF: todos.
  Hecho cuando: tests en verde, 0 errores de consola, 375 px legible sin
  scroll lateral, casos límite de la spec comprobados en el navegador y
  commit hecho.
