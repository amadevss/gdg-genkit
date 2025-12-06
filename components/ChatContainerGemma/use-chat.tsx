'use client';

import { useState, useCallback, useRef } from 'react';
import { generateTextResponse, generateImageResponse, generatePDFResponse, summarizeYouTubeVideo } from '../ChatContainerGemma/actions/chat';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  mediaUrl?: string;
};

export type CreditData = {
  dailyRequests: number;
  dailyRequestsUsed: number;
  remainingRequests: number;
  totalCoinns: number;
  canMakeRequest: boolean;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pdfContent, setPDFContent] = useState<string | null>(null);
  const [credits, setCredits] = useState<CreditData | null>(null);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función para verificar y consumir crédito
  const checkAndConsumeCredit = useCallback(async (): Promise<boolean> => {
    try {
      // Consumir crédito
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'consume' }),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar créditos locales
        const creditsResponse = await fetch('/api/credits', {
          method: 'GET',
          credentials: 'include',
        });
        const creditsResult = await creditsResponse.json();
        
        if (creditsResult.success) {
          setCredits(creditsResult.data);
        }
        
        return true;
      } else {
        setCreditsError(result.error);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar créditos:', error);
      setCreditsError('Error de conexión al verificar créditos');
      return false;
    }
  }, []);

  const sendMessage = useCallback(async (content: string, imageBase64?: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setIsGenerating(true);
      setError(null);
      setCreditsError(null);

      // ✅ VERIFICAR Y CONSUMIR CRÉDITO ANTES DE PROCESAR
      const hasCredit = await checkAndConsumeCredit();
      if (!hasCredit) {
        setError(new Error(creditsError || 'No tienes suficientes peticiones disponibles'));
        return;
      }

      // Crear el mensaje del usuario con la imagen si existe
      const userMessage: Message = {
        role: 'user',
        content,
        ...(imageBase64 && { mediaUrl: `data:image/jpeg;base64,${imageBase64}` }),
      };

      // Agregar el mensaje del usuario al historial
      setMessages(prev => [...prev, userMessage]);

      // Crear un nuevo AbortController
      abortControllerRef.current = new AbortController();

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

      // Agregar la respuesta del asistente
      if (response && response.text) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: response.text },
        ]);
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Generación cancelada por el usuario');
      } else {
        console.error('Error al enviar mensaje:', error);
        setError(error instanceof Error ? error : new Error('Error desconocido'));
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [messages, pdfContent, checkAndConsumeCredit, creditsError]);

  const abortGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setError(null);
    setCreditsError(null);
    setPDFContent(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  // Función para obtener créditos actualizados
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

  // Nueva función para resumir videos de YouTube
  const summarizeYouTube = useCallback(async (videoUrl: string, prompt?: string) => {
    setIsLoading(true);
    setError(null);
    setCreditsError(null);

    // ✅ VERIFICAR Y CONSUMIR CRÉDITO ANTES DE PROCESAR
    const hasCredit = await checkAndConsumeCredit();
    if (!hasCredit) {
      setError(new Error(creditsError || 'No tienes suficientes peticiones disponibles'));
      setIsLoading(false);
      return;
    }

    try {
      setMessages(prev => [...prev, { role: 'user', content: `Resumir video: ${videoUrl}` }]);
      const response = await summarizeYouTubeVideo({ videoUrl, prompt });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Error al resumir video de YouTube'));
    } finally {
      setIsLoading(false);
    }
  }, [checkAndConsumeCredit, creditsError]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isGenerating,
    error,
    sendMessage,
    abortGeneration,
    clearChat,
    addMessage,
    pdfContent,
    setPDFContent,
    summarizeYouTube,
    // ✅ NUEVAS PROPIEDADES DE CRÉDITOS
    credits,
    creditsError,
    refreshCredits,
  };
}
