# Tareas 002 — Objetivo semanal

Fuente: `spec.md` (qué) y `plan.md` (cómo). Orden de dependencia: primero
lógica + tests en verde (puerta), después interfaz, al final verificación.
Prohibido avanzar con tests en rojo.

## Fase 1 — Lógica pura y tests

- [ ] **T1 — Minutos semanales (`weeklyMinutes`)**. RF: RF-4, RF-6, RF-7.
- Hecho cuando: `node --test test-objetivo.js` está en verde con suma
lunes–hoy, exclusión de domingo anterior/futuras/ilegibles, semana vacía a 0
y `today` en lunes con un solo día.
- [ ] **T2 — Validez y estado (`isValidGoal`, `goalStatus`)**. RF: RF-1, RF-2, RF-5.
- Hecho cuando: tests en verde con 1 y 10080 válidos; 0, negativos,
decimales, 10081, texto y vacío no válidos; 300/300 y 320/300 cumplidos;
250/300 con 50 restantes.

## Fase 2 — Interfaz

- [ ] **T3 — Tarjeta HTML del objetivo en su posición**. RF: RF-1, RF-4, RF-5.
- Hecho cuando: el snapshot de DevTools muestra la tarjeta "Objetivo
semanal" entre marcadores y mapa, con formulario, progreso, estado y textos
en español.
- [ ] **T4 — Pegamento en `app.js` (meta, validación y repintado)**. RF: RF-1, RF-2, RF-3, RF-4.
- Hecho cuando: fijar 300 muestra `X de 300 min`, un valor no válido muestra
error y conserva la meta, recargar conserva la meta y la consola está limpia.
- [ ] **T5 — Estilos mínimos y móvil**. RF: RF-4, RF-5.
- Hecho cuando: captura a 375 px legible sin desplazamiento lateral, con la
línea de cumplido distinguible y sin romper el resto.

## Fase 3 — Verificación final

- [ ] **T6 — Pase completo de criterios de finalización**. RF: todos.
- Hecho cuando: tests en verde, 0 errores de consola, 375 px legible,
casos límite de la spec comprobados en el navegador y commit hecho.
