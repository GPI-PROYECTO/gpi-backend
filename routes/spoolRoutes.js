// Importamos Express para crear rutas.
const express = require("express");

// Creamos el router de Express.
// El router permite separar las rutas del archivo principal server.js.
const router = express.Router();

// Importamos el modelo que apunta a la colección master.
// Esta colección contiene los datos que vienen del Excel Master.
const SpoolMaster = require("../models/SpoolMaster");

// Función para limpiar el código recibido.
// Sirve por si el QR manda espacios, minúsculas o una URL.
function limpiarBusqueda(valor) {
  return valor
    .replace("https://", "")
    .replace("http://", "")
    .replaceAll("/", "")
    .trim()
    .toUpperCase();
}

// Ruta para buscar un spool en la colección master.
// Ejemplo:
// GET http://localhost:3000/api/master/R2527-6
router.get("/:valor", async (req, res) => {
  try {
    // Limpiamos el valor que viene desde la URL.
    const valorLimpio = limpiarBusqueda(req.params.valor);

    // Buscamos el spool en diferentes nombres de campos.
    // Esto se hace porque en MongoDB puede venir como:
    // cc, CC, codigoCorto, codigo_corto, spool o SPOOL.
    const spool = await SpoolMaster.findOne({
      $or: [
        { cc: valorLimpio },
        { CC: valorLimpio },
        { codigoCorto: valorLimpio },
        { codigo_corto: valorLimpio },
        { spool: valorLimpio },
        { SPOOL: valorLimpio },
      ],
    });

    // Si no encuentra el spool, respondemos con error 404.
    if (!spool) {
      return res.status(404).json({
        mensaje: "Spool no encontrado en la Master",
        busqueda: valorLimpio,
      });
    }

    // Solo regresamos los campos que necesita FotoMaster.
    // Aunque la Master tenga más columnas, aquí mandamos solo las necesarias.
    res.json({
      // Código corto del spool.
      codigoCorto:
        spool.cc || spool.CC || spool.codigoCorto || spool.codigo_corto,

      // Nombre del spool.
      spool: spool.spool || spool.SPOOL,

      // Color o sistema.
      colorSistema:
        spool.colorSistema || spool["COLOR/SISTEMA"] || spool.color_sistema,

      // PL del spool.
      pl: spool.pl || spool.PL,

      // Zona del spool.
      zona: spool.zona || spool.ZONA,

      // Área del spool.
      area: spool.area || spool["ÁREA"] || spool.AREA,

      // Peso del spool.
      pesoKg: spool.pesoKg || spool["PESO KG"] || spool.peso_kg,
    });
  } catch (error) {
    // Si ocurre un error en MongoDB o en el servidor, respondemos con error 500.
    res.status(500).json({
      mensaje: "Error al buscar el spool",
      error: error.message,
    });
  }
});

// Exportamos las rutas para usarlas en server.js.
module.exports = router;