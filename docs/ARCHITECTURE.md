# Arquitectura del Proyecto

## Visión General

GDG Genkit es una aplicación Next.js que utiliza Google Genkit para crear un asistente de IA especializado en herramientas de Google. La arquitectura sigue el patrón de App Router de Next.js con Server Actions para la lógica del servidor.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente (Browser)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         AIChatContainer (React Component)            │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │         useAIChat Hook (State Management)    │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Request
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Server (App Router)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Server Actions (chat.ts)                │   │
│  │  • generateTextResponse                              │   │
│  │  • generateImageResponse                             │   │
│  │  • generatePDFResponse                               │   │
│  │  • summarizeYouTubeVideo                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Google Genkit (IA.ts)                   │   │
│  │  • Modelo: Gemini 2.5 Flash                          │   │
│  │  • Plugin: googleAI                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Tools (chat.ts)                         │   │
│  │  • searchTools                                       │   │
│  │  • getCategories                                     │   │
│  │  • getPersonality (legacy)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Base de Datos (tools-data.ts)                │   │
│  │  • Categorías de herramientas                        │   │
│  │  • Información de cada herramienta                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Datos Detallado

### 1. Flujo de Mensaje de Texto

```
Usuario escribe mensaje
    │
    ▼
AIChatContainer.handleSubmit()
    │
    ▼
useAIChat.sendMessage()
    │
    ├─► Validación de entrada
    ├─► Crear mensaje de usuario
    ├─► Agregar a estado local
    │
    ▼
generateTextResponse() [Server Action]
    │
    ├─► Validar con Zod (textInputSchema)
    ├─► Preparar contexto de herramientas
    │
    ▼
ai.generate() [Genkit]
    │
    ├─► System prompt con instrucciones
    ├─► User prompt con historial
    ├─► Tools disponibles (searchTools, getCategories)
    │
    ├─► [Si necesita buscar herramientas]
    │   │
    │   ▼
    │   searchTools()
    │       │
    │       ├─► Filtrar por categoría (opcional)
    │       ├─► Buscar por query (opcional)
    │       ├─► Ordenar por ranking
    │       └─► Retornar resultados limitados
    │
    ▼
Respuesta generada
    │
    ▼
useAIChat recibe respuesta
    │
    ├─► Crear mensaje de asistente
    ├─► Agregar a estado local
    │
    ▼
AIChatContainer renderiza mensaje
    │
    ├─► ReactMarkdown procesa contenido
    ├─► remarkGfm para GitHub Flavored Markdown
    ├─► rehypeRaw y rehypeSanitize para seguridad
    │
    ▼
Mensaje visible en UI
```

### 2. Flujo de Mensaje con Imagen

```
Usuario selecciona imagen
    │
    ▼
handleImageUpload()
    │
    ├─► FileReader lee archivo
    ├─► Convierte a base64
    └─► setSelectedImage(base64)
    │
    ▼
Usuario envía mensaje con imagen
    │
    ▼
useAIChat.sendMessage(content, imageBase64)
    │
    ▼
generateImageResponse() [Server Action]
    │
    ├─► Validar con Zod (imageInputSchema)
    │
    ▼
ai.generate() [Genkit con multimodal]
    │
    ├─► Text prompt con contexto
    ├─► Media: { url: data:image/jpeg;base64,... }
    │
    ▼
Respuesta basada en análisis de imagen
    │
    ▼
Renderizado en chat
```

### 3. Flujo de Procesamiento de PDF

```
Usuario carga PDF
    │
    ▼
handlePDFUpload()
    │
    ├─► file.text() lee contenido
    └─► setPDFContent(text)
    │
    ▼
Usuario envía mensaje
    │
    ▼
useAIChat.sendMessage() detecta pdfContent
    │
    ▼
generatePDFResponse() [Server Action]
    │
    ├─► Validar con Zod (pdfInputSchema)
    ├─► Incluir contenido del PDF en prompt
    │
    ▼
ai.generate() [Genkit]
    │
    ├─► System prompt: asistente experto en Google
    ├─► User prompt: contenido PDF + pregunta
    │
    ▼
Respuesta con recomendaciones basadas en PDF
```

### 4. Flujo de Resumen de YouTube

