# Spec 002 — Objetivo semanal
Estado: borrador

## Contexto y objetivo
El Diario de Estudio ya muestra los minutos estudiados en la semana actual, pero no permite fijar una meta. Sin objetivo, el número semanal informa poco y motiva menos.

El objetivo es permitir fijar cuántos minutos se quieren estudiar cada semana y ver el progreso (`X de Y min`), incluyendo si falta o si ya se cumplió. La meta debe mantenerse entre semanas hasta que se cambie.

## Usuarios
- **Estudiante (usuario único)**: quiere ponerse una meta semanal realista y ver si va por buen camino.

## Historias de usuario
- **HU-1.** Como estudiante, quiero fijar mi objetivo semanal en minutos para tener una meta clara.
- **HU-2.** Como estudiante, quiero ver cuántos minutos llevo respecto a mi objetivo para saber si debo estudiar más.
- **HU-3.** Como estudiante, quiero que mi objetivo se mantenga entre semanas para no tener que fijarlo cada lunes.

## Definiciones
- **Semana natural**: de lunes a domingo en hora local.
- **Minutos semanales**: suma de minutos de sesiones con fecha entre el lunes y hoy, ambos incluidos; las fechas futuras no cuentan.
- **Objetivo**: número entero entre 1 y 10080 minutos.
- **Cumplido**: minutos semanales mayores o iguales que el objetivo.

## Requisitos funcionales
- **RF-1 — Fijar o cambiar el objetivo**: CUANDO el usuario guarde un número entero entre 1 y 10080, EL SISTEMA lo adoptará como objetivo vigente y lo mostrará.
- **RF-2 — Valor no válido**: SI el valor no es un entero entre 1 y 10080, ENTONCES EL SISTEMA mostrará un error, no cambiará el objetivo anterior y no borrará sesiones.
- **RF-3 — Conservación del objetivo**: MIENTRAS el usuario no fije otro valor, EL SISTEMA conservará el objetivo al recargar la página y al cambiar de semana.
- **RF-4 — Progreso semanal**: MIENTRAS exista un objetivo, EL SISTEMA mostrará los minutos semanales frente a la meta con el formato `X de Y min`, actualizado al cargar y al guardar sesiones.
- **RF-5 — Estado motivador**: CUANDO los minutos semanales alcancen o superen el objetivo, EL SISTEMA mostrará que el objetivo está cumplido; MIENTRAS falten minutos, EL SISTEMA mostrará cuántos faltan.
- **RF-6 — Reinicio semanal**: CUANDO empiece un lunes nuevo, EL SISTEMA calculará el progreso desde cero manteniendo el mismo objetivo.
- **RF-7 — Coherencia de fechas**: EL SISTEMA usará semana natural de lunes a domingo en hora local y excluirá las sesiones futuras del progreso.

## Requisitos no funcionales
- **RNF-1 — Simplicidad**: fijar el objetivo y entender el progreso requiere una sola acción y lectura inmediata.
- **RNF-2 — Móvil**: el objetivo y el progreso se ven bien en 375 px sin desplazamiento lateral.
- **RNF-3 — Español**: todos los textos visibles están en español.
- **RNF-4 — Datos seguros**: cambiar o conservar el objetivo nunca borra ni altera sesiones guardadas.
- **RNF-5 — Lógica verificable**: el cálculo del progreso y del estado se puede probar con el día “hoy” como parámetro, sin depender de la fecha real.

## Casos límite
- Sin objetivo fijado: se muestra el editor y los minutos semanales actuales, sin progreso `X de Y min` ni estado de cumplido.
- Objetivo cambiado a mitad de semana: el nuevo valor se aplica inmediatamente a la semana actual.
- Meta exacta: minutos iguales al objetivo cuentan como cumplido.
- Meta superada: se muestran los minutos reales (por ejemplo, `320 de 300 min`) y el estado de cumplido.
- Entrada vacía, cero, negativa, decimal o mayor de 10080: error y se conserva el objetivo anterior.
- Semana sin sesiones: el progreso es `0 de Y min`.
- Sesiones futuras: no suman al progreso.
- Lunes nuevo: el progreso vuelve a `0 de Y min` con el mismo objetivo.

## Fuera de alcance
- Historial de objetivos anteriores.
- Objetivos por día, por mes o por tema.
- Recordatorios, avisos o celebraciones animadas.
- Cambios en el formato de las sesiones guardadas.

## Criterios de finalización
- Todos los criterios de aceptación de RF-1 a RF-7 se cumplen.
- Los casos límite se comportan como se describe.
- La lógica nueva está cubierta por pruebas automatizadas en verde.
- La página no muestra errores en la consola.
- La vista móvil de 375 px es legible sin desplazamiento lateral.
- No queda ninguna duda abierta sin resolver.

## Dudas abiertas
Sin dudas abiertas.
