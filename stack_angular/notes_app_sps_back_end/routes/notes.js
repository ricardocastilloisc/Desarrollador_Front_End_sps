const express = require("express");
const ruta = express.Router();
const Joi = require("@hapi/joi");
const Nota = require("../models/notas_model");
const verificarToken = require("../middlewares/auth");

const schema = Joi.object({
  titulo: Joi.string().min(3).max(30).required(),
});

ruta.post("/", verificarToken, (req, res) => {
  let body = req.body;
  const { error, value } = schema.validate({
    titulo: body.titulo,
  });
  if (!error) {
    let resultado = crearNota(req);
    resultado
      .then((nota) => {
        res.json({
          valor: nota,
        });
      })
      .catch((err) => {
        res.status(400).json({
          errorHttp: err,
        });
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

crearNota = async (req) => {
  let nota = new Nota({
    titulo: req.body.titulo,
    autor: req.usuario.rol === 1 ? req.body.autor_id : req.usuario._id,
    descripcion: req.body.descripcion,
    NoteDate: req.body.hasOwnProperty("date") ? req.body.date : Date.now(),
  });
  return await nota.save();
};

module.exports = ruta;
