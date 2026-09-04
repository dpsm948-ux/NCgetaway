# Fin de semana en Durham — App familiar

App de una sola página (`index.html`) para elegir y votar el plan del sábado y domingo en Durham/Asheboro, NC. No requiere instalación ni build: React, ReactDOM y Babel se cargan desde CDN y el JSX se transforma en el navegador.

## Cómo usarla

**Opción rápida:** abre `index.html` directamente haciendo doble clic (funciona sin servidor).

**GitHub Pages (recomendado para compartir con la familia):**
1. Crea un repositorio nuevo en GitHub.
2. Sube este `index.html` (y este `README.md`) a la raíz del repo.
3. Ve a *Settings → Pages*, elige la rama `main` y carpeta `/root`, y guarda.
4. En un par de minutos tendrás una URL tipo `https://tu-usuario.github.io/tu-repo/` para compartir.

Estructura mínima del repo:
```
tu-repo/
├── index.html
└── README.md
```

## Qué incluye

- Selector de perfil (Cindy, Aracely, Diego, Aria).
- Sábado completo (mañana, almuerzo, tarde, noche en casa de Cindy) y domingo (zoológico confirmado por la mañana, almuerzo, parada opcional antes de volver a casa).
- Varias opciones por horario, cada una con foto, duración, costo, nivel de intensidad y link a más información (Google Maps o la página oficial del NC Zoo).
- Votación para los 3 adultos (Aria ve el itinerario simplificado, sin votar).
- Clima del fin de semana (Durham/Asheboro) integrado como contexto.
- Asistente "Lucía", una luciérnaga con voz que se presenta y responde preguntas de Aria (texto y, si el navegador lo soporta, micrófono).

## Limitaciones a tener en cuenta

- **Los votos son por navegador/dispositivo.** Esta versión standalone usa `localStorage`, que no se sincroniza entre los teléfonos de la familia. Si quieren que el voto de Cindy se vea en el teléfono de Diego en tiempo real, van a necesitar un backend compartido (por ejemplo, una base de datos gratuita tipo Firebase, Supabase, o un endpoint propio) — puedo ayudarte a conectarlo si lo necesitas.
- **El asistente Lucía necesita conexión a la API de Claude.** El código llama directamente a `https://api.anthropic.com/v1/messages` sin una llave — esto funciona dentro de la vista previa de Artifacts de Claude.ai (que gestiona la llamada por ustedes), pero **no funcionará tal cual en GitHub Pages** ya que no hay una API key configurada ni permiso CORS para dominios externos. Si falla, Lucía simplemente se disculpa y la app sigue funcionando con normalidad (voz y micrófono incluidos). Para que el asistente responda de verdad en tu propio dominio, necesitas un pequeño backend/proxy que guarde tu API key de Anthropic del lado del servidor y lo apuntas cambiando la constante `ASSISTANT_API_URL` en el archivo.
- **Voz e imágenes dependen del navegador/CDN.** La síntesis de voz (`speechSynthesis`) y el reconocimiento de voz (`webkitSpeechRecognition`) funcionan mejor en Chrome/Edge. Las fotos vienen de `picsum.photos` (imágenes de relleno reales, no necesariamente del lugar exacto) — puedes reemplazarlas por fotos propias cambiando la función `img()`.

## Personalizar

Todo el contenido (actividades, restaurantes, precios, links, clima) está en el arreglo `SLOTS` dentro del `<script type="text/babel">`. Los colores y tipografías están como variables CSS al final del archivo (`:root { --pine, --clay, ... }`).
