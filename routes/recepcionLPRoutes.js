const express = require("express");
const router = express.Router();
const RecepcionLP = require("../models/RecepcionLP");

// --- GET: OBTENER TODOS LOS SPOOLS (Para la tabla de la oficina) ---
router.get("/", async (req, res) => {
  try {
    // Busca todos los registros y los ordena por el más reciente
    const registros = await RecepcionLP.find().sort({ createdAt: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- POST: REGISTRAR DESDE LA TABLET ---
router.post("/registrar", async (req, res) => {
  try {
    const { docRef, fechaRecibo, spools } = req.body;

    // Transformamos el arreglo de la tablet para que CADA SPOOL sea una fila independiente
    const registrosIndividuales = spools.map(spool => ({
      proyecto: spool.proyecto || "DEACERO",
      docRef: docRef,
      fechaRecibo: fechaRecibo,
      codigoCorto: spool.codigoCorto,
      spool: spool.spool,
      diametro: spool.diametro || "N/A",
      color: spool.color || "S/C",
      noEbr: "RECIBIDO/PE",
      fecha: fechaRecibo, // Replicamos la fecha de recibo para la columna FECHA
      pesoKg: Number(spool.peso), // Transformamos el peso a número
      area: spool.area || "N/A",
      observacion: "",
      estatus: "0",
      zona: spool.zona || "N/A"
    }));

    // Guarda todas las filas en MongoDB de un solo golpe
    await RecepcionLP.insertMany(registrosIndividuales);

    res.status(201).json({ mensaje: "Spools guardados individualmente con éxito." });
  } catch (error) {
    console.error("Error al guardar Recepción LP:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;