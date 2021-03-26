const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const ruta = express.Router();

const verificarToken = require("../middlewares/auth");

const Joi = require("@hapi/joi");

const Usuario = require("../models/usuario_model");

const schema = Joi.object({
  nombre: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

ruta.post("/", (req, res) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ error: "server error" });
    }

    if (user) {
      return res.status(400).json({ msj: "El usuario ya existe" });
    }
  });
  const { error, value } = schema.validate({
    nombre: body.nombre,
    email: body.email,
  });
  if (!error) {
    let resultado = crearUsuario(body);
    resultado
      .then((user) => {
        res.json({
          email: user.email,
          nombre: user.nombre,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

crearUsuario = async (body) => {
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: bcrypt.hashSync(body.password, 10),
    rol: body.hasOwnProperty("rol") ? body.rol : 2,
  });
  return await usuario.save();
};

desactivarUsuario = async (_id) => {
  let usuario = await Usuario.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        estado: false,
      },
    },
    {
      new: true,
    }
  );
  return usuario;
};

module.exports = ruta;
