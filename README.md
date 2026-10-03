# Diario de Estudio 📚

![OpenCode](https://img.shields.io/badge/opencode-%23000000.svg?style=for-the-badge&logo=opencode&logoColor=ffffff)


Web sencilla para registrar sesiones de estudio y motivarte viendo tu racha
de días seguidos, tu mapa de calor y tu objetivo semanal.

> **Repositorio educativo y personal para aprendizaje.**
> Este proyecto ha sido **100 % guiado utilizando OpenCode**: cada decisión,
> cada archivo y cada commit se han construido dialogando con el asistente,
> con el objetivo de **aprender desarrollo con IA** en la práctica.

## Qué hace

- Registrar sesiones (fecha, tema, minutos) que se guardan en el navegador.
- Racha actual de días seguidos y mejor racha histórica.
- Totales de la semana y del mes, mapa de calor de 12 semanas y objetivo
  semanal configurable con su progreso (`X de Y min`).

## Cómo probarlo

1. Haz doble clic en `index.html` (no necesita servidor ni instalación).
2. Registra una sesión y recarga: los datos siguen ahí.
3. Para empezar de cero: DevTools → Application → Local Storage → borra las
   claves `diario-estudio-sesiones` y `diario-estudio-objetivo`.
4. Tests de la lógica: `node --test tests/*.js` (sin paquetes).

## Estructura

- `index.html` — estructura y punto de entrada.
- `css/styles.css` — estilos.
- `js/app.js` — interfaz y datos; `js/logica.js` — funciones puras.
- `tests/` — pruebas con `node --test`.
- `docs/constitution.md` — principios innegociables del proyecto.
- `specs/` — especificaciones, planes y tareas (SDD).
- `AGENTS.md` / `MEMORY.md` — reglas y memoria del proyecto para el asistente.

## Metodología y herramientas (OpenCode)

- **SDD (Spec-Driven Development)**: Constitución → Spec → Clarificación →
  Plan → Tareas → Implementación → Validación. Nada se implementa sin estar
  en la spec; cada fase necesita aprobación.
- **Specs en `specs/NNN-nombre/`**: `spec.md` (qué y por qué, requisitos EARS),
  `plan.md` (cómo, funciones puras y tests) y `tasks.md` (tareas pequeñas con
  "Hecho cuando" verificable).
- **Agents** (`.opencode/agents/`): coordinator dirige el flujo entre
  planner (spec/plan/tareas), implementer (una tarea cada vez, tests primero)
  y reviewer (QA y validación RF por RF).
- **Skills** (`.agents/skills/`): `sdd` (el flujo), `local-dates` (fechas
  siempre en hora local, nunca UTC), `git-commit` (commits convencionales) y
  guías de diseño.
- **Memory**: `MEMORY.md` mantiene el estado, las decisiones y los errores a
  evitar entre sesiones (máx. ~50 líneas).
- **MCPs**: Chrome DevTools (probar la web de verdad: funcionalidad, consola
  y móvil a 375 px), además de GitHub y Context7 como apoyo.
- **Commits pequeños y frecuentes**: cada feature o cambio termina en commit,
  con mensajes convencionales (`feat:`, `fix:`, `docs:`, `chore:`…).
