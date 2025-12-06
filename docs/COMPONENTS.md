# Documentación de Componentes

## Componentes Principales

### AIChatContainer

**Ubicación**: `components/ChatContainerGemma/ai-chat-container.tsx`

**Tipo**: Client Component

**Descripción**: Componente principal que renderiza la interfaz completa del chat con IA.

**Props**: Ninguna (usa el hook `useAIChat` internamente)

**Características**:
- Interfaz de chat con mensajes de usuario y asistente
- Soporte para múltiples tipos de contenido (texto, imágenes, PDFs, YouTube)
- Animaciones con Framer Motion
- Modo oscuro/claro
- Scroll automático y manual
- Sistema de acciones por mensaje
- Manejo de errores con UI

**Estado Interno**:
- `showScrollButton`: Controla visibilidad del botón de scroll
- `youtubeUrl`: URL del video de YouTube
- `youtubePrompt`: Prompt opcional para YouTube
- `showYouTubeModal`: Controla visibilidad del modal de YouTube

**Funciones Principales**:
- `handleImageUpload`: Procesa carga de imágenes
- `handlePDFUpload`: Procesa carga de PDFs
- `handleYouTubeSubmit`: Maneja resumen de videos
- `handleClearChat`: Limpia el chat
- `handleCopy`: Copia contenido al portapapeles
- `handleLike/Dislike`: Acciones de feedback (placeholder)
- `scrollToBottom`: Scroll programático
- `handleScroll`: Detecta posición de scroll

**Ejemplo de Uso**:
```typescript
import AIChatContainer from '@/components/ChatContainerGemma/ai-chat-container';

export default function Page() {
  return <AIChatContainer />;
}
```

---

### useAIChat Hook

**Ubicación**: `components/ChatContainerGemma/use-ai-chat.tsx`

**Tipo**: Custom Hook

**Descripción**: Hook personalizado que gestiona todo el estado y lógica del chat.

**Retorna**:
```typescript
{
  messages: Message[];           // Historial de mensajes
  input: string;                  // Input actual
  setInput: (value: string) => void;
  isLoading: boolean;             // Estado de carga
  isGenerating: boolean;          // Alias de isLoading
  error: Error | null;           // Errores
  sendMessage: (content: string, imageBase64?: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  abortGeneration: () => void;    // Cancela generación
  clearChat: () => void;          // Limpia chat
  pdfContent: string | null;      // Contenido PDF
  setPDFContent: (content: string | null) => void;
  selectedImage: string | null;   // Imagen en base64
  setSelectedImage: (image: string | null) => void;
  credits: CreditData | null;     // Sistema de créditos (deshabilitado)
  creditsError: string | null;
  refreshCredits: () => Promise<void>;
  reload: () => void;             // Reintenta último mensaje
  summarizeYouTube: (videoUrl: string, prompt?: string) => Promise<void>;
}
```

**Ejemplo de Uso**:
```typescript
const {
  messages,
  input,
  setInput,
  isLoading,
  sendMessage,
  handleSubmit
} = useAIChat();
```

---

## Componentes de UI Base

### Button

**Ubicación**: `components/ui/button.tsx`

**Tipo**: Client Component (shadcn/ui)

**Variantes**:
- `default`: Botón primario
- `destructive`: Botón de acción destructiva
- `outline`: Botón con borde
- `secondary`: Botón secundario
- `ghost`: Botón sin fondo
- `link`: Botón estilo enlace

**Tamaños**:
- `default`: Tamaño normal
- `sm`: Pequeño
- `lg`: Grande
- `icon`: Solo icono

**Ejemplo**:
```typescript
<Button variant="default" size="lg" onClick={handleClick}>
  Click me
</Button>
```

---

### Card

**Ubicación**: `components/ui/card.tsx`

**Tipo**: Client Component (shadcn/ui)

**Subcomponentes**:
- `Card`: Contenedor principal
- `CardHeader`: Encabezado
- `CardTitle`: Título
- `CardDescription`: Descripción
- `CardContent`: Contenido principal
- `CardFooter`: Pie de página

