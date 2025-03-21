"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Paper, Box, TextField, IconButton, Typography, Button } from '@mui/material';
import { Send } from 'lucide-react';
import Image from 'next/image';
import { useChatStore } from '../store/useChatStore';
import IntentsModal from './IntentsModal'; // Ajusta la ruta según tu estructura

const ChatWidget: React.FC = () => {
    const { messages, addMessage, selectIntent, getFilteredIntents } = useChatStore();
    const [input, setInput] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Agrega mensaje de bienvenida al inicio
    useEffect(() => {
        if (messages.length === 0) {
            addMessage({ type: 'bot', text: "¡Bienvenido al Chat de Soporte! ¿En qué puedo ayudarte hoy?" });
        }
    }, [messages, addMessage]);

    // Scroll automático al final cuando se agregan mensajes
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Filtra los intents según el input y muestra solo 4 inicialmente
    const filteredIntents = getFilteredIntents(input);
    const intentsToShow = filteredIntents.slice(0, 4);

    const handleSend = async () => {
        if (input.trim() === '') return;
        addMessage({ type: 'user', text: input });
        addMessage({ type: 'bot', text: "Procesando..." });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            const data = await response.json();
            addMessage({ type: 'bot', text: data.answer || "No entendí tu mensaje." });
        } catch {
            addMessage({ type: 'bot', text: "Error en la conexión con el servicio de IA." });
        }

        setInput('');
    };

    return (
        <div className="flex flex-col items-center">
            {/* Encabezado superior con logo y título */}
            <Box className="mb-6 flex items-center gap-4">
                <Image
                    src="/image.png"
                    alt="Logo Claro"
                    width={48}
                    height={48}
                    className="object-contain"
                />
                <Typography variant="h4" className="text-[#E60000] font-extrabold drop-shadow-lg">
                    Centro de Operaciones y Aprovisionamiento
                </Typography>
            </Box>

            <Paper elevation={3} className="w-full max-w-md rounded-lg overflow-hidden">
                {/* Header del Chat con fondo Claro */}
                <Box className="bg-[#E60000] p-4 flex items-center gap-2">
                    <Image
                        src="/image.png"
                        alt="Logo Claro"
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                    <Typography variant="h6" className="text-white font-semibold">
                        Chat Soporte
                    </Typography>
                </Box>

                {/* Área de mensajes */}
                <Box className="p-4 h-80 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
                        >
                            <Box
                                className={`inline-block px-4 py-2 rounded-lg ${msg.type === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                                    {msg.text}
                                </Typography>
                            </Box>
                        </motion.div>
                    ))}
                    {/* Elemento para el scroll automático */}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Área de sugerencias y entrada */}
                <Box className="p-4 border-t border-gray-300">
                    <Box className="mb-2 flex flex-wrap gap-2">
                        {intentsToShow.map((intent, idx) => (
                            <Button key={idx} variant="outlined" size="small" onClick={() => selectIntent(intent)}>
                                {intent.title}
                            </Button>
                        ))}
                        {filteredIntents.length > 4 && (
                            <Button variant="outlined" size="small" onClick={() => setModalOpen(true)}>
                                Ver más
                            </Button>
                        )}
                    </Box>
                    <Box className="flex">
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Escribe tu consulta en lenguaje natural..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            multiline
                            maxRows={4}
                        />

                        <IconButton color="primary" onClick={handleSend}>
                            <Send />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>

            {/* Modal para ver todos los intents */}
            <IntentsModal
                open={modalOpen}
                intents={filteredIntents}
                onSelect={(intent) => selectIntent(intent)}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default ChatWidget;
