'use client'

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Trash2, ArrowDown, X, FileText, Image as ImageIcon, StopCircle } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useChat } from "./use-chat";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// import { PersonajeSelectorModal } from "../PersonajeSelectorModal";
// import CreditCounter from "../CreditCounter";

type Personaje = { key: string; label: string; emoji: string };
type PersonajeSelection =
  | { type: "predefinido"; personaje: Personaje }
  | { type: "custom"; value: string };

export default function ChatContainer() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isGenerating,
    sendMessage,
    error,
    clearChat,
    pdfContent,
    setPDFContent,
    // summarizeYouTube,
    abortGeneration
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  // const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  // const [youtubeUrl, setYoutubeUrl] = useState("");
  // const [youtubePrompt, setYoutubePrompt] = useState("");
  const [showPersonajeModal, setShowPersonajeModal] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Asegurarnos de que la imagen se envíe como base64 puro
        const base64String = reader.result as string;
        // Eliminar el prefijo de data URL si existe
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input, selectedImage || undefined);
      setInput("");
      setSelectedImage(null);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollTop < scrollHeight - clientHeight - 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Nueva función para manejar la selección de personaje
  const handlePersonajeSelect = (selection: PersonajeSelection) => {
    if (selection.type === "predefinido") {
      sendMessage(
        `Quiero hablar con el personaje ${selection.personaje.label}. Responde directamente como ese personaje, sin explicaciones ni introducciones.`
      );
    } else if (selection.type === "custom") {
      sendMessage(
        `Quiero hablar con un personaje personalizado. Características: ${selection.value}. Responde directamente como ese personaje, usando su estilo y personalidad, sin explicaciones ni introducciones.`
      );
    }
  };

  let mainContent;
  if (messages.length === 0) {
    mainContent = (
      <motion.div
        className="touch-none h-full min-h-[70vh] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Bot className="h-14 w-14 mb-4 text-indigo-500 dark:text-indigo-400 animate-bounce" />
        <motion.h2
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] mb-8 text-center drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ¿Qué te gustaría hacer hoy?
        </motion.h2>
        <div className="flex flex-row items-center gap-4 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowPersonajeModal(true)}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 dark:hover:shadow-pink-500/10 hover:bg-pink-50 dark:hover:bg-pink-900/20"
          >
            <span className="text-2xl">🎭</span>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Hablar con personajes
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ImageIcon className="h-4 w-4 text-blue-500" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Agregar imagen
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => pdfInputRef.current?.click()}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 dark:hover:shadow-green-500/10 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <FileText className="h-4 w-4 text-green-500" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Agregar PDF
            </span>
          </Button>
          {/* <Button
            variant="outline"
            size="icon"
            onClick={() => setShowYouTubeModal(true)}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/10 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
              <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.222 3.5 12 3.5 12 3.5s-7.222 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.35 0 12 0 12s0 3.65.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.778 20.5 12 20.5 12 20.5s7.222 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.65 24 12 24 12s0-3.65-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Resumir YouTube
            </span>
          </Button> */}
        </div>
      </motion.div>
    );
  } else {
    mainContent = (
      <motion.div
        className="space-y-4 min-h-[200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLastMessage={index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </motion.div>
    );
  }

  return (
    <Card className="bg-transparent w-full mx-auto h-full flex flex-col border-0 touch-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
          Connie
        </CardTitle>
        <div className="flex items-center gap-3">
          {/* <CreditCounter /> */}
          <Button
            variant="outline"
            size="icon"
            onClick={clearChat}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 dark:hover:shadow-yellow-500/10 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            <Trash2 className="h-4 w-4 text-yellow-500" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Limpiar chat
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden relative">
        <ScrollArea 
          className="h-full p-4" 
          onScroll={handleScroll}
          ref={scrollAreaRef}
        >
          <AnimatePresence>
            {mainContent}
          </AnimatePresence>
        </ScrollArea>

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
              className="rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </CardContent>

      <AnimatePresence>
        {isLoading && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-start gap-3 p-4"
          >
            <Avatar className="h-8 w-8 bg-indigo-500 dark:bg-indigo-600 shadow-md flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </Avatar>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <div className="typing-indicator">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 my-3 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-lg text-sm shadow-lg"
          >
            <p className="font-semibold mb-1">Error:</p>
            <p>{error.message || "Failed to generate response. Please try again."}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput(input)}
              className="mt-2 text-xs border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-200"
            >
              Intentar de nuevo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedImage && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative w-32 h-32">
              <Image
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Imagen seleccionada"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Eliminar imagen
            </Button>
          </div>
        </div>
      )}

      {pdfContent && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              PDF cargado como contexto
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPDFContent(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Eliminar PDF
            </Button>
          </div>
        </div>
      )}

      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type={isGenerating ? "button" : "submit"}
            disabled={isLoading || (!input.trim() && !isGenerating)}
            onClick={isGenerating ? abortGeneration : undefined}
            className={`hover:scale-105 transition-all duration-300 hover:shadow-lg ${
              isGenerating
                ? "hover:shadow-orange-500/20 dark:hover:shadow-orange-500/10 bg-orange-500 hover:bg-orange-600"
                : "hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10 bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {isGenerating ? <StopCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
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

      {/* Modal para resumir videos de YouTube */}
      {/* {showYouTubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-2xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Resumir video de YouTube</h2>
            <Input
              type="url"
              placeholder="Pega la URL de un video de YouTube..."
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="mb-3"
            />
            <Input
              type="text"
              placeholder="¿Qué quieres saber del video? (opcional)"
              value={youtubePrompt}
              onChange={e => setYoutubePrompt(e.target.value)}
              className="mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowYouTubeModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (youtubeUrl) {
                    summarizeYouTube(youtubeUrl, youtubePrompt);
                    setYoutubeUrl("");
                    setYoutubePrompt("");
                    setShowYouTubeModal(false);
                  }
                }}
                disabled={!youtubeUrl || isLoading}
              >
                Resumir video
              </Button>
            </div>
          </div>
        </div>
      )} */}

      {/* Modal de selección de personaje */}
      {/* <PersonajeSelectorModal
        open={showPersonajeModal}
        onClose={() => setShowPersonajeModal(false)}
        onSelect={handlePersonajeSelect}
      /> */}
    </Card>
  );
}
