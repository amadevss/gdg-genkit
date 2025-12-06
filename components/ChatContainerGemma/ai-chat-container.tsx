'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Trash2, X, FileText, Image as ImageIcon, StopCircle, ArrowDown, AlertCircle, Play } from "lucide-react";
// ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Zap comentado (se usaba en mensajes de error de peticiones)
// import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
// import { PersonajeSelectorModal } from "../PersonajeSelectorModal";
// ⚠️ SISTEMA DE PETICIONES DESHABILITADO - useToast comentado (se usaba en toast de error de peticiones)
// import { useToast } from "@/app/components/ui/Toast";
import { useAIChat } from './use-ai-chat';

// AI Elements components
import { Actions, Action } from "@/components/ai-elements/actions";
import { Loader } from "@/components/ai-elements/loader";

// type Personaje = { key: string; label: string; emoji: string };
// type PersonajeSelection =
//   | { type: "predefinido"; personaje: Personaje }
//   | { type: "custom"; value: string };


export default function AIChatContainer() {

  const {
    messages,
    input,
    setInput,
    isLoading,
    isGenerating,
    sendMessage,
    handleSubmit,
    error,
    clearChat,
    pdfContent,
    setPDFContent,
    selectedImage,
    setSelectedImage,
    abortGeneration,
    reload,
    summarizeYouTube,
    // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - refreshCredits comentado
    // refreshCredits
  } = useAIChat();



  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const youtubeInputRef = useRef<HTMLInputElement>(null);
  // const [showPersonajeModal, setShowPersonajeModal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [youtubePrompt, setYoutubePrompt] = useState<string>('');
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        setSelectedImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setPDFContent(text);
      sendMessage("He cargado un PDF. Por favor, ayúdame a entender su contenido.");
    } catch (err) {
      console.error('Error reading PDF:', err);
    }
  };

  // Función para validar URLs de YouTube
  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleYouTubeSubmit = () => {
    if (!youtubeUrl || !isValidYouTubeUrl(youtubeUrl)) {
      return;
    }

    summarizeYouTube(youtubeUrl, youtubePrompt || undefined);
    setYoutubeUrl(null);
    setYoutubePrompt('');
    setShowYouTubeModal(false);
  };

  const handleClearChat = () => {
    clearChat();
    setYoutubeUrl(null);
    setYoutubePrompt('');
    setShowYouTubeModal(false);
  };


  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleLike = () => {
    // Implementar lógica de like
    console.log('Message liked');
  };

  const handleDislike = () => {
    // Implementar lógica de dislike
    console.log('Message disliked');
  };

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    if (scrollAreaRef.current && messagesEndRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // Función para hacer scroll hacia abajo
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  // Manejar scroll para mostrar/ocultar botón
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollTop < scrollHeight - clientHeight - 100);
  };

  return (
    <Card className="bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 w-full h-full flex flex-col border-0 dark:border dark:border-purple-500/20 touch-none shadow-xl dark:shadow-2xl dark:shadow-purple-500/10 max-h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 flex-shrink-0 min-h-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-purple-200/50 dark:border-purple-500/20">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 dark:from-purple-400 dark:via-pink-400 dark:to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] drop-shadow-sm">
          Connie
        </CardTitle>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearChat}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 dark:hover:shadow-yellow-500/20 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 w-8 h-8 sm:w-10 sm:h-10 border-yellow-300/50 dark:border-yellow-500/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 dark:bg-purple-900/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block shadow-lg">
              Limpiar chat
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden relative min-h-0 max-h-full bg-linear-to-b from-white/30 to-purple-50/30 dark:from-gray-950/50 dark:to-purple-950/30">
        <div ref={scrollAreaRef} className="h-full overflow-y-auto p-4 max-h-full" onScroll={handleScroll}>
          {messages.length === 0 ? (
            <motion.div
              className="touch-none h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-indigo-500 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 blur-2xl opacity-30 dark:opacity-20 animate-pulse"></div>
                <Bot className="relative h-12 w-12 sm:h-14 sm:w-14 mb-4 text-indigo-600 dark:text-indigo-400 animate-bounce drop-shadow-lg" />
              </div>
              <motion.h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-purple-800 dark:from-purple-400 dark:via-pink-400 dark:to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] mb-6 sm:mb-8 text-center drop-shadow-sm px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ¿Qué herramienta de Google necesitas?
              </motion.h2>
              <div className="flex flex-row items-center gap-2 sm:gap-4 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-500/30 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/40 dark:hover:to-cyan-900/40 w-10 h-10 sm:w-12 sm:h-12 border-blue-300/50 dark:border-blue-500/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-blue-400 dark:hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block shadow-lg">
                    Agregar imagen
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => pdfInputRef.current?.click()}
                  className="relative group hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 dark:hover:shadow-green-500/30 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 w-10 h-10 sm:w-12 sm:h-12 border-green-300/50 dark:border-green-500/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-green-400 dark:hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block shadow-lg">
                    Agregar PDF
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowYouTubeModal(true)}
                  className="relative group hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/40 dark:hover:shadow-red-500/30 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/40 dark:hover:to-pink-900/40 w-10 h-10 sm:w-12 sm:h-12 border-red-300/50 dark:border-red-500/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-red-400 dark:hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-500 dark:to-pink-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block shadow-lg">
                    Resumir video de YouTube
                  </span>
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 sm:gap-3 group py-2 sm:py-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold shadow-lg ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white ring-2 ring-blue-300 dark:ring-blue-400/50' 
                        : 'bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white ring-2 ring-purple-300 dark:ring-purple-400/50'
                    }`}>
                      {message.role === 'user' ? 'U' : 'C'}
                    </div>
                  </div>
                  <div className={`rounded-2xl p-3 sm:p-4 min-w-[120px] sm:min-w-[200px] max-w-[90%] sm:max-w-[85%] shadow-lg transition-all duration-200 backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-blue-500/30 dark:shadow-blue-500/20'
                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border border-purple-200/50 dark:border-purple-500/30 shadow-purple-500/20 dark:shadow-purple-500/10'
                  }`}>
                    {message.mediaUrl && (
                      <div className="relative w-32 h-32 sm:w-48 sm:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden border-2 border-white/50 dark:border-gray-700/50 shadow-lg">
                        <Image
                          src={message.mediaUrl}
                          alt="Imagen adjunta"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className={`prose max-w-none prose-sm sm:prose-base ${
                      message.role === 'user' 
                        ? 'prose-invert' 
                        : 'dark:prose-invert prose-headings:text-purple-900 dark:prose-headings:text-purple-300 prose-p:text-gray-800 dark:prose-p:text-gray-100 prose-strong:text-purple-800 dark:prose-strong:text-purple-300'
                    }`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    
                    {/* Acciones del mensaje */}
                    <div className="mt-3 sm:mt-4 flex justify-end">
                      <Actions>
                        <Action
                          tooltip="Me gusta"
                          onClick={handleLike}
                        >
                          👍
                        </Action>
                        <Action
                          tooltip="No me gusta"
                          onClick={handleDislike}
                        >
                          👎
                        </Action>
                        <Action
                          tooltip="Copiar"
                          onClick={() => handleCopy(message.content)}
                        >
                          📋
                        </Action>
                        {message.role === 'assistant' && (
                          <Action
                            tooltip="Reintentar"
                            onClick={reload}
                          >
                            🔄
                          </Action>
                        )}
                      </Actions>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Loader para cuando está generando */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 sm:gap-3 group py-2 sm:py-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-lg ring-2 ring-purple-300 dark:ring-purple-400/50">
                      C
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-3 sm:p-4 min-w-[120px] sm:min-w-[200px] max-w-[90%] sm:max-w-[85%] border border-purple-200/50 dark:border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/20 dark:shadow-purple-500/10">
                    <Loader />
                  </div>
                </motion.div>
              )}
              {/* Elemento invisible para hacer scroll */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Botón de scroll hacia abajo */}
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={scrollToBottom}
              className="rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-200 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:scale-110"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </CardContent>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-3 sm:p-4 my-2 sm:my-3 text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border border-red-300 dark:border-red-800 rounded-lg text-xs sm:text-sm shadow-lg shadow-red-500/20 dark:shadow-red-500/10 flex-shrink-0 mx-3 sm:mx-4 md:mx-6 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0 drop-shadow" />
              <div className="flex-1">
                <p className="font-semibold mb-1 text-red-700 dark:text-red-300">
                  Error
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error.message || "Failed to generate response. Please try again."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(input)}
                  className="mt-2 text-xs border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 shadow-sm"
                >
                  Intentar de nuevo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedImage && (
        <div className="p-3 sm:p-4 border-t border-purple-200/50 dark:border-purple-500/30 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 border-blue-300 dark:border-blue-500/50 shadow-lg shadow-blue-500/20">
              <Image
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Imagen seleccionada"
                fill
                className="object-cover"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Eliminar imagen</span>
              <span className="sm:hidden">Eliminar</span>
            </Button>
          </div>
        </div>
      )}

      {pdfContent && (
        <div className="p-3 sm:p-4 border-t border-purple-200/50 dark:border-purple-500/30 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 flex-shrink-0 drop-shadow" />
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex-1 min-w-0 truncate font-medium">
              PDF cargado como contexto
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPDFContent(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm flex-shrink-0"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Eliminar PDF</span>
              <span className="sm:hidden">Eliminar</span>
            </Button>
          </div>
        </div>
      )}

      {/* Modal para resumir videos de YouTube */}
      <AnimatePresence>
        {showYouTubeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowYouTubeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-white to-red-50/50 dark:from-gray-900 dark:to-red-950/20 rounded-xl p-4 sm:p-6 shadow-2xl w-full max-w-md border border-red-200 dark:border-red-800/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                Resumir video de YouTube
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Input
                    type="url"
                    placeholder="Pega la URL de un video de YouTube..."
                    value={youtubeUrl || ''}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="mb-2 text-sm sm:text-base bg-white dark:bg-gray-800 border-red-300 dark:border-red-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                  />
                  {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Por favor, ingresa una URL válida de YouTube
                    </p>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="¿Qué quieres saber del video? (opcional)"
                  value={youtubePrompt}
                  onChange={(e) => setYoutubePrompt(e.target.value)}
                  className="text-sm sm:text-base bg-white dark:bg-gray-800 border-red-300 dark:border-red-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowYouTubeModal(false);
                      setYoutubeUrl(null);
                      setYoutubePrompt('');
                    }}
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleYouTubeSubmit}
                    disabled={!youtubeUrl || !isValidYouTubeUrl(youtubeUrl) || isLoading}
                    className="text-sm sm:text-base bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 dark:from-red-600 dark:to-pink-600 dark:hover:from-red-700 dark:hover:to-pink-700 text-white disabled:opacity-50 shadow-lg shadow-red-500/30"
                  >
                    Resumir video
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardFooter className="p-3 sm:p-4 md:p-6 border-t border-purple-200/50 dark:border-purple-500/30 bg-gradient-to-r from-white/80 to-purple-50/50 dark:from-gray-900/80 dark:to-purple-950/30 backdrop-blur-sm flex-shrink-0 min-h-0 sticky bottom-0 z-10">
        <form 
          onSubmit={handleSubmit} 
          className="w-full flex gap-2 sm:gap-3 items-center"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as React.FormEvent<HTMLFormElement>);
            }
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={isLoading}
            className="flex-1 text-sm sm:text-base bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent h-9 sm:h-10 md:h-11 max-h-11 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            type={isGenerating ? "button" : "submit"}
            disabled={isLoading || (!input.trim() && !isGenerating)}
            onClick={isGenerating ? abortGeneration : undefined}
            className={`hover:scale-110 transition-all duration-300 hover:shadow-xl w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating
                ? "hover:shadow-orange-500/40 dark:hover:shadow-orange-500/30 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 dark:from-orange-600 dark:to-red-600 dark:hover:from-orange-700 dark:hover:to-red-700 text-white"
                : "hover:shadow-indigo-500/40 dark:hover:shadow-indigo-500/30 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700 text-white"
            }`}
          >
            {isGenerating ? <StopCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </form>
      </CardFooter>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePDFUpload}
        accept=".pdf"
        className="hidden"
      />
      <input
        type="url"
        ref={youtubeInputRef}
        className="hidden"
      />
    </Card>
  );
}