```
Usuario abre modal de YouTube
    │
    ▼
handleYouTubeSubmit()
    │
    ├─► Validar URL de YouTube
    └─► summarizeYouTube()
    │
    ▼
summarizeYouTubeVideo() [Server Action]
    │
    ├─► Validar con Zod (youtubeInputSchema)
    │
    ▼
ai.generate() [Genkit con multimodal]
    │
    ├─► Prompt: instrucciones de resumen
    ├─► Media: { url: videoUrl, contentType: "video/mp4" }
    │
    ▼
Respuesta con resumen del video
```

## Gestión de Estado

### Estado del Chat (useAIChat)

```typescript
interface ChatState {
  messages: Message[]           // Historial de mensajes
  input: string                  // Input actual del usuario
  isLoading: boolean            // Estado de carga
  error: Error | null           // Errores
  pdfContent: string | null     // Contenido del PDF cargado
  selectedImage: string | null  // Imagen seleccionada (base64)
  credits: CreditData | null    // Sistema de créditos (deshabilitado)
}
```

### Estructura de Mensaje

```typescript
interface Message {
  id: string                    // ID único del mensaje
  role: 'user' | 'assistant'   // Rol del emisor
  content: string              // Contenido del mensaje (Markdown)
  mediaUrl?: string            // URL de media (imágenes)
  createdAt?: Date             // Fecha de creación
  annotations?: unknown[]      // Anotaciones adicionales
}
```

## Sistema de Herramientas

### Definición de Herramientas

Las herramientas se definen usando `ai.defineTool()` de Genkit:

```typescript
export const searchTools = ai.defineTool(
  {
    name: "searchTools",
    description: "...",
    inputSchema: z.object({...}),
    outputSchema: z.object({...}),
  },
  async (params) => {
    // Implementación
  }
);
```

### Proceso de Búsqueda

1. **Usuario pregunta** sobre herramientas de Google
2. **Genkit decide** si necesita usar `searchTools`
3. **searchTools ejecuta**:
   - Filtra por categoría (si se especifica)
   - Busca por query (nombre, descripción, casos de uso)
   - Ordena por ranking
   - Limita resultados
4. **Genkit recibe** resultados y genera respuesta final

## Seguridad

### Validación de Entrada

- Todos los inputs se validan con **Zod** antes de procesarse
- Los esquemas están en `actions/types.ts`
- Validación tanto en cliente como servidor

### Sanitización de Contenido

- **rehype-sanitize**: Sanitiza HTML en respuestas Markdown
- Previene XSS attacks
- Permite solo elementos HTML seguros

### Variables de Entorno

- `GENKIT_API_KEY` nunca se expone al cliente
- Solo disponible en Server Actions
- Validación de existencia antes de uso

## Optimizaciones

### Rendimiento

- **Server Components**: Componentes por defecto son Server Components
- **Client Components**: Solo cuando es necesario (`'use client'`)
- **Lazy Loading**: Componentes cargados bajo demanda
- **Image Optimization**: Next.js Image component para imágenes

### UX

- **Scroll Automático**: Scroll suave cuando hay nuevos mensajes
- **Loading States**: Indicadores visuales durante carga
- **Error Handling**: Manejo de errores con mensajes claros
- **Animaciones**: Transiciones suaves con Framer Motion

## Extensiones Futuras

### Sistema de Créditos (Deshabilitado)

El código incluye un sistema de créditos comentado que podría reactivarse:
- Verificación de créditos antes de enviar mensajes
- Límite diario de peticiones
- API endpoint `/api/credits`

### Herramientas de Estudiante

Existen componentes para herramientas de estudiante no utilizados:
- `english-teacher.tsx`
- `math-teacher.tsx`
- `student-tools.tsx`

Estos podrían integrarse en el futuro.

## Consideraciones de Escalabilidad

### Base de Datos de Herramientas

Actualmente las herramientas están en un archivo TypeScript (`tools-data.ts`). Para escalar:
- Migrar a base de datos (Firestore, PostgreSQL)
- Implementar búsqueda full-text
- Cachear resultados frecuentes

### Rate Limiting

Actualmente no hay rate limiting. Considerar:
- Rate limiting por IP
- Rate limiting por usuario (con autenticación)
- Throttling de requests

### Caching

Considerar implementar:
- Cache de respuestas frecuentes
- Cache de búsquedas de herramientas
- Cache de resúmenes de YouTube

