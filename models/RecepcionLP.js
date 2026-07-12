const mongoose = require("mongoose");

const recepcionLPSchema = new mongoose.Schema({
  proyecto: { type: String, default: "DEACERO" },
  docRef: String,
  fechaRecibo: String,
  codigoCorto: String,
  spool: String,
  diametro: String,
  color: String,
  noEbr: { type: String, default: "RECIBIDO/PE" },
  fecha: String,
  pesoKg: Number,
  area: String,
  observacion: { type: String, default: "" },
  estatus: { type: String, default: "0" },
  zona: String
}, { timestamps: true });

module.exports = mongoose.model("RecepcionLP", recepcionLPSchema);