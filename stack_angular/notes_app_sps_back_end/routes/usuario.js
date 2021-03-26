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

ruta.get("/", verificarToken, (req, res) => {
  if(req.usuario.rol == 2)
  {
    return res.status(401).json({ error: 'Consulta No autizado' });
  }
  const limit  = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  let resultado = listarusuariosActivos(limit, page);
  resultado
    .then((usuarios) => {
      res.json(usuarios);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});
ruta.get("/all", verificarToken, (req, res) => {
  if(req.usuario.rol == 2)
  {
    return res.status(401).json({ error: 'Consulta No autizado' });
  }


  let resultado = listarusuariosActivosAll();
  resultado
    .then((usuarios) => {
      res.json(usuarios);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});


ruta.put("/:id", verificarToken, (req, res) => {
  const { error, value } = schema.validate({ nombre: req.body.nombre });
  if (!error) {

    let resultado = actulizarUsuario(req.params.id, req.body);
    
    resultado
      .then((valor) => {
        res.json({
          email: valor.email,
          nombre: valor.nombre,
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

actulizarUsuario = async (_id, body) => {
  let tempBody = {}
  if(body.hasOwnProperty("password")){
    tempBody = {
      nombre: body.nombre,
      password: bcrypt.hashSync(body.password, 10),
    }
  }else{
    tempBody = {
      nombre: body.nombre
    }
  }
  let usuario = await Usuario.findOneAndUpdate(
    { _id: _id },
    {
      $set: tempBody
    },
    {
      new: true,
    }
  );
  return usuario;
};

ruta.delete("/:id",  verificarToken,(req, res) => {
  let resultado = desactivarUsuario(req.params.id);
  resultado
    .then((valor) => {
      res.json({
        email: valor.email,
        nombre: valor.nombre,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.put("/activar/:id",  verificarToken,(req, res) => {
  let resultado = activarUsuario(req.params.id);
  resultado
    .then((valor) => {
      res.json({
        email: valor.email,
        nombre: valor.nombre,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
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


listarusuariosActivos = async (limit, page) => {
  let usuarios = await Usuario.paginate( {estado:true},{select: 'nombre email',limit, page})
  return usuarios;
};

listarusuariosActivosAll = async (limit, page) => {
  let usuarios = await Usuario.find({ estado: true }).select({
    nombre: 1,
    email: 1,
  });
  return usuarios;
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

activarUsuario = async (_id) => {
  let usuario = await Usuario.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        estado: true,
      },
    },
    {
      new: true,
    }
  );
  return usuario;
};

module.exports = ruta;
