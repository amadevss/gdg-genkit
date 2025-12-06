'use client';

import { useState, useCallback, useRef } from 'react';
import { generateTextResponse, generateImageResponse, generatePDFResponse, summarizeYouTubeVideo } from './actions/chat';
import { useToast } from '@/app/components/ui/Toast';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mediaUrl?: string;
  createdAt?: Date;
  annotations?: unknown[];
};

export type CreditData = {
  dailyRequests: number;
  dailyRequestsUsed: number;
  remainingRequests: number;
  totalCoinns: number;
  canMakeRequest: boolean;
};


export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pdfContent, setPDFContent] = useState<string | null>(null);
  const [credits, setCredits] = useState<CreditData | null>(null);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { addToast } = useToast();
  // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Función para verificar y consumir crédito
  // const checkAndConsumeCredit = useCallback(async (): Promise<boolean> => {
  //   try {
  //     const response = await fetch('/api/credits', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({ action: 'consume' }),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       const creditsResponse = await fetch('/api/credits', {
  //         method: 'GET',
  //         credentials: 'include',
  //       });
  //       const creditsResult = await creditsResponse.json();
        
  //       if (creditsResult.success) {
  //         setCredits(creditsResult.data);
  //       }
        
  //       return true;
  //     } else {
  //       setCreditsError(result.error);
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Error al verificar créditos:', error);
  //     setCreditsError('Error de conexión al verificar créditos');
  //     return false;
  //   }
  // }, []);
  
  // Función simplificada que siempre permite enviar mensajes (sin verificar créditos)
  // const checkAndConsumeCredit = useCallback(async (): Promise<boolean> => {
  //   return true; // Siempre permite enviar mensajes
  // }, []);

  // Función personalizada para enviar mensajes con verificación de créditos
  const sendMessage = useCallback(async (content: string, imageBase64?: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Verificación de créditos comentada
      // const hasCredit = await checkAndConsumeCredit();
      // if (!hasCredit) {
      //   addToast({
      //     type: 'error',
      //     title: 'No tienes suficientes peticiones disponibles',
      //     message: 'Has alcanzado el límite diario de peticiones. Podrás hacer más peticiones mañana.',
      //     duration: 8000,
      //   });
      //   throw new Error(creditsError || 'No tienes suficientes peticiones disponibles');
      // }

      // Crear mensaje del usuario
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        ...(imageBase64 && { mediaUrl: `data:image/jpeg;base64,${imageBase64}` }),
      };

      // Agregar mensaje del usuario
      setMessages(prev => [...prev, userMessage]);

      // Generar respuesta usando las funciones existentes
      let response;
      if (pdfContent) {
        response = await generatePDFResponse({
          prompt: content,
          pdfContent,
          history: messages,
        });
      } else if (imageBase64) {
        response = await generateImageResponse({
          prompt: content,
          imageBase64,
          history: messages,
        });
      } else {
        response = await generateTextResponse({
          prompt: content,
          history: messages,
        });
      }

      // Agregar respuesta del asistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response?.text || '',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mostrar toast de error en amarillo
      addToast({
        type: 'warning',
        title: 'Error al generar respuesta',
        message: error instanceof Error ? error.message : 'Error desconocido al generar la respuesta',
        duration: 6000,
      });
      
      setError(error instanceof Error ? error : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [messages, pdfContent, addToast]); // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - checkAndConsumeCredit y creditsError removidos de dependencias

  const refreshCredits = useCallback(async () => {
    try {
      const response = await fetch('/api/credits', {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      
      if (result.success) {
        setCredits(result.data);
        setCreditsError(null);
      } else {
        setCreditsError(result.error);
      }
    } catch (error) {
      console.error('Error al obtener créditos:', error);
      setCreditsError('Error de conexión');
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      try {
        setError(null);
        await sendMessage(input, selectedImage || undefined);
        setInput("");
        setSelectedImage(null);
        // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Refresh de créditos comentado
        // await refreshCredits();
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - Verificación de error de peticiones comentada
        // if (error instanceof Error && error.message.includes('peticiones')) {
        //   setError(error);
        // }
      }
    }
  }, [input, isLoading, sendMessage, setInput, selectedImage]); // ⚠️ SISTEMA DE PETICIONES DESHABILITADO - refreshCredits removido de dependencias

  const clearChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setPDFContent(null);
    setSelectedImage(null);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const abortGeneration = useCallback(() => {
    setIsLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reload = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        setMessages(prev => prev.filter(msg => msg.id !== lastUserMessage.id));
        sendMessage(lastUserMessage.content, lastUserMessage.mediaUrl?.replace('data:image/jpeg;base64,', ''));
      }
    }
  }, [messages, sendMessage]);

  const summarizeYouTube = useCallback(async (videoUrl: string, prompt?: string) => {
    if (!videoUrl.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Crear mensaje del usuario
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: prompt || `Resumir video de YouTube: ${videoUrl}`,
        createdAt: new Date(),
      };

      // Agregar mensaje del usuario
      setMessages(prev => [...prev, userMessage]);

      // Llamar a la función de resumen de YouTube
      const response = await summarizeYouTubeVideo({
        videoUrl,
        prompt: prompt || "Resume este video de YouTube y proporciona los detalles más importantes.",
      });

      // Agregar respuesta del asistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response?.text || '',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error al resumir video de YouTube:', error);
      
      addToast({
        type: 'warning',
        title: 'Error al resumir video',
        message: error instanceof Error ? error.message : 'Error desconocido al resumir el video',
        duration: 6000,
      });
      
      setError(error instanceof Error ? error : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isGenerating: isLoading,
    error,
    sendMessage,
    handleSubmit,
    abortGeneration,
    clearChat,
    pdfContent,
    setPDFContent,
    selectedImage,
    setSelectedImage,
    credits,
    creditsError,
    refreshCredits,
    reload,
    summarizeYouTube,
  };
}
