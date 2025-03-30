// File: store/useChatStore.tsx
"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useMemo,
} from 'react';
import Fuse from 'fuse.js';
import { ChatIntent } from './chatIntents'; // Solo se usa para el tipo

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
    ambiguousIntents: ChatIntent[];
    showAmbiguityModal: boolean;
    setAmbiguousIntents: (intents: ChatIntent[]) => void;
    resolveAmbiguity: (intent?: ChatIntent) => void;
    openAmbiguityModal: () => void; // Función para abrir el modal manualmente
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatIntents, setChatIntents] = useState<ChatIntent[]>([]);
    const [lastQuery, setLastQuery] = useState<string | null>(null);
    const [ambiguousIntents, setAmbiguousIntents] = useState<ChatIntent[]>([]);
    const [showAmbiguityModal, setShowAmbiguityModal] = useState(false);
    // En store/useChatStore.tsx, al inicio del archivo (o dentro del componente)
    const PROCESSING_TEXT = "Procesando...";


    // Cargar los intents desde la DB al iniciar
    useEffect(() => {
        async function fetchIntents() {
            try {
                const res = await fetch('/api/admin/training');
                const data = await res.json();
                setChatIntents(data.intents);
            } catch (error) {
                console.error("Error al cargar los intents:", error);
            }
        }
        fetchIntents();
    }, []);

    // Crear la instancia de Fuse.js usando los intents cargados
    const fuse = useMemo(
        () =>
            new Fuse(chatIntents, {
                keys: ['title', 'description', 'examples', 'response'],
                threshold: 0.4,
                ignoreLocation: true,
                includeMatches: true,
                minMatchCharLength: 3,
            }),
        [chatIntents]
    );

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    // Función para seleccionar un intent
    const selectIntent = async (intent: ChatIntent) => {
        addMessage({ type: 'user', text: intent.title });
        +   addMessage({ type: 'bot', text: PROCESSING_TEXT });

        // Si existe una consulta previa, se "aprende" de ella
        if (lastQuery) {
            try {
                await fetch('/api/admin/learn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: lastQuery, intentId: intent.id }),
                });
            } catch (error) {
                console.error("Error al aprender de la selección:", error);
            }
            setLastQuery(null);
        }

        // Simular un "typing..." de 2 segundos
        setTimeout(() => {
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { type: 'bot', text: intent.response };
                return newMessages;
            });
        }, 2000);
    };


    // Función para enviar la consulta del usuario
    const handleUserQuery = async (query: string) => {
        addMessage({ type: 'user', text: query });
        addMessage({ type: 'bot', text: "Procesando..." });
        setLastQuery(query);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query }),
            });
            const data = await response.json();

            // Si el intent es "None" o el score < 0.5, revisamos con Fuse
            if (data.intent === 'None' || data.score < 0.5) {
                const possibleIntents = getFilteredIntents(query).slice(0, 3);
                if (possibleIntents.length > 1) {
                    setAmbiguousIntents(possibleIntents);
                    // En vez de abrir el modal automáticamente, actualizamos el mensaje con un prefijo "AMBIGUOUS:"
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            type: 'bot',
                            text:
                                "AMBIGUOUS: No estoy seguro de haber entendido correctamente. ¿Podrías seleccionar la opción que mejor se adapte a tu consulta?",
                        };
                        return newMessages;
                    });
                    return; // Salir para evitar sobrescribir el mensaje con la respuesta normal
                }
            }

            // Si no hay ambigüedad, mostrar la respuesta normal
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    type: 'bot',
                    text: data.answer || "Lo siento, no entendí tu pregunta.",
                };
                return newMessages;
            });
            setLastQuery(null);
        } catch (error) {
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    type: 'bot',
                    text: "Error en la conexión con el servicio de IA.",
                };
                return newMessages;
            });
        }
    };

    const getFilteredIntents = (query: string): ChatIntent[] => {
        if (query.trim() === "") {
            return chatIntents;
        }
        const result = fuse.search(query);
        return result.map((r) => r.item);
    };

    // Función para resolver ambigüedad cuando el usuario selecciona una opción o decide no elegir
    const resolveAmbiguity = (intent?: ChatIntent) => {
        setShowAmbiguityModal(false);
        if (intent) {
            selectIntent(intent);
        } else {
            addMessage({
                type: 'bot',
                text: "Por favor reformula tu consulta o selecciona una opción de la lista.",
            });
        }
    };

    // Función para abrir el modal de ambigüedad manualmente
    const openAmbiguityModal = () => {
        if (ambiguousIntents.length > 0) {
            setShowAmbiguityModal(true);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                chatIntents,
                addMessage,
                selectIntent,
                handleUserQuery,
                getFilteredIntents,
                ambiguousIntents,
                showAmbiguityModal,
                setAmbiguousIntents,
                openAmbiguityModal,
                resolveAmbiguity,
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
