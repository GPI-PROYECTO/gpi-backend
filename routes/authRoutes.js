const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // 1. Buscamos si el usuario existe en la base de datos
    const user = await Usuario.findOne({ usuario: usuario });

    // Si no existe, lo rebotamos
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // 2. Comparamos la contraseña en texto plano (como lo pediste)
    if (user.password !== password) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // 3. Si todo coincide, le damos la bienvenida y le enviamos sus datos
    res.status(200).json({
      mensaje: "Login exitoso",
      userData: {
        usuario: user.usuario,
        rol: user.rol
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor al intentar hacer login" });
  }
});

module.exports = router;