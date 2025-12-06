# GDG Genkit - Asistente de Herramientas de Google

Un asistente de IA inteligente construido con Next.js y Google Genkit que ayuda a los usuarios a descubrir y aprender sobre herramientas y servicios de Google. El asistente "Connie" utiliza el modelo Gemini 2.5 Flash para proporcionar recomendaciones personalizadas de herramientas de Google basadas en las necesidades del usuario.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [Componentes Principales](#componentes-principales)
- [API y Funciones](#api-y-funciones)
- [Scripts Disponibles](#scripts-disponibles)
- [Variables de Entorno](#variables-de-entorno)
- [Documentación Adicional](#documentación-adicional)

## ✨ Características

- **Chat Interactivo con IA**: Interfaz de chat moderna y responsiva con soporte para múltiples tipos de contenido
- **Búsqueda Inteligente de Herramientas**: Sistema de búsqueda que permite encontrar herramientas de Google por categoría, nombre o caso de uso
- **Soporte Multimodal**:
  - Chat de texto estándar
  - Análisis de imágenes con visión por computadora
  - Procesamiento de documentos PDF
  - Resumen de videos de YouTube
- **Interfaz Moderna**: Diseño glassmorphism con animaciones suaves usando Framer Motion
- **Modo Oscuro**: Soporte completo para tema claro y oscuro
- **Responsive Design**: Optimizado para dispositivos móviles, tablets y escritorio
- **Markdown Rendering**: Renderizado de respuestas en formato Markdown con soporte para GitHub Flavored Markdown
- **Acciones de Mensajes**: Sistema de acciones (like, dislike, copiar, reintentar) para cada mensaje

## 🛠 Tecnologías Utilizadas

### Framework y Core
- **Next.js 16.0.7**: Framework React con App Router
- **React 19.2.0**: Biblioteca de UI
- **TypeScript 5**: Tipado estático

### IA y Machine Learning
- **Google Genkit 1.21.0**: Framework para construir aplicaciones de IA
- **@genkit-ai/google-genai 1.22.0**: Plugin de Google AI para Genkit
- **Gemini 2.5 Flash**: Modelo de lenguaje de Google

### UI y Estilos
- **Tailwind CSS 4**: Framework de utilidades CSS
- **Framer Motion 12.23.25**: Biblioteca de animaciones
- **Radix UI**: Componentes de UI accesibles
  - `@radix-ui/react-avatar`
  - `@radix-ui/react-label`
  - `@radix-ui/react-scroll-area`
  - `@radix-ui/react-select`
  - `@radix-ui/react-slot`
- **Lucide React**: Iconos
- **shadcn/ui**: Componentes de UI (estilo New York)

### Procesamiento de Contenido
- **react-markdown 10.1.0**: Renderizado de Markdown
- **remark-gfm 4.0.1**: Soporte para GitHub Flavored Markdown
- **rehype-raw 7.0.0**: Procesamiento HTML crudo
- **rehype-sanitize 6.0.0**: Sanitización de HTML para seguridad

### Utilidades
- **Zod 3.25.76**: Validación de esquemas
- **clsx 2.1.1**: Utilidad para construir nombres de clases
- **tailwind-merge 3.4.0**: Merge de clases de Tailwind
- **class-variance-authority 0.7.1**: Gestión de variantes de componentes

## 📁 Estructura del Proyecto

```
gdg-genkit/
├── app/                          # Directorio de la aplicación Next.js (App Router)
│   ├── components/
│   │   └── ui/
│   │       └── Toast.tsx        # Componente de notificaciones toast
│   ├── favicon.ico              # Favicon de la aplicación
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout raíz de la aplicación
│   └── page.tsx                 # Página principal
│
├── components/                   # Componentes reutilizables
│   ├── ai-elements/            # Componentes específicos de IA
│   │   ├── actions.tsx         # Componente de acciones (like, copy, etc.)
│   │   └── loader.tsx          # Loader animado para respuestas
│   │
│   ├── ChatContainerGemma/     # Contenedor principal del chat
│   │   ├── actions/            # Server actions
│   │   │   ├── chat.ts        # Funciones de generación de respuestas
│   │   │   └── types.ts       # Esquemas Zod para validación
│   │   ├── tools/              # Herramientas del asistente
│   │   │   ├── actions/
│   │   │   │   └── chat.ts    # Herramientas de búsqueda (searchTools, getCategories)
│   │   │   └── student/       # Herramientas de estudiante (no utilizadas actualmente)
│   │   ├── ai-chat-container.tsx  # Componente principal del chat
│   │   ├── IA.ts              # Configuración de Genkit y modelo Gemini
│   │   └── use-ai-chat.tsx    # Hook personalizado para gestión del chat
│   │
│   └── ui/                     # Componentes de UI base (shadcn/ui)
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       └── textarea.tsx
│
├── lib/                         # Utilidades y datos
│   ├── tools-data.ts           # Base de datos de herramientas de Google
│   └── utils.ts                # Funciones utilitarias (cn para clases)
│
├── public/                      # Archivos estáticos
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── components.json             # Configuración de shadcn/ui
├── eslint.config.mjs           # Configuración de ESLint
├── next.config.ts              # Configuración de Next.js
├── package.json                # Dependencias y scripts
├── postcss.config.mjs          # Configuración de PostCSS
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Este archivo
```

## 🚀 Instalación

1. **Clonar el repositorio** (si aplica):
```bash
git clone <url-del-repositorio>
cd gdg-genkit
```

2. **Instalar dependencias**:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**:
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
GENKIT_API_KEY=tu_api_key_de_google_ai
```

## ⚙️ Configuración

### Variables de Entorno

El proyecto requiere las siguientes variables de entorno:

- `GENKIT_API_KEY`: Clave API de Google AI para acceder a Gemini. Puedes obtenerla en [Google AI Studio](https://makersuite.google.com/app/apikey)

### Configuración de TypeScript

El proyecto está configurado con TypeScript usando:
- Target: ES2017
- Module: ESNext
- JSX: react-jsx
- Path aliases: `@/*` apunta a la raíz del proyecto

### Configuración de Tailwind CSS

El proyecto usa Tailwind CSS 4 con:
- Estilo: New York (shadcn/ui)
- Base color: neutral
- CSS Variables habilitadas
- Iconos: Lucide React

## 📖 Uso

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Construir para producción

```bash
npm run build
npm start
```

### Ejecutar linter

```bash
npm run lint
```

## 🏗 Arquitectura

### Flujo de Datos

1. **Usuario envía mensaje** → `AIChatContainer` captura el input
2. **Hook useAIChat** → Procesa el mensaje y determina el tipo (texto, imagen, PDF, YouTube)
3. **Server Actions** → `generateTextResponse`, `generateImageResponse`, `generatePDFResponse`, o `summarizeYouTubeVideo`
4. **Genkit AI** → Procesa la solicitud usando Gemini 2.5 Flash
5. **Herramientas** → Si es necesario, se ejecutan herramientas como `searchTools` o `getCategories`
6. **Respuesta** → Se renderiza en el chat con soporte Markdown

### Sistema de Herramientas

El asistente tiene acceso a herramientas que le permiten:
- **searchTools**: Buscar herramientas de Google por categoría, nombre o caso de uso
- **getCategories**: Obtener todas las categorías disponibles de herramientas

### Base de Datos de Herramientas

Las herramientas están almacenadas en `lib/tools-data.ts` y organizadas por categorías:
- Google Cloud Platform
- Google Workspace
- Google AI/ML
- Firebase
- Google Analytics
- Google Developer Tools

Cada herramienta incluye:
- Nombre
- Descripción
- URL oficial
- Casos de uso
- Plan de precios
- Ranking

## 🧩 Componentes Principales

### AIChatContainer

Componente principal del chat ubicado en `components/ChatContainerGemma/ai-chat-container.tsx`.

**Características**:
- Interfaz de chat con mensajes de usuario y asistente
- Soporte para imágenes, PDFs y videos de YouTube
- Animaciones con Framer Motion
- Modo oscuro/claro
- Scroll automático
- Botón de scroll hacia abajo cuando hay contenido fuera de vista
- Acciones por mensaje (like, dislike, copiar, reintentar)
- Loader animado durante la generación
- Manejo de errores con notificaciones

**Props**: Ninguna (usa el hook `useAIChat`)

### useAIChat Hook

Hook personalizado en `components/ChatContainerGemma/use-ai-chat.tsx` que gestiona el estado del chat.

**Estado gestionado**:
- `messages`: Array de mensajes del chat
- `input`: Texto del input del usuario
- `isLoading`: Estado de carga
- `error`: Errores del sistema
- `pdfContent`: Contenido del PDF cargado
- `selectedImage`: Imagen seleccionada en base64

**Funciones principales**:
- `sendMessage`: Envía un mensaje al asistente
- `handleSubmit`: Maneja el submit del formulario
- `clearChat`: Limpia el chat
- `abortGeneration`: Cancela la generación en curso
- `reload`: Reintenta el último mensaje
- `summarizeYouTube`: Resume un video de YouTube

### Server Actions

Las server actions están en `components/ChatContainerGemma/actions/chat.ts`:

#### generateTextResponse
Genera una respuesta de texto usando el modelo Gemini. Incluye un prompt del sistema que instruye al asistente sobre cómo buscar y recomendar herramientas de Google.

#### generateImageResponse
Procesa imágenes y genera respuestas basadas en el contenido visual. Utiliza la capacidad multimodal de Gemini.

#### generatePDFResponse
Analiza contenido de PDFs y proporciona recomendaciones de herramientas de Google basadas en el contenido.

#### summarizeYouTubeVideo
Resume videos de YouTube proporcionando información clave del contenido.

### Herramientas (Tools)

Las herramientas están definidas en `components/ChatContainerGemma/tools/actions/chat.ts`:

#### searchTools
Busca herramientas de Google en la base de datos local. Parámetros:
- `query` (opcional): Búsqueda por nombre, descripción o caso de uso
- `category` (opcional): Filtrar por categoría específica
- `limit` (opcional, default: 5): Número máximo de resultados

#### getCategories
Retorna todas las categorías disponibles de herramientas de Google.

#### getPersonality
Herramienta legacy para análisis de personalidad de personajes (no utilizada actualmente).

### Componentes de UI

Todos los componentes de UI están basados en shadcn/ui y están en `components/ui/`:
- `Button`: Botón con variantes
- `Card`: Tarjeta con header, content y footer
- `Input`: Campo de entrada de texto
- `Textarea`: Área de texto multilínea
- `Select`: Selector dropdown
- `Avatar`: Avatar de usuario
- `Label`: Etiqueta para formularios
- `ScrollArea`: Área con scroll personalizado

### Componentes de IA

#### Actions
Componente contenedor para acciones de mensajes (`components/ai-elements/actions.tsx`).

#### Action
Botón de acción individual con tooltip (`components/ai-elements/actions.tsx`).

#### Loader
Loader animado con tres puntos que rebotan (`components/ai-elements/loader.tsx`).

### Toast Provider

Sistema de notificaciones toast en `app/components/ui/Toast.tsx`:
- Tipos: success, error, warning, info
- Duración configurable
- Posición fija en la esquina inferior derecha
- Auto-dismiss después de la duración especificada

## 🔌 API y Funciones

### Configuración de Genkit

El archivo `components/ChatContainerGemma/IA.ts` configura Genkit:

```typescript
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GENKIT_API_KEY,
    }),
  ],
  model: googleAI.model('gemini-2.5-flash'),
});
```

### Esquemas de Validación

Los esquemas Zod están en `components/ChatContainerGemma/actions/types.ts`:
- `textInputSchema`: Para entrada de texto
- `imageInputSchema`: Para entrada con imagen
- `pdfInputSchema`: Para entrada con PDF
- `youtubeInputSchema`: Para entrada de YouTube

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en modo watch
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta ESLint para verificar el código

## 🔒 Seguridad

- **Sanitización de HTML**: Se usa `rehype-sanitize` para sanitizar el contenido HTML renderizado en Markdown
- **Validación de Entrada**: Todos los inputs se validan con Zod antes de procesarse
- **Variables de Entorno**: Las claves API se almacenan en variables de entorno y nunca se exponen al cliente

## 🎨 Personalización

### Temas y Colores

El proyecto usa CSS Variables para temas. Los colores principales son:
- Púrpura/Indigo para el asistente
- Azul para el usuario
- Gradientes para efectos visuales

### Animaciones

Las animaciones están configuradas con Framer Motion:
- Entrada/salida de mensajes
- Modales
- Loaders
- Hover effects

## 🐛 Notas Importantes

- **Sistema de Peticiones Deshabilitado**: El sistema de créditos/peticiones está comentado en el código. Las funciones relacionadas están marcadas con `⚠️ SISTEMA DE PETICIONES DESHABILITADO`
- **Herramientas de Estudiante**: Existen componentes de herramientas de estudiante en `components/ChatContainerGemma/tools/student/` que no están siendo utilizados actualmente

## 📝 Licencia

Este proyecto es privado.

## 🤝 Contribución

Este es un proyecto privado. Para contribuciones, contacta al equipo de desarrollo.

## 📚 Documentación Adicional

Para información más detallada, consulta la documentación completa:

- **[Arquitectura del Proyecto](docs/ARCHITECTURE.md)**: Diagramas de arquitectura, flujos de datos, y decisiones de diseño
- **[Guía de Desarrollo](docs/DEVELOPMENT.md)**: Configuración del entorno, convenciones de código, y mejores prácticas
- **[Documentación de Componentes](docs/COMPONENTS.md)**: Referencia completa de todos los componentes, props, y ejemplos de uso

---

**Desarrollado con ❤️ usando Next.js, Google Genkit y Gemini**
