"use client";
import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import { DeleteIcon, EditIcon } from 'lucide-react';

interface ChatIntent {
    id?: string;
    title: string;
    description: string;
    examples: string[];
    response: string;
}

const AdminTrainingPanel = () => {
    const [intents, setIntents] = useState<ChatIntent[]>([]);
    const [formIntent, setFormIntent] = useState<ChatIntent>({
        title: '',
        description: '',
        examples: [],
        response: '',
    });
    const [exampleInput, setExampleInput] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [bulkImportText, setBulkImportText] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState<number>(10);
    // Ref para el panel de edición
    const editPanelRef = useRef<HTMLDivElement>(null);

    const fetchIntents = async () => {
        const res = await fetch('/api/admin/training');
        const data = await res.json();
        setIntents(data.intents);
    };

    useEffect(() => {
        fetchIntents();
    }, []);

    const handleAddExample = () => {
        if (exampleInput.trim() !== '') {
            setFormIntent(prev => ({
                ...prev,
                examples: [...prev.examples, exampleInput.trim()],
            }));
            setExampleInput('');
        }
    };

    const handleDeleteExample = (index: number) => {
        setFormIntent(prev => ({
            ...prev,
            examples: prev.examples.filter((_, idx) => idx !== index),
        }));
    };

    const handleSaveIntent = async () => {
        if (editingId) {
            const res = await fetch(`/api/admin/training/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intent: formIntent }),
            });
            const data = await res.json();
            if (!data.error) {
                setFormIntent({ title: '', description: '', examples: [], response: '' });
                setEditingId(null);
                fetchIntents();
            }
        } else {
            const res = await fetch('/api/admin/training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intent: formIntent }),
            });
            const data = await res.json();
            if (data.id) {
                setFormIntent({ title: '', description: '', examples: [], response: '' });
                fetchIntents();
            }
        }
    };

    const handleEditIntent = (intent: ChatIntent) => {
        setEditingId(intent.id || null);
        setFormIntent(intent);
        // Hace scroll al panel de edición
        editPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormIntent({ title: '', description: '', examples: [], response: '' });
    };

    const handleDeleteIntent = async (id?: string) => {
        if (!id) return;
        const confirmDelete = window.confirm("¿Estás seguro de eliminar este intent?");
        if (!confirmDelete) return;
        const res = await fetch(`/api/admin/training/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!data.error) {
            fetchIntents();
            if (editingId === id) {
                handleCancelEdit();
            }
        }
    };

    const handleRetrain = async () => {
        const res = await fetch('/api/admin/retrain', { method: 'POST' });
        const data = await res.json();
        alert(data.message || 'Modelo reentrenado');
    };

    const handleBulkImport = async () => {
        try {
            const importedIntents = JSON.parse(bulkImportText);
            if (!Array.isArray(importedIntents)) {
                alert("El JSON debe ser un arreglo de intents.");
                return;
            }
            const res = await fetch('/api/admin/training/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intents: importedIntents }),
            });
            const data = await res.json();
            alert(data.message);
            setBulkImportText('');
            fetchIntents();
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error("Error desconocido");
            alert("Error al importar: " + err.message);
        }
    };


    const handleShowMore = () => {
        setVisibleCount(prev => Math.min(prev + 10, intents.length));
    };

    const handleShowLess = () => {
        setVisibleCount(10);
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Panel de Entrenamiento del Modelo
            </Typography>

            {/* Sección de Importación Masiva */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Importar Intents en Masa</Typography>
                <TextField
                    fullWidth
                    multiline
                    minRows={6}
                    label="Pega aquí el JSON de los intents"
                    value={bulkImportText}
                    onChange={(e) => setBulkImportText(e.target.value)}
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleBulkImport}>
                    Importar Intents
                </Button>
            </Paper>

            {/* Panel de Edición/Creación */}
            <Paper sx={{ p: 2, mb: 3 }} ref={editPanelRef}>
                <Typography variant="h6">
                    {editingId ? 'Editar Intent' : 'Agregar Nuevo Intent'}
                </Typography>
                <TextField
                    fullWidth
                    label="Título"
                    value={formIntent.title}
                    onChange={(e) => setFormIntent({ ...formIntent, title: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Descripción"
                    value={formIntent.description}
                    onChange={(e) => setFormIntent({ ...formIntent, description: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Respuesta"
                    value={formIntent.response}
                    onChange={(e) => setFormIntent({ ...formIntent, response: e.target.value })}
                    margin="normal"
                />
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        fullWidth
                        label="Ejemplo"
                        value={exampleInput}
                        onChange={(e) => setExampleInput(e.target.value)}
                    />
                    <Button onClick={handleAddExample} sx={{ ml: 1 }}>
                        Agregar Ejemplo
                    </Button>
                </Box>
                {formIntent.examples.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Ejemplos:</Typography>
                        <List>
                            {formIntent.examples.map((ex, idx) => (
                                <ListItem
                                    key={idx}
                                    sx={{
                                        backgroundColor: '#f0f0f0',
                                        mb: 1,
                                        borderRadius: 1,
                                        '& .MuiListItemSecondaryAction-root': { right: 8 },
                                    }}
                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => handleDeleteExample(idx)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={ex} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                <Box mt={2} display="flex" gap={2}>
                    <Button variant="contained" color="primary" onClick={handleSaveIntent}>
                        {editingId ? 'Actualizar Intent' : 'Guardar Intent'}
                    </Button>
                    {editingId && (
                        <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                            Cancelar
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* Lista de Intents Existentes */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Intents Existentes</Typography>
                <List>
                    {intents.slice(0, visibleCount).map((intent) => (
                        <ListItem
                            key={intent.id}
                            sx={{
                                backgroundColor: '#f0f0f0',
                                mb: 1,
                                borderRadius: 1,
                                '& .MuiListItemSecondaryAction-root': { right: 8 },
                            }}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="editar" onClick={() => handleEditIntent(intent)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="eliminar" onClick={() => handleDeleteIntent(intent.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText primary={intent.title} secondary={intent.description} />
                        </ListItem>
                    ))}
                </List>
                {intents.length > visibleCount && (
                    <Button onClick={handleShowMore}>Ver más</Button>
                )}
                {visibleCount > 10 && (
                    <Button onClick={handleShowLess}>Ver menos</Button>
                )}
            </Paper>

            <Button variant="contained" color="secondary" onClick={handleRetrain}>
                Reentrenar Modelo
            </Button>
        </Box>
    );
};

export default AdminTrainingPanel;
