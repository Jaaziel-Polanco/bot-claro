"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Box, TextField, IconButton, Typography, Button } from '@mui/material';
import { Send } from 'lucide-react';
import Image from 'next/image';
import { useChatStore } from '../store/useChatStore';
import IntentsModal from './IntentsModal';

const ChatWidget: React.FC = () => {
    const { messages, addMessage, selectIntent, getFilteredIntents, handleUserQuery } = useChatStore();
    const [input, setInput] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length === 0) {
            addMessage({ type: 'bot', text: "¡Bienvenido al Chat de Soporte! ¿En qué puedo ayudarte hoy?" });
        }
    }, [messages, addMessage]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const filteredIntents = getFilteredIntents(input);
    const intentsToShow = filteredIntents.slice(0, 4);

    const handleSend = async () => {
        if (input.trim() === '') return;
        await handleUserQuery(input); // Usamos la función del store que maneja el reemplazo
        setInput('');
    };

    // Animaciones
    const titleVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20
            }
        }
    };

    const messageVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        user: { opacity: 0, x: 20 }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Título animado con gradiente */}
            <motion.div
                initial="initial"
                animate="animate"
                variants={titleVariants}
                className="mb-6"
            >
                <Box className="flex items-center gap-4">
                    <motion.div
                        whileHover={{
                            scale: 1.1,
                            rotate: [0, -5, 5, -5, 5, -5, 5, 0]
                        }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src="/image.png"
                            alt="Logo Claro"
                            width={94}
                            height={94}
                            className="object-contain"
                        />
                    </motion.div>
                    <div className="bg-gradient-to-r from-[#E60000] to-[#FF6B6B] bg-clip-text text-transparent">
                        <Typography
                            variant="h4"
                            className="font-bold text-3xl mt-1"
                        >
                            Centro de Operaciones
                            y Aprovisionamiento
                        </Typography>
                    </div>
                </Box>
            </motion.div>

            <Paper
                elevation={3}
                component={motion.div}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl"
            >
                {/* Header del Chat con animación de hover */}
                <motion.div whileHover={{ scale: 1.02 }}>
                    <Box className="bg-gradient-to-r from-[#E60000] to-[#FF6B6B] p-4 flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="/image.png"
                                alt="Logo Claro"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </motion.div>
                        <Typography variant="h6" className="text-white font-bold text-lg">
                            Asistente Virtual de Soporte
                        </Typography>
                    </Box>
                </motion.div>

                {/* Área de mensajes con animación escalonada */}
                <Box className="p-4 h-80 overflow-y-auto bg-gray-50">
                    <AnimatePresence>
                        {messages.map((msg, index) => {
                            const isProcessing = msg.text === "Procesando..." && index === messages.length - 1;

                            return (
                                <motion.div
                                    key={index}
                                    initial={msg.type === 'user' ? "user" : "hidden"}
                                    animate="visible"
                                    exit={{ opacity: 0 }}
                                    variants={messageVariants}
                                    transition={{ duration: 0.3 }}
                                    className={`mb-3 ${msg.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`max-w-[85%] px-4 py-2 rounded-2xl ${msg.type === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white'
                                            : 'bg-white shadow-md'
                                            }`}
                                    >
                                        {/* Solo muestra animación si es el último mensaje y está procesando */}
                                        {isProcessing ? (
                                            <motion.div
                                                className="flex space-x-1"
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <div className="w-2 h-2 bg-current rounded-full" />
                                                <div className="w-2 h-2 bg-current rounded-full" />
                                                <div className="w-2 h-2 bg-current rounded-full" />
                                            </motion.div>
                                        ) : (
                                            <Typography variant="body1" className="leading-relaxed">
                                                {msg.text}
                                            </Typography>
                                        )}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </Box>

                {/* Área de interacción con animaciones */}
                <Box className="p-4 border-t border-gray-200 bg-white">
                    <motion.div layout className="mb-2 flex flex-wrap gap-2">
                        {intentsToShow.map((intent, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => selectIntent(intent)}
                                    className="rounded-full"
                                >
                                    {intent.title}
                                </Button>
                            </motion.div>
                        ))}
                        {filteredIntents.length > 4 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setModalOpen(true)}
                                    className="text-blue-600"
                                >
                                    Ver más opciones →
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div layout className="flex items-center gap-2">
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Escribe tu consulta..."
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
                            className="rounded-2xl"
                        />

                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IconButton
                                color="primary"
                                onClick={handleSend}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                <Send size={20} />
                            </IconButton>
                        </motion.div>
                    </motion.div>
                </Box>
            </Paper>

            {/* Modal con animación */}
            <IntentsModal
                open={modalOpen}
                intents={filteredIntents}
                onSelect={(intent) => {
                    selectIntent(intent);
                    setModalOpen(false);
                }}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default ChatWidget;