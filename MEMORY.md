# MEMORY.md — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
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

## Próximos pasos
- (vacío por ahora)
