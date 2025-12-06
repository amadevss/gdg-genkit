# Guía de Desarrollo

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- **Node.js**: Versión 18 o superior
- **npm/yarn/pnpm**: Gestor de paquetes
- **Git**: Control de versiones
- **Editor de código**: VS Code recomendado

### Extensiones Recomendadas para VS Code

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Error Lens

## Configuración Inicial

### 1. Clonar y Configurar

```bash
# Clonar repositorio
git clone <repository-url>
cd gdg-genkit

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env.local
```

### 2. Configurar Variables de Entorno

Edita `.env.local`:

```env
GENKIT_API_KEY=tu_api_key_aqui
```

### 3. Verificar Instalación

```bash
npm run dev
```

Deberías ver el servidor corriendo en `http://localhost:3000`.

## Estructura de Código

### Convenciones de Nombres

- **Componentes**: PascalCase (`AIChatContainer.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAIChat.tsx`)
- **Utilidades**: camelCase (`utils.ts`)
- **Tipos/Interfaces**: PascalCase (`Message`, `Tool`)
- **Constantes**: UPPER_SNAKE_CASE (`GENKIT_API_KEY`)

### Organización de Archivos

```
components/
  ComponentName/
    index.tsx          # Componente principal
    types.ts          # Tipos específicos
    utils.ts          # Utilidades específicas
    ComponentName.test.tsx  # Tests (si aplica)
```

## Desarrollo de Componentes

### Crear un Nuevo Componente

1. **Crear archivo del componente**:
```typescript
// components/MyComponent/MyComponent.tsx
'use client'; // Si necesita interactividad

import { useState } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState<string>('');
  
  return (
    <div>
      <h1>{title}</h1>
      {/* Contenido */}
    </div>
  );
}
```

2. **Exportar desde index** (opcional):
```typescript
// components/MyComponent/index.tsx
export { MyComponent } from './MyComponent';
```

3. **Usar en la aplicación**:
```typescript
import { MyComponent } from '@/components/MyComponent';

export default function Page() {
  return <MyComponent title="Mi Componente" />;
}
```

### Crear un Hook Personalizado

```typescript
// hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // Lógica del hook
  }, [value]);
  
  return { value, setValue };
}
```

### Crear una Server Action

```typescript
// app/actions/my-action.ts
"use server";

import { z } from "zod";

const mySchema = z.object({
  input: z.string(),
});

export async function myAction(input: z.infer<typeof mySchema>) {
  const { input: validatedInput } = mySchema.parse(input);
  
  // Lógica del servidor
  return { result: "success" };
}
```

## Desarrollo de Herramientas (Tools)

### Agregar una Nueva Herramienta

1. **Definir la herramienta en `tools/actions/chat.ts`**:

```typescript
export const myNewTool = ai.defineTool(
  {
    name: "myNewTool",
    description: "Descripción de lo que hace la herramienta",
    inputSchema: z.object({
      param1: z.string().describe("Descripción del parámetro"),
      param2: z.number().optional(),
    }),
    outputSchema: z.object({
      result: z.string(),
      data: z.array(z.string()),
    }),
  },
  async ({ param1, param2 }) => {
    // Implementación de la herramienta
    return {
      result: "success",
      data: ["item1", "item2"],
    };
  }
);
```

2. **Agregar al array de herramientas en el prompt**:

```typescript
// En generateTextResponse o donde corresponda
tools: [searchTools, getCategories, myNewTool]
```

3. **Actualizar el system prompt** si es necesario para que el modelo sepa cuándo usar la herramienta.

## Desarrollo de UI

### Usar Componentes de shadcn/ui

Los componentes están en `components/ui/`. Para agregar nuevos:

```bash
npx shadcn@latest add [component-name]
```

### Estilos con Tailwind CSS

```typescript
// Clases condicionales
className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "primary-classes"
)}
```

### Animaciones con Framer Motion

```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Contenido animado
</motion.div>
```

## Testing

### Ejecutar Tests (cuando se implementen)

```bash
npm test
```

### Estructura de Tests

```typescript
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Debugging

### Debug en VS Code

Crea `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Console Logs

```typescript
// En desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### React DevTools

Instala la extensión de React DevTools para inspeccionar componentes y estado.

## Linting y Formateo

### ESLint

```bash
# Ejecutar linter
npm run lint

# Auto-fix
npm run lint -- --fix
```

### Prettier (si se configura)

```bash
# Formatear código
npx prettier --write .
```

## Git Workflow

### Commits

Usa mensajes descriptivos:

```bash
git commit -m "feat: agregar nueva herramienta de búsqueda"
git commit -m "fix: corregir error en procesamiento de imágenes"
git commit -m "docs: actualizar documentación de API"
```

### Branches

- `main`: Código de producción
- `develop`: Desarrollo activo
- `feature/nombre`: Nueva funcionalidad
- `fix/nombre`: Corrección de bugs
- `docs/nombre`: Documentación

## Agregar Nuevas Herramientas de Google

### 1. Editar `lib/tools-data.ts`

```typescript
{
  nombre: "Nueva Herramienta",
  descripcion: "Descripción de la herramienta",
  url: "https://ejemplo.com",
  casos_de_uso: ["Caso 1", "Caso 2"],
  plan: "Gratis / Pay-as-you-go / Precio",
  ranking: 1 // Menor número = mayor prioridad
}
```

### 2. Agregar a la categoría correspondiente

Si la categoría no existe, crear una nueva:

```typescript
{
  nombre: "Nueva Categoría",
  herramientas: [
    // Herramientas aquí
  ]
}
```

### 3. Actualizar categorías en el prompt del sistema

En `actions/chat.ts`, actualizar la constante `categories`:

```typescript
const categories = "Google Cloud Platform, Nueva Categoría, ...";
```

## Optimización de Performance

### Code Splitting

```typescript
// Lazy loading de componentes
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Memoización

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoizar componente
const MemoizedComponent = memo(MyComponent);

// Memoizar valores calculados
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoizar callbacks
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

## Despliegue

### Build de Producción

```bash
npm run build
```

### Verificar Build

```bash
npm start
```

### Variables de Entorno en Producción

Asegúrate de configurar:
- `GENKIT_API_KEY` en el entorno de producción
- Cualquier otra variable necesaria

## Troubleshooting

### Error: "GENKIT_API_KEY is not defined"

- Verifica que `.env.local` existe
- Verifica que la variable está definida
- Reinicia el servidor de desarrollo

### Error: "Module not found"

- Ejecuta `npm install`
- Verifica que el path alias `@/*` está correcto en `tsconfig.json`

### Error: "Hydration mismatch"

- Verifica que no hay diferencias entre servidor y cliente
- Usa `useEffect` para código que solo debe ejecutarse en cliente

### Error: "Type error"

- Ejecuta `npm run build` para ver todos los errores de TypeScript
- Verifica tipos en `tsconfig.json`

## Recursos Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Genkit Documentation](https://genkit.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Zod Documentation](https://zod.dev/)