**Ejemplo**:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
  <CardFooter>
    Acciones
  </CardFooter>
</Card>
```

---

### Input

**Ubicación**: `components/ui/input.tsx`

**Tipo**: Client Component (shadcn/ui)

**Props**: Extiende `React.InputHTMLAttributes<HTMLInputElement>`

**Ejemplo**:
```typescript
<Input
  type="text"
  placeholder="Escribe aquí..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Textarea

**Ubicación**: `components/ui/textarea.tsx`

**Tipo**: Client Component (shadcn/ui)

**Props**: Extiende `React.TextareaHTMLAttributes<HTMLTextAreaElement>`

**Ejemplo**:
```typescript
<Textarea
  placeholder="Escribe un mensaje largo..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Select

**Ubicación**: `components/ui/select.tsx`

**Tipo**: Client Component (shadcn/ui)

**Subcomponentes**:
- `SelectTrigger`: Disparador del select
- `SelectValue`: Valor seleccionado
- `SelectContent`: Contenido del dropdown
- `SelectItem`: Item individual

**Ejemplo**:
```typescript
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opción 1</SelectItem>
    <SelectItem value="option2">Opción 2</SelectItem>
  </SelectContent>
</Select>
```

---

### ScrollArea

**Ubicación**: `components/ui/scroll-area.tsx`

**Tipo**: Client Component (shadcn/ui)

**Descripción**: Área con scroll personalizado usando Radix UI.

**Ejemplo**:
```typescript
<ScrollArea className="h-[400px]">
  <div>Contenido largo...</div>
</ScrollArea>
```

---

### Avatar

**Ubicación**: `components/ui/avatar.tsx`

**Tipo**: Client Component (shadcn/ui)

**Subcomponentes**:
- `Avatar`: Contenedor
- `AvatarImage`: Imagen del avatar
- `AvatarFallback`: Fallback si no hay imagen

**Ejemplo**:
```typescript
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="Usuario" />
  <AvatarFallback>U</AvatarFallback>
</Avatar>
```

---

### Label

**Ubicación**: `components/ui/label.tsx`

**Tipo**: Client Component (shadcn/ui)

**Descripción**: Etiqueta para formularios, accesible y asociable con inputs.

**Ejemplo**:
```typescript
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

---

## Componentes de IA

### Actions

**Ubicación**: `components/ai-elements/actions.tsx`

**Tipo**: Client Component

**Descripción**: Contenedor para acciones de mensajes (like, copy, etc.).

**Props**:
```typescript
{
  children: React.ReactNode;
}
```

**Ejemplo**:
```typescript
<Actions>
  <Action tooltip="Copiar" onClick={handleCopy}>
    📋
  </Action>
  <Action tooltip="Me gusta" onClick={handleLike}>
    👍
  </Action>
</Actions>
```

---

### Action

**Ubicación**: `components/ai-elements/actions.tsx`

**Tipo**: Client Component

**Descripción**: Botón de acción individual con tooltip.

**Props**:
```typescript
{
  tooltip?: string;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Ejemplo**:
```typescript
<Action tooltip="Copiar al portapapeles" onClick={handleCopy}>
  📋
</Action>
```

---

### Loader

**Ubicación**: `components/ai-elements/loader.tsx`

**Tipo**: Client Component

**Descripción**: Loader animado con tres puntos que rebotan.

**Props**: Ninguna

**Ejemplo**:
```typescript
{isLoading && <Loader />}
```

---

## Componentes de Utilidad

### Toast Provider

**Ubicación**: `app/components/ui/Toast.tsx`

**Tipo**: Client Component

**Descripción**: Sistema de notificaciones toast.

**Uso**:
```typescript
// En layout.tsx
<ToastProvider>
  {children}
</ToastProvider>

// En componente
const { addToast } = useToast();

