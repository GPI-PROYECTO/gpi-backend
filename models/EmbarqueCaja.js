const mongoose = require("mongoose");

const EmbarqueCajaSchema = new mongoose.Schema(
  {
    folioEmbarque: {
      type: String,
      required: true,
      unique: true,
    },
    fechaEmbarque: {
      type: String,
      required: true,
    },
    scan: {
      type: String,
      required: true,
    },
    tipoEmbarque: {
      type: String,
      default: "CAJA",
    },
    totalPiezas: {
      type: Number,
      required: true,
    },
    pesoTotal: {
      type: Number,
      required: true,
    },
    observaciones: {
      type: String,
      default: "",
    },
    spools: [
      {
        codigoCorto: String,
        spool: String,
        area: String,
        peso: Number,
        color: String,
        foto: String, 
      },
    ],
  },
  {
    timestamps: true,
    collection: "embarqueCaja", // Nueva colección en MongoDB
  }
);

module.exports = mongoose.model("EmbarqueCaja", EmbarqueCajaSchema);