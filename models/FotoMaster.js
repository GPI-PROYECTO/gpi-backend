// Importamos Mongoose para crear el modelo de MongoDB.
const mongoose = require("mongoose");

// Este esquema define cómo se guardará cada registro en la colección FotoMaster.
// Aquí guardamos solo la información que quieres ver en FotoMaster.
const FotoMasterSchema = new mongoose.Schema(
  {
    // Código corto del spool, ejemplo: R2527-6.
    codigoCorto: {
      type: String,
      required: true,
    },

    // Nombre del spool.
    spool: {
      type: String,
      required: true,
    },

    // Color o sistema del spool.
    color: {
      type: String,
      required: true,
    },

    // Ruta de la foto de etiqueta guardada en la carpeta uploads.
    fotoEtiqueta: {
      type: String,
      required: true,
    },

    // Ruta de la foto de figura completa guardada en la carpeta uploads.
    fotoFigura: {
      type: String,
      required: true,
    },

    // PL del spool, viene desde la Master.
    pl: {
      type: String,
      required: true,
    },

    // Área del spool.
    area: {
      type: String,
      required: true,
    },

    // Peso del spool.
    peso: {
      type: Number,
      required: true,
    },

    // Fecha en la que se registró la evidencia.
    fecha: {
      type: String,
      required: true,
    },

    // Persona que escaneó o registró el spool.
    scan: {
      type: String,
      required: true,
    },
 // Al final de tu esquema en backend/models/FotoMaster.js
  },
  {
    timestamps: true,
    collection: "fotomaster", // <-- ESTO ES LO IMPORTANTE
  }
);

module.exports = mongoose.model("FotoMaster", FotoMasterSchema);