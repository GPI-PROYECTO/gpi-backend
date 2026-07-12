const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  usuario: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  rol: { 
    type: String, 
    required: true, 
    enum: ['operador', 'admin'] // 'operador' para tablet, 'admin' para oficina
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);