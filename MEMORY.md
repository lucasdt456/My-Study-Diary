# MEMORY.md — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- Spec 001 terminada: mapa de calor con 12 semanas, 19 tests en verde,
verificado en Chrome a 375 px (84 celdas, niveles, aria, consola limpia).
- v1 + mejor racha + fecha destacada + total semanal + días del mes + diseño cuaderno:
registrar sesiones, racha actual, mejor racha, minutos semanales, días del mes y lista.
- Datos en localStorage, clave `diario-estudio-sesiones`.
- Git iniciado: repo en `main`, primer commit con la base + `.gitignore`.

## Decisiones (y por qué)
- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic.
- Fecha editable en el formulario: permite registrar días pasados y ver la racha crecer.
- Mejor racha recalculada en cada `mostrar()`, no guardada: así nunca se desincroniza.
- Compatibilidad `fecha/date`, `tema/topic`, `minutos/minutes` al leer: AGENTS.md
decía `date/topic/minutes` pero el código guardaba `fecha/tema/minutos`.
- Corregido AGENTS.md a `{ fecha, tema, minutos }` (solo documentación, sin migrar datos).
- Fecha llamativa solo con CSS y emoji: input azul con foco visible y fecha de la
lista como píldora azul con 📅. Sin cambiar la lógica de fechas ni de racha.
- Total semanal = suma de minutos de lunes a domingo (fecha local); se recalcula
en cada `mostrar()` y excluye futuras. Formato siempre `X min` por simplicidad.
- Días del mes = días distintos del mes natural `AAAA-MM` (fecha local) hasta hoy;
se recalcula en cada `mostrar()` con `Set` y excluye futuras.
- Diseño cuaderno en tinta azul: cabecera a la izquierda, marcador con número grande
+ 3 datos en rejilla, lista con borde lateral azul. Sin fuentes externas ni animaciones.
- Commit tras cada feature o cambio (regla en AGENTS.md): historial claro y didáctico.
- `.gitignore`: node_modules, logs, SO/editores y `opencode.json` (tiene tokens,
nunca se sube).

## Aprendizajes y errores a evitar
- Nunca `toISOString()` ni `new Date("AAAA-MM-DD")`: usan UTC y desplazan el día.
- Fechas futuras no suman: filtrar con `dia <= hoyLocal()` (texto AAAA-MM-DD ordena bien).
- Varias sesiones el mismo día = 1 día: usar `Set` de días únicos.
- Probado en Chromium a 375 px (Playwright y chrome-devtools-mcp): 3 sesiones
(hoy/ayer/anteayer) → racha 3, mejor 3, 0 errores de consola propios.
- chrome-devtools-mcp usa Chrome oficial (canal estable + `--headless`);
se quitó `--executablePath` tras instalar el .deb de Google.

## Próximos pasos
- QA a spec 001 (03/10/2026): detectadas ambigüedades (ejes de la rejilla,
refresco sin recarga, "día pasado" vs hoy), contradicciones (RF-2 suma
incondicional vs RF-4 futuros; caso "sin sesiones" vs atenuados; falta
puerta de tests en finalización) y silencios (compatibilidad legacy,
accesibilidad sin tooltips). Ver conversación.
