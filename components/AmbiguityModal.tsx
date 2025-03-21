// import { useChatStore } from '@/store/useChatStore';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

// export const AmbiguityModal = () => {
//     const { ambiguousIntents, showAmbiguityModal, resolveAmbiguity } = useChatStore();

//     return (
//         <Dialog open={showAmbiguityModal} onClose={() => resolveAmbiguity()}>
//             <DialogTitle>Selecciona la opción correcta</DialogTitle>
//             <DialogContent>
//                 {ambiguousIntents.map((intent) => (
//                     <Button
//                         key={intent.id}
//                         fullWidth
//                         variant="outlined"
//                         onClick={() => resolveAmbiguity(intent)}
//                         sx={{ mb: 1 }}
//                     >
//                         {intent.title}
//                     </Button>
//                 ))}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={() => resolveAmbiguity()}>
//                     Ninguna de estas
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };