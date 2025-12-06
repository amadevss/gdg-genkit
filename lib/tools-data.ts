export interface Tool {
  nombre: string;
  descripcion: string;
  url: string;
  casos_de_uso: string[];
  plan: string;
  ranking: number;
}

export interface ToolCategory {
  nombre: string;
  herramientas: Tool[];
}

export const toolsData: ToolCategory[] = [
  {
    nombre: "Google Cloud Platform",
    herramientas: [
      {
        nombre: "Compute Engine",
        descripcion: "Máquinas virtuales escalables en la nube de Google",
        url: "https://cloud.google.com/compute",
        casos_de_uso: ["Hosting de aplicaciones", "Procesamiento de datos", "Servidores web"],
        plan: "Pay-as-you-go",
        ranking: 1
      },
      {
        nombre: "Cloud Storage",
        descripcion: "Almacenamiento de objetos escalable y seguro",
        url: "https://cloud.google.com/storage",
        casos_de_uso: ["Backup de datos", "CDN", "Almacenamiento de archivos"],
        plan: "Pay-as-you-go",
        ranking: 2
      },
      {
        nombre: "Cloud Functions",
        descripcion: "Funciones serverless sin servidor que escalan automáticamente",
        url: "https://cloud.google.com/functions",
        casos_de_uso: ["Microservicios", "APIs serverless", "Procesamiento de eventos"],
        plan: "Pay-as-you-go",
        ranking: 3
      },
      {
        nombre: "Cloud Run",
        descripcion: "Plataforma completamente administrada para ejecutar contenedores",
        url: "https://cloud.google.com/run",
        casos_de_uso: ["Aplicaciones containerizadas", "APIs REST", "Microservicios"],
        plan: "Pay-as-you-go",
        ranking: 4
      },
      {
        nombre: "BigQuery",
        descripcion: "Almacén de datos empresarial sin servidor y altamente escalable",
        url: "https://cloud.google.com/bigquery",
        casos_de_uso: ["Análisis de datos", "Business Intelligence", "Data Warehousing"],
        plan: "Pay-as-you-go",
        ranking: 5
      }
    ]
  },
  {
    nombre: "Google Workspace",
    herramientas: [
      {
        nombre: "Gmail",
        descripcion: "Correo electrónico empresarial con almacenamiento ilimitado",
        url: "https://workspace.google.com/products/gmail/",
        casos_de_uso: ["Comunicación empresarial", "Colaboración", "Gestión de correo"],
        plan: "Desde $6/usuario/mes",
        ranking: 1
      },
      {
        nombre: "Google Drive",
        descripcion: "Almacenamiento en la nube y sincronización de archivos",
        url: "https://workspace.google.com/products/drive/",
        casos_de_uso: ["Almacenamiento de archivos", "Colaboración", "Backup"],
        plan: "Desde $6/usuario/mes",
        ranking: 2
      },
      {
        nombre: "Google Docs",
        descripcion: "Procesador de textos colaborativo en tiempo real",
        url: "https://workspace.google.com/products/docs/",
        casos_de_uso: ["Documentación", "Colaboración en documentos", "Edición en tiempo real"],
        plan: "Desde $6/usuario/mes",
        ranking: 3
      },
      {
        nombre: "Google Sheets",
        descripcion: "Hojas de cálculo colaborativas en la nube",
        url: "https://workspace.google.com/products/sheets/",
        casos_de_uso: ["Análisis de datos", "Planificación", "Reportes"],
        plan: "Desde $6/usuario/mes",
        ranking: 4
      },
      {
        nombre: "Google Meet",
        descripcion: "Videoconferencias y reuniones virtuales",
        url: "https://workspace.google.com/products/meet/",
        casos_de_uso: ["Reuniones virtuales", "Presentaciones", "Colaboración remota"],
        plan: "Desde $6/usuario/mes",
        ranking: 5
      }
    ]
  },
  {
    nombre: "Google AI/ML",
    herramientas: [
      {
        nombre: "Vertex AI",
        descripcion: "Plataforma unificada de ML para entrenar y desplegar modelos",
        url: "https://cloud.google.com/vertex-ai",
        casos_de_uso: ["Machine Learning", "Modelos de IA", "AutoML"],
        plan: "Pay-as-you-go",
        ranking: 1
      },
      {
        nombre: "Gemini API",
        descripcion: "API de Google para acceder a modelos de lenguaje Gemini",
        url: "https://ai.google.dev/",
        casos_de_uso: ["Chatbots", "Generación de texto", "Análisis de lenguaje"],
        plan: "Pay-as-you-go",
        ranking: 2
      },
      {
        nombre: "TensorFlow",
        descripcion: "Framework de código abierto para machine learning",
        url: "https://www.tensorflow.org/",
        casos_de_uso: ["Deep Learning", "Redes neuronales", "Investigación en ML"],
        plan: "Gratis",
        ranking: 3
      },
      {
        nombre: "Cloud Vision API",
        descripcion: "API de visión por computadora para análisis de imágenes",
        url: "https://cloud.google.com/vision",
        casos_de_uso: ["Reconocimiento de imágenes", "OCR", "Análisis de contenido"],
        plan: "Pay-as-you-go",
        ranking: 4
      },
      {
        nombre: "Cloud Natural Language API",
        descripcion: "API para análisis de texto y lenguaje natural",
        url: "https://cloud.google.com/natural-language",
        casos_de_uso: ["Análisis de sentimientos", "Extracción de entidades", "Clasificación de texto"],
        plan: "Pay-as-you-go",
        ranking: 5
      }
    ]
  },
  {
    nombre: "Firebase",
    herramientas: [
      {
        nombre: "Firebase Authentication",
        descripcion: "Autenticación de usuarios segura y escalable",
        url: "https://firebase.google.com/products/auth",
        casos_de_uso: ["Login de usuarios", "Autenticación social", "Gestión de sesiones"],
        plan: "Gratis hasta 50K MAU",
        ranking: 1
      },
      {
        nombre: "Cloud Firestore",
        descripcion: "Base de datos NoSQL en tiempo real",
        url: "https://firebase.google.com/products/firestore",
        casos_de_uso: ["Aplicaciones móviles", "Datos en tiempo real", "Sincronización"],
        plan: "Gratis hasta 1GB",
        ranking: 2
      },
      {
        nombre: "Firebase Hosting",
        descripcion: "Hosting rápido y seguro para aplicaciones web",
        url: "https://firebase.google.com/products/hosting",
        casos_de_uso: ["Hosting de SPAs", "Sitios estáticos", "CDN"],
        plan: "Gratis hasta 10GB",
        ranking: 3
      },
      {
        nombre: "Cloud Functions for Firebase",
        descripcion: "Funciones serverless para Firebase",
        url: "https://firebase.google.com/products/functions",
        casos_de_uso: ["Backend serverless", "Webhooks", "Procesamiento de datos"],
        plan: "Pay-as-you-go",
        ranking: 4
      }
    ]
  },
  {
    nombre: "Google Analytics",
    herramientas: [
      {
        nombre: "Google Analytics 4",
        descripcion: "Plataforma de análisis web y móvil",
        url: "https://analytics.google.com/",
        casos_de_uso: ["Análisis de tráfico", "Conversiones", "Comportamiento de usuarios"],
        plan: "Gratis",
        ranking: 1
      },
      {
        nombre: "Google Tag Manager",
        descripcion: "Gestión de etiquetas sin código",
        url: "https://tagmanager.google.com/",
        casos_de_uso: ["Gestión de tags", "Tracking", "Optimización"],
        plan: "Gratis",
        ranking: 2
      },
      {
        nombre: "Google Search Console",
        descripcion: "Herramienta para monitorear y mantener la presencia en Google Search",
        url: "https://search.google.com/search-console",
        casos_de_uso: ["SEO", "Indexación", "Rendimiento en búsqueda"],
        plan: "Gratis",
        ranking: 3
      }
    ]
  },
  {
    nombre: "Google Developer Tools",
    herramientas: [
      {
        nombre: "Android Studio",
        descripcion: "IDE oficial para desarrollo de aplicaciones Android",
        url: "https://developer.android.com/studio",
        casos_de_uso: ["Desarrollo Android", "Debugging", "Emuladores"],
        plan: "Gratis",
        ranking: 1
      },
      {
        nombre: "Chrome DevTools",
        descripcion: "Herramientas de desarrollo integradas en Chrome",
        url: "https://developer.chrome.com/docs/devtools/",
        casos_de_uso: ["Debugging", "Performance", "Testing"],
        plan: "Gratis",
        ranking: 2
      },
      {
        nombre: "Google Cloud SDK",
        descripcion: "Herramientas de línea de comandos para Google Cloud",
        url: "https://cloud.google.com/sdk",
        casos_de_uso: ["Automatización", "CI/CD", "Gestión de recursos"],
        plan: "Gratis",
        ranking: 3
      }
    ]
  }
];