addToast({
  type: 'success',
  title: 'Éxito',
  message: 'Operación completada',
  duration: 5000,
});
```

**Tipos de Toast**:
- `success`: Verde
- `error`: Rojo
- `warning`: Amarillo
- `info`: Azul

---

## Server Actions

### generateTextResponse

**Ubicación**: `components/ChatContainerGemma/actions/chat.ts`

**Tipo**: Server Action

**Descripción**: Genera respuesta de texto usando Gemini.

**Parámetros**:
```typescript
{
  prompt: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    mediaUrl?: string;
  }>;
}
```

**Retorna**:
```typescript
{
  text: string;
}
```

---

### generateImageResponse

**Ubicación**: `components/ChatContainerGemma/actions/chat.ts`

**Tipo**: Server Action

**Descripción**: Genera respuesta basada en análisis de imagen.

**Parámetros**:
```typescript
{
  prompt: string;
  imageBase64: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    mediaUrl?: string;
  }>;
}
```

**Retorna**:
```typescript
{
  text: string;
}
```

---

### generatePDFResponse

**Ubicación**: `components/ChatContainerGemma/actions/chat.ts`

**Tipo**: Server Action

**Descripción**: Genera respuesta basada en contenido de PDF.

**Parámetros**:
```typescript
{
  prompt: string;
  pdfContent: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

**Retorna**:
```typescript
{
  text: string;
}
```

---

### summarizeYouTubeVideo

**Ubicación**: `components/ChatContainerGemma/actions/chat.ts`

**Tipo**: Server Action

**Descripción**: Resume videos de YouTube.

**Parámetros**:
```typescript
{
  videoUrl: string;
  prompt?: string;
}
```

**Retorna**:
```typescript
{
  text: string;
}
```

---

## Tools (Herramientas de Genkit)

### searchTools

**Ubicación**: `components/ChatContainerGemma/tools/actions/chat.ts`

**Tipo**: Genkit Tool

**Descripción**: Busca herramientas de Google en la base de datos.

**Parámetros de Entrada**:
```typescript
{
  query?: string;        // Búsqueda por nombre/descripción
  category?: string;      // Filtrar por categoría
  limit?: number;         // Límite de resultados (default: 5)
}
```

**Retorna**:
```typescript
{
  tools: Array<{
    nombre: string;
    categoria: string;
    descripcion: string;
    url: string;
    casos_de_uso: string[];
    plan: string;
    ranking: number;
  }>;
  total: number;
}
```

---

### getCategories

**Ubicación**: `components/ChatContainerGemma/tools/actions/chat.ts`

**Tipo**: Genkit Tool

**Descripción**: Obtiene todas las categorías disponibles.

**Parámetros de Entrada**: Ninguno

**Retorna**:
```typescript
{
  categories: string[];
}
```

---

## Tipos y Interfaces

### Message

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mediaUrl?: string;
  createdAt?: Date;
  annotations?: unknown[];
}
```

### Tool

```typescript
interface Tool {
  nombre: string;
  descripcion: string;
  url: string;
  casos_de_uso: string[];
  plan: string;
  ranking: number;
}
```

### ToolCategory

```typescript
interface ToolCategory {
  nombre: string;
  herramientas: Tool[];
}
```

### CreditData

```typescript
interface CreditData {
  dailyRequests: number;
  dailyRequestsUsed: number;
  remainingRequests: number;
  totalCoinns: number;
  canMakeRequest: boolean;
}
```

---

## Patrones de Uso Comunes

### Agregar un Nuevo Tipo de Mensaje

1. Crear función en `actions/chat.ts`
2. Agregar esquema Zod en `actions/types.ts`
3. Actualizar `useAIChat` para manejar el nuevo tipo
4. Actualizar UI en `AIChatContainer` si es necesario

### Agregar una Nueva Acción de Mensaje

1. Crear handler en `AIChatContainer`
2. Agregar `Action` en el componente de mensaje
3. Implementar lógica de la acción

### Personalizar Estilos

Los componentes usan Tailwind CSS. Para personalizar:
1. Modificar clases directamente en el componente
2. Usar `cn()` utility para combinar clases
3. Agregar clases personalizadas en `globals.css`

