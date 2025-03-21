// chatIntents.ts

export interface ChatIntent {
  id: string;
  title: string;
  description: string;
  examples: string[];
  response: string;
}

export const chatIntents: ChatIntent[] = [
  // 1) Verificación de órdenes de servicio
  {
    id: "verificacion_ordenes",
    title: "Verificación de órdenes de servicio",
    description: "Verificación completa de órdenes en Kunai y NetCracker",
    examples: [
      "¿Qué pasos debo seguir para validar una orden?",
      "¿Cómo verifico si una orden está lista para procesar?",
      "¿Qué hacer si encuentro discrepancias en una orden?",
      "Necesito confirmar una orden en Kunai, ¿qué debo revisar?",
      "¿Dónde veo el técnico asignado a una orden?",
      "La orden no aparece en NetCracker, ¿cómo proceder?",
      "¿Cómo validar los datos del cliente en una orden nueva?",
      "¿Qué significa el estado 'Iniciado' en Kunai?",
      "¿Cuál es el flujo de verificación de órdenes?",
      "¿Qué campos clave debo revisar en una orden de servicio?",
      "Como verifico una orden?",
    ],
    response: `
**Pasos para verificación:**
1. **En Kunai:** 
   - Verificar estado "Iniciado"
   - Confirmar técnico asignado
   - Validar datos del cliente

2. **En NetCracker:**
   - Buscar orden → Circuitos asociados → Órdenes Compuestas
   - Revisar instancias RFS/CFS
   - Validar parámetros clave (PONR=false)
   - Chequear consistencia entre circuitos y servicios

⚠️ **Si hay discrepancias:**
- Actualizar manualmente campos inconsistentes
- Notificar al supervisor si hay errores críticos
- No continuar hasta resolver inconsistencias
`
  },

  // 2) Cambio de facilidades GPON
  {
    id: "cambio_facilidades_gpon",
    title: "Cambio de facilidades GPON",
    description: "Actualización de terminales y puertos de fibra",
    examples: [
      "¿Cómo actualizo la terminal GPON en NetCracker?",
      "¿Cuál es el procedimiento para cambiar la facilidades de la fibra?",
      "El técnico solicita cambiar la terminal de fibra",
      "Pasos para reasignar una terminal GPON",
      "Como hago un cambio de facilidades GPON/fibra?",
    ],
    response: `
**Proceso paso a paso:**
1. Confirmar con el técnico:
   - Nueva cabina/terminal/posición
   - Estado físico del puerto y terminal

2. En NetCracker:
   - Abrir el circuito → Agregar nueva terminal
   - Seleccionar posición en la pestaña Traces luego de entrar a la terminal
   - Actualizar Physical Links (feeder y distribución)
   - Dentro de los parametros del circuito, actualizar instancias RFS activas
     
3. Validaciones:
\`\`\`
- Estado físico en NC vs campo
- Asignación de puertos
- Consistencia en Path Elements
\`\`\`

🛠 **Caso común:** Si el tecnico dice que intento el cambio en X posicion y esta se encuentra sin ningun cliente, liberar la asignación fantasma
`
  },

  // 3) Gestión de puertos y configuraciones
  {
    id: "gestion_puertos",
    title: "Configuracion De puertos",
    description: "Operaciones básicas en el Sistema de Puertos",
    examples: [
      "¿Cómo agrego un servicio de Internet en GPON?",
      "¿Qué significa Up/Down?",
      "¿Cómo interpreto la velocidad de un puerto?",
      "Como Configuro un puerto?"
    ],
    response: `
**Procedimientos clave:**
1. Agregar servicio:
   - Opciones: Solo Internet, Solo Video o Ambos
   - Velocidad según el plan contratado

2. Estados de puerto:
   - **Up:** Dispositivo conectado
   - **Down:** Puerto libre o apagado

⚠️ **Importante:** Siempre validar el ID de suscripción (Logical ID) y la velocidad del puerto
`
  },

  // 4) Cambio de puerto en circuito de cobre (omisión anterior)
  {
    id: "cambio_puerto_cobre",
    title: "Cambio de puerto en circuito de cobre",
    description: "Mover a un cliente de un puerto DSLAM a otro en un circuito de cobre",
    examples: [
      "¿Cómo cambio el puerto DSLAM en un circuito de cobre?",
      "El técnico solicita cambiar el puerto de la línea de cobre",
      "Pasos para reasignar un puerto ADSL"
    ],
    response: `
**Proceso paso a paso:**
1. **Identificar el puerto actual**  
   - Verifique en NetCracker el DSLAM asignado y el motivo del cambio (avería, actualización, etc.)

2. **Desasociar el puerto existente**  
   - Elimine la referencia al puerto en la columna de recursos
   - Si el nuevo puerto está en otro DSLAM, agregue el DSLAM correspondiente

3. **Asignar el nuevo puerto**  
   - Busque un puerto DSLAM libre
   - Asócielo al circuito y guarde

4. **Actualizar instancias RFS**  
   - En Access RFS y End Point RFS, edite el campo de puerto de acceso
   - Copie el link del puerto DSLAM desde el circuito y péguelo en la instancia

5. **Verificación final**  
   - Compruebe que el nuevo puerto esté correctamente configurado
   - Realice pruebas de sincronía o tono si aplica

⚠️ **Importante:** Documentar en la orden el cambio de puerto y notificar al técnico
`
  },

  // 5) Validación de discrepancia OLT vs Sistema de Puertos
  {
    id: "validacion_discrepancia_olt",
    title: "Validación OLT vs Sistema de Puertos",
    description: "Resolver diferencias entre NetCracker y OLT real",
    examples: [
      "¿Cómo verifico si el puerto OLT es correcto?",
      "¿Qué hacer si NC muestra un puerto diferente al real?",
      "¿Cuál es el procedimiento para validar la autenticación de la ONT?"
    ],
    response: `
**Flujo de validación:**
1. En NetCracker:
   - Circuito GPON → OLT Port → Physical Links
   - Comparar el puerto en Logical Inventory

2. En Sistema de Puertos:
   - Ejecutar: \`show gpon onu remote-info\`
   - Buscar la ONT por LGID/Subscription ID

3. Acciones:
   - Si hay discrepancia → Actualizar Physical Links
   - Si la ONT no autentica → Verificar configuración VLAN
   - Si los datos coinciden → Escalar a OSS GPON

🔍 **Checklist:** Dirección del terminal, Puerto OLT, Estado de autenticación
`
  },

  // 6) Reservación de circuitos PSTN/Datos
  {
    id: "reserva_circuitos_pstn",
    title: " Error Reservación de circuitos PSTN/Datos",
    description: "Proceso para reservar recursos en órdenes nuevas",
    examples: [
      "¿Cómo resuelvo un error en la reservación de circuito?",
      "¿Cuáles son los pasos para reintentar una reserva fallida?",
      "¿Dónde ingreso los datos de terminal y rango?"
    ],
    response: `
**Solución de errores de reserva:**
1. Verificar estado de la orden: Debe estar "Ingresando"
2. En el Flujo de Ejecución:
   - Revisar parámetros fallidos
   - Agregar en instancias CFS:
     - Terminal (formato CABINA-PAR)
     - Rango de servicio
3. Reintentar tarea:
   - Hacer clic en Retry después de las correcciones

🚨 **Caso típico:** Error 3457 = Falta de datos de terminal en B2C
`
  },

  // 7) Configuración de servicio VoIP
  {
    id: "configuracion_voip",
    title: "Configuración de servicio VoIP",
    description: "Solución de errores comunes en telefonía IP",
    examples: [
      "¿Cómo resuelvo un error de Plan/Provincia?",
      "¿Qué hacer si el número aparece ocupado?",
      "¿Cómo corregir un AP-ID incorrecto?"
    ],
    response: `
**Solución de errores:**
1. Error "Número ocupado":
   - Escalar a soporte de puertos
   - No reintentar sin autorización

2. Error "Plan/Provincia":
   - Verificar el AP-ID en OMS vs NC
   - Chequear la Province Key (Ej: 33=Santo Domingo)
   - Validar el tipo de conmutador (IMS/Broadsoft)

3. Configuración correcta:
\`\`\`
[Servicio VoIP]
AP-ID: #12345
Teléfono: 809-555-1212
Plataforma: IMS
Provincia: 33
\`\`\`
`
  },

  // 8) Solución de problemas de IPTV
  {
    id: "problemas_iptv",
    title: "Solución de problemas de IPTV",
    description: "Diagnóstico de errores en decodificadores",
    examples: [
      "¿Cómo resuelvo el error X5 en el STB?",
      "¿Qué significa el mensaje 'Cargando' en el decodificador?",
      "¿Cuál es el procedimiento para un error de GUID?"
    ],
    response: `
**Guía rápida de errores:**
- **X5/X13:** 
  1. Verificar la creación de streamers
  2. Reconfigurar el puerto completo
  3. Reiniciar el STB 3 veces

- **STB Cargando:**
  - Chequear soporte IPTV en el DSLAM
  - Validar el cableado Ethernet

- **Error GUID:**
\`\`\`
1. Buscar el GUID en IPTV Manager
2. Liberar la cuenta anterior
3. Reasignar al cliente actual
\`\`\`
`
  },
  

  // 9) Migración a cuenta fija (cambio_cuenta_fija)
  {
    id: "cambio_cuenta_fija",
    title: "Migración a cuenta fija",
    description: "Reconexión directa desde central",
    examples: [
      "¿Cómo elimino la cabina del circuito?",
      "¿Cuáles son los pasos para conectar directamente a la central?",
      "¿Qué se debe validar después de migrar a cuenta fija?"
    ],
    response: `
**Proceso completo:**
1. Eliminar elementos de cabina:
   - Feeder antiguo
   - Distribución interna

2. Configurar nueva ruta:
   - Seleccionar el par feeder de la central
   - Conectar directamente al par local

3. Pruebas obligatorias:
   - Sincronización del DSLAM
   - Prueba de tono PSTN
   - Validación en el sistema de puertos

📌 **Nota:** Actualizar ambos circuitos (voz y datos)
`
  },

  

  // 10) Cambio de puerto en circuito de fibra (omisión anterior)
  {
    id: "cambio_puerto_fibra",
    title: "Cambio de puerto en circuito de fibra",
    description: "Actualizar el puerto OLT en un circuito GPON cuando debe cambiarse",
    examples: [
      "¿Cómo actualizo el puerto en un circuito de fibra?",
      "El circuito GPON muestra un puerto OLT incorrecto",
      "Pasos para migrar de un puerto OLT a otro"
    ],
    response: `
**Proceso paso a paso:**
1. **Localizar el circuito GPON**  
   - Abra NetCracker y busque el OLT Port en la pestaña de Path Elements

2. **Eliminar el puerto antiguo**  
   - Desasocie el OLT Port y su Physical Link feeder
   - Guarde los cambios

3. **Agregar el nuevo puerto**  
   - Copie la referencia del puerto OLT correcto (por ej. gpon 0/4/6)
   - Asígnele el Physical Link feeder que corresponda

4. **Verificar coherencia**  
   - Asegúrese de que OLT Port y Physical Link tengan el mismo número
   - Guarde el circuito

5. **Confirmar en la OLT**  
   - Revise en el sistema de puertos que la ONT aparezca en el nuevo puerto
   - Corrija en NetCracker si persisten discrepancias

⚠️ **Nota:** Si hay instancias RFS con campos de puerto, actualícelas con el nuevo OLT Port
`
  },

  // 11) Cambio de par local (omisión anterior)
  {
    id: "cambio_par_local",
    title: "Cambio de par local",
    description: "Asignar un nuevo par de cobre desde la caja/terminal hasta el cliente",
    examples: [
      "¿Cómo cambio el par local en el circuito?",
      "El técnico indicó cambiar el par local",
      "Pasos para reasignar un par averiado"
    ],
    response: `
**Procedimiento:**
1. **Confirmar disponibilidad**  
   - El técnico elige un par local libre en la caja/terminal
   - Verifique en NetCracker que esté en estado Instalado/Disponible

2. **Quitar el par antiguo**  
   - En el circuito del cliente, elimine la referencia del par local anterior
   - Guarde para confirmar la eliminación

3. **Asignar el nuevo par**  
   - Copie la traza (Trace) del par local deseado
   - Péguela en la columna de recursos del circuito y guarde

4. **Conectores de inicio y fin**  
   - Abra la traza del par y copie los conectores Start/End
   - Péguelos en el circuito (arriba/abajo del par) y guarde

5. **Verificación final**  
   - Revise que el circuito muestre el nuevo par local correctamente
   - Si hay voz y datos, actualice ambos circuitos

⚠️ **Importante:** Documentar en la orden cuál par se liberó y cuál se asignó
`
  },

  // 12) Actualización de circuito xPON (omisión anterior)
  {
    id: "actualizacion_circuito_xpon",
    title: "Actualización de circuito xPON",
    description: "Sincronizar la información de un circuito de fibra con la realidad de la red",
    examples: [
      "¿Cómo actualizo un circuito xPON en NetCracker?",
      "Hay discrepancias en el circuito de fibra, ¿qué debo hacer?"
    ],
    response: `
**Proceso de actualización:**
1. **Detectar la discrepancia**  
   - Verifique si el Physical Link feeder y el OLT Port coinciden
   - Compare con el sistema de la OLT

2. **Corregir el feeder/OLT Port**  
   - Si el feeder está mal asignado, elimínelo y pegue el correcto
   - Si el OLT Port no coincide, reemplácelo con el nuevo

3. **Instancias de servicio**  
   - Revise si las instancias Access/End Point RFS necesitan actualizar el puerto
   - Guarde los cambios

4. **Validar en la OLT**  
   - Asegúrese de que la ONT aparezca en el puerto real
   - Corrija cualquier valor inexacto (splitter, dirección, etc.)

5. **Documentar y cerrar**  
   - Anote en la orden qué se corrigió (puerto, feeder, etc.)
   - Si todo coincide, la actualización de xPON está completa
`
  },

  // 13) Cambio de cabina (omisión anterior)
  {
    id: "cambio_cabina",
    title: "Cambio de cabina",
    description: "Mover a un cliente de una cabina de distribución a otra",
    examples: [
      "¿Cómo realizo un cambio de cabina para un cliente?",
      "El técnico requiere mover a un cliente de una cabina a otra",
      "Pasos para migrar de una cabina antigua a una nueva"
    ],
    response: `
**Procedimiento general:**
1. **Confirmar datos con el técnico**  
   - Nueva cabina destino, par feeder y par local
   - Verificar la cabina actual a retirar

2. **Eliminar cabina anterior**  
   - En el circuito, borre los elementos de la cabina vieja (feeder/cables)
   - Guarde para dejar el circuito listo

3. **Agregar nueva cabina**  
   - Añadir los Path Elements: feeder → cabina → distribución
   - Seleccionar la ruta feeder y el par local asignado

4. **Conectores**  
   - Copiar los conectores de inicio/fin en cada par
   - Guardar cambios en el circuito

5. **Verificación final**  
   - El circuito debe reflejar la nueva cabina y su par local
   - Si el cliente tiene voz/datos, actualizar ambos circuitos
   - Notificar al técnico que la migración se completó en el sistema
`
  }
];
