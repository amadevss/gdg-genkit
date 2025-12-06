import AIChatContainer from "../components/ChatContainerGemma/ai-chat-container";

export default function Page() {
  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20 dark:to-muted/10" />
      
      {/* Patrón de cuadrícula sutil */}
      <div className="absolute inset-0 grid-pattern opacity-30 dark:opacity-20" />
      
      {/* Efectos de luz decorativos */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 dark:bg-purple-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 dark:bg-indigo-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Contenido principal */}
      <div className="relative z-10 h-full w-full flex flex-col">
        {/* Espaciado superior para el navbar transparente en móvil */}
        <div className="h-16 sm:h-20 md:h-0 shrink-0" />
        
        {/* Contenedor principal del chat con estilos mejorados */}
        <div className="flex-1 min-h-0 w-full max-h-full overflow-hidden">
          <div className="h-full w-full max-h-full overflow-hidden">
            {/* Contenedor con efecto glassmorphism sutil */}
            <div className="h-full w-full max-h-full rounded-2xl sm:rounded-3xl bg-card/30 dark:bg-card/40 backdrop-blur-sm border border-border/50 dark:border-border/30 shadow-xl dark:shadow-2xl overflow-hidden">
              <AIChatContainer />
            </div>
          </div>
        </div>
        
        {/* Espaciado inferior para evitar que el contenido se corte */}
        <div className="h-4 sm:h-6 md:h-0 shrink-0" />
      </div>
    </div>
  );
}
