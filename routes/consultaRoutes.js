const express = require("express");
const router = express.Router();

// 1. Importamos TODOS los modelos
const EmbarquePlana = require("../models/EmbarquePlana");
const EmbarqueCaja = require("../models/EmbarqueCaja");
const RecepcionLP = require("../models/RecepcionLP");
const FotoMaster = require("../models/FotoMaster");

// 👇 NOTA: Si tu archivo está en minúscula, cambia "Spool" por "spool"
const Spool = require("../models/SpoolMaster");

// 2. Agregamos "/:coleccion" para que la ruta sea dinámica
router.get("/historial/:coleccion", async (req, res) => {
  try {
    const { coleccion } = req.params;
    let datos;
    
    // 3. Switch para buscar en la base de datos correcta según lo que pida React
    switch(coleccion) {
      case 'plana': 
        datos = await EmbarquePlana.find().sort({ createdAt: -1 }); 
        break;
      case 'caja': 
        datos = await EmbarqueCaja.find().sort({ createdAt: -1 }); 
        break;
      case 'lp': 
        datos = await RecepcionLP.find().sort({ createdAt: -1 }); 
        break;
      case 'fotomaster': 
        datos = await FotoMaster.find().sort({ createdAt: -1 }); 
        break;
      case 'master':
        datos = await Spool.find().sort({ codigoCorto: 1 }); // Ordenado alfabéticamente
        break;
        case 'master':
        // Ordenamos por 'cc' (Código Corto)
        datos = await Spool.find().sort({ cc: 1 }); 
        break;
      default: 
        return res.status(400).json({ mensaje: "Colección no válida" });
    }

    // Enviamos los datos encontrados a la oficina
    res.json(datos);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ mensaje: "Error al obtener historial", error: error.message });
  }
});

module.exports = router;