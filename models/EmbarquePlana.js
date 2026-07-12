const mongoose = require("mongoose");

const EmbarquePlanaSchema = new mongoose.Schema(
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
      default: "PLANA",
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
        foto: String, // Cada tubo ahora guarda su propia foto individual aquí
      },
    ],
  },
  {
    timestamps: true,
    collection: "embarquePlana",
  }
);

module.exports = mongoose.model("EmbarquePlana", EmbarquePlanaSchema);