"use client";
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { ChatIntent } from '../store/chatIntents';

interface IntentsModalProps {
    open: boolean;
    intents: ChatIntent[];
    onSelect: (intent: ChatIntent) => void;
    onClose: () => void;
}

const IntentsModal: React.FC<IntentsModalProps> = ({ open, intents, onSelect, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Seleccione una opción</DialogTitle>
            <DialogContent dividers>
                <Box className="flex flex-wrap gap-2">
                    {intents.map((intent, idx) => (
                        <Button
                            key={idx}
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                onSelect(intent);
                                onClose();
                            }}
                        >
                            {intent.title}
                        </Button>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default IntentsModal;
