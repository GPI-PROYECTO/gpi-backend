// Importamos Mongoose para crear el modelo de MongoDB
const mongoose = require("mongoose");

// Creamos un esquema flexible.
// strict:false permite leer documentos aunque tengan campos como:
// CC, SPOOL, COLOR/SISTEMA, PESO KG, ÁREA, etc.
const SpoolMasterSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "master",
  }
);

// Exportamos el modelo.
// Este modelo trabajará directamente con la colección "master".
module.exports = mongoose.model("SpoolMaster", SpoolMasterSchema);