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

    // En tu archivo useChatStore.tsx
    const handleUserQuery = async (query: string) => {
        addMessage({ type: 'user', text: query });
        const processingMessage = addMessage({ type: 'bot', text: "Procesando..." });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query })
            });
            const data = await response.json();

            // Reemplaza el mensaje de procesamiento
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    type: 'bot',
                    text: data.answer || "No entendí tu mensaje."
                };
                return newMessages;
            });
        } catch {
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
