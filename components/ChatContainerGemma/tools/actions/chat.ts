import { z } from "zod";
import { ai } from "../../IA";
import { toolsData, type Tool} from "@/lib/tools-data";

// Herramienta para buscar herramientas de Google
export const searchTools = ai.defineTool(
  {
    name: "searchTools",
    description: "Busca y recomienda herramientas y servicios de Google basándose en las necesidades del usuario. Puede buscar por categoría, nombre, descripción o casos de uso. Enfócate exclusivamente en herramientas de Google.",
    inputSchema: z.object({
      query: z.string().optional().describe("Búsqueda opcional por nombre, descripción o caso de uso de la herramienta de Google. Si no se proporciona, se retornarán todas las herramientas de la categoría especificada."),
      category: z.string().optional().describe("Categoría específica de herramientas de Google (ej: 'Google Cloud Platform', 'Google Workspace', 'Google AI/ML')"),
      limit: z.number().optional().default(5).describe("Número máximo de herramientas a retornar"),
    }),
    outputSchema: z.object({
      tools: z.array(z.object({
        nombre: z.string(),
        categoria: z.string(),
        descripcion: z.string(),
        url: z.string(),
        casos_de_uso: z.array(z.string()),
        plan: z.string(),
        ranking: z.number(),
      })),
      total: z.number(),
    }),
  },
  async ({ query, category, limit = 5 }: { query?: string; category?: string; limit?: number }) => {
    let results: Array<Tool & { categoria: string }> = [];

    // Filtrar por categoría si se especifica
    const categoriesToSearch = category 
      ? toolsData.filter(cat => cat.nombre.toLowerCase().includes(category.toLowerCase()))
      : toolsData;

    // Buscar en todas las herramientas
    for (const niche of categoriesToSearch) {
      for (const tool of niche.herramientas) {
        // Si no hay query, incluir todas las herramientas de la categoría
        // Si hay query, filtrar por coincidencias
        if (!query) {
          results.push({
            ...tool,
            categoria: niche.nombre,
          });
        } else {
          const queryLower = query.toLowerCase();
          const matchesQuery = 
            tool.nombre.toLowerCase().includes(queryLower) ||
            tool.descripcion.toLowerCase().includes(queryLower) ||
            tool.casos_de_uso.some(uso => uso.toLowerCase().includes(queryLower));

          if (matchesQuery) {
            results.push({
              ...tool,
              categoria: niche.nombre,
            });
          }
        }
      }
    }

    // Ordenar por ranking y limitar resultados
    results = results
      .sort((a, b) => a.ranking - b.ranking)
      .slice(0, limit);

    return {
      tools: results.map(tool => ({
        nombre: tool.nombre,
        categoria: tool.categoria,
        descripcion: tool.descripcion,
        url: tool.url,
        casos_de_uso: tool.casos_de_uso,
        plan: tool.plan,
        ranking: tool.ranking,
      })),
      total: results.length,
    };
  }
);

// Herramienta para obtener todas las categorías disponibles
export const getCategories = ai.defineTool(
  {
    name: "getCategories",
    description: "Obtiene la lista de todas las categorías de herramientas de Google disponibles",
    inputSchema: z.object({}),
    outputSchema: z.object({
      categories: z.array(z.string()),
    }),
  },
  async () => {
    return {
      categories: toolsData.map(niche => niche.nombre),
    };
  }
);

// Mantener la herramienta de personalidad por si se necesita
export const getPersonality = ai.defineTool(
  {
    name: "getPersonality",
    description: "get the personality of specific character provided by the user, it can be a character from a book, movie, or any fictional universe",
    inputSchema: z.object({
      character: z.string().describe("The name of the character to get personality for"),
    }),
    outputSchema: z.object({
      personality: z.string().describe("The personality description of the character"),
    }),
  },
  async ({ character }: { character: string }) => {
    const response = await ai.generate({
      system: "You are an expert in character analysis. Provide a detailed personality description of the character based on the provided name.",
      prompt: `Character Name: ${character}`,
      tools: [],
    });

    return { personality: response.text };
  }
);
