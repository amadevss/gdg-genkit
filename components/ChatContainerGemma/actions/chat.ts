"use server";
import { z } from "zod";
import { textInputSchema, imageInputSchema, pdfInputSchema, youtubeInputSchema } from "./types";
import { searchTools, getCategories } from "../tools/actions/chat";
import { ai } from "../IA";

// Preparar contexto de herramientas para el prompt
const getToolsContext = () => {
  // Categorías de herramientas de Google
  const categories = "Google Cloud Platform, Google Workspace, Google AI/ML, Google Analytics, Google Ads, Google Marketing Platform, Google Developer Tools, Firebase, Android Development, Chrome Extensions, Google Maps Platform, Google Search Console";
  
  return { categories };
};

// Función para chat de texto
export async function generateTextResponse(
  input: z.infer<typeof textInputSchema>
) {
  try {
    const { prompt, history } = textInputSchema.parse(input);
    const { categories } = getToolsContext();

    const response = await ai.generate({
      system: `Eres un asistente experto especializado en herramientas y servicios de Google. Tu función principal es ayudar a los usuarios a encontrar las mejores herramientas de Google según sus necesidades.

**Tu conocimiento incluye estas categorías de herramientas de Google:**
${categories}

**Tu función:**
1. Cuando el usuario pregunte sobre herramientas específicas de Google, usa la herramienta searchTools UNA SOLA VEZ para buscar información
2. Después de obtener resultados de searchTools, proporciona una respuesta completa y final al usuario
3. Comparar herramientas de Google cuando el usuario pida comparaciones
4. Explicar casos de uso, ventajas y desventajas de cada herramienta de Google
5. Sugerir alternativas dentro del ecosistema de Google cuando sea apropiado
6. Proporcionar información sobre planes de precios y disponibilidad de las herramientas
7. Mencionar integraciones entre herramientas de Google cuando sea relevante

**Estilo de respuesta:**
- Sé profesional pero amigable 🚀
- Usa emojis para hacer las respuestas más visuales
- Incluye enlaces oficiales a las herramientas de Google cuando las recomiendes
- Formatea las respuestas de manera clara con listas y secciones
- Siempre menciona el plan/precio de las herramientas cuando sea relevante
- Destaca las ventajas del ecosistema de Google cuando sea apropiado
- Si no encuentras herramientas específicas, sugiere categorías relacionadas de Google

**IMPORTANTE:** 
- Usa searchTools SOLO cuando el usuario pregunte específicamente sobre herramientas de Google que necesites buscar
- Después de usar searchTools UNA VEZ, proporciona tu respuesta final al usuario sin llamar más herramientas
- Si puedes responder directamente sin buscar, hazlo sin usar herramientas
- Enfócate exclusivamente en herramientas y servicios de Google`,
      prompt: `Historial de la conversación:
${history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

Pregunta del usuario: ${prompt}

Responde de manera útil y profesional. Si necesitas buscar herramientas específicas, usa searchTools UNA SOLA VEZ y luego proporciona tu respuesta final.`,
      tools: [searchTools, getCategories]
    });

    // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Revalidación de créditos comentada
    // revalidatePath('/api/credits');

    return { text: response.text };
  } catch (error) {
    console.error("Error en generateTextResponse:", error);
    // throw new Error("Error al generar respuesta de texto");
  }
}

// Función para chat con imagen
export async function generateImageResponse(
  input: z.infer<typeof imageInputSchema>
) {
  try {
    const { prompt, imageBase64, history } = imageInputSchema.parse(input);

    const response = await ai.generate([
      {
        text: `Eres un asistente experto en herramientas de Google. El usuario te está mostrando una imagen y pregunta sobre herramientas de Google relacionadas.

Historial de la conversación:
${history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

Pregunta del usuario sobre la imagen: ${prompt}

Analiza la imagen y recomienda herramientas de Google relevantes. Si es necesario, usa la herramienta searchTools para buscar herramientas específicas de Google.`,
      },
      {
        media: {
          url: `data:image/jpeg;base64,${imageBase64}`,
          contentType: "image/jpeg",
        },
      },
    ]);

    // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Revalidación de créditos comentada
    // revalidatePath('/api/credits');

    return { text: response.text };
  } catch (error) {
    console.error("Error en generateImageResponse:", error);
    throw new Error("Error al generar respuesta con imagen");
  }
}

// Función para chat con PDF
export async function generatePDFResponse(
  input: z.infer<typeof pdfInputSchema>
) {
  try {
    const { prompt, pdfContent, history } = pdfInputSchema.parse(input);

    const response = await ai.generate({
      system: "Eres un asistente experto en herramientas de Google. Puedes analizar documentos PDF y recomendar herramientas de Google relevantes basándote en el contenido.",
      prompt: `Contenido del PDF: ${pdfContent}
      
Historial de la conversación:
${history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

Pregunta del usuario: ${prompt}

Analiza el PDF y recomienda herramientas de Google relevantes. Si es necesario, usa la herramienta searchTools para buscar herramientas específicas de Google.`,
    });

    // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Revalidación de créditos comentada
    // revalidatePath('/api/credits');

    return { text: response.text };
  } catch (error) {
    console.error("Error en generatePDFResponse:", error);
    throw new Error("Error al generar respuesta con PDF");
  }
}

// Función para resumir videos de YouTube
export async function summarizeYouTubeVideo(
  input: z.infer<typeof youtubeInputSchema>
) {
  try {
    const { videoUrl, prompt } = youtubeInputSchema.parse(input);

    const response = await ai.generate({
      prompt: [
        { text: prompt || "Detalles del siguiente video de YouTube:" },
        { media: { url: videoUrl, contentType: "video/mp4" } }
      ],
    });

    // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Revalidación de créditos comentada
    // revalidatePath('/api/credits');

    return { text: response.text };
  } catch (error) {
    console.error("Error al resumir video de YouTube:", error);
    throw new Error("Error al resumir video de YouTube");
  }
}
