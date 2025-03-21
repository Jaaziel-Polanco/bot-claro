"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Fuse from 'fuse.js';
import { ChatIntent, chatIntents } from './chatIntents';

export interface Message {
    type: 'user' | 'bot';
    text: string;
}

interface ChatContextProps {
    messages: Message[];
    chatIntents: ChatIntent[];
    addMessage: (msg: Message) => void;
    selectIntent: (intent: ChatIntent) => void;
    handleUserQuery: (query: string) => void;
    getFilteredIntents: (query: string) => ChatIntent[];
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const intents = chatIntents;

    const fuse = new Fuse(intents, {
        keys: ['title', 'description', 'examples', 'response'],
        threshold: 0.4,
        ignoreLocation: true,
        includeMatches: true,
        minMatchCharLength: 3
    });

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const selectIntent = (intent: ChatIntent) => {
        addMessage({ type: 'user', text: intent.title });
        addMessage({ type: 'bot', text: "..." });
        setTimeout(() => {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { type: 'bot', text: intent.response };
                return newMessages;
            });
        }, 2000);
    };

    const handleUserQuery = async (query: string) => {
        addMessage({ type: 'user', text: query });
        addMessage({ type: 'bot', text: "..." }); // Mensaje de carga

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query })
            });
            const data = await response.json();

            // Si el score es muy bajo o el intent no es claro, se abre modal para que el usuario seleccione.
            if (data.score < 0.3) {
                // Reemplaza el mensaje de carga por un mensaje que indique ambigüedad.
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        type: 'bot',
                        text: "No estoy seguro de haber entendido correctamente. ¿Podrías seleccionar la opción que mejor se adapte a tu consulta?"
                    };
                    return newMessages;
                });
                // Aquí se podría abrir un modal para mostrar todas las opciones (usa getFilteredIntents)
                // Por ejemplo: setModalOpen(true);
            } else {
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        type: 'bot',
                        text: data.answer || "Lo siento, no entendí tu pregunta."
                    };
                    return newMessages;
                });
            }
        } catch (error) {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    type: 'bot',
                    text: "Error en la conexión con el servicio de IA."
                };
                return newMessages;
            });
        }
    };

    const getFilteredIntents = (query: string): ChatIntent[] => {
        if (query.trim() === "") {
            return intents;
        }
        const result = fuse.search(query);
        return result.map(r => r.item);
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                chatIntents: intents,
                addMessage,
                selectIntent,
                handleUserQuery,
                getFilteredIntents,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatStore = (): ChatContextProps => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatStore must be used within a ChatProvider");
    }
    return context;
};
