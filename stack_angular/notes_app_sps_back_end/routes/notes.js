const express = require("express");
const ruta = express.Router();
const Joi = require("@hapi/joi");
const Nota = require("../models/notas_model");
const verificarToken = require("../middlewares/auth");

const schema = Joi.object({
  titulo: Joi.string().min(3).max(30).required(),
});

ruta.get("/", verificarToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  let resultado = listarNotasActivos(req, limit, page);
  resultado
    .then((Notas) => {
      res.json(Notas);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.get("/details/:id", verificarToken, (req, res) => {
  let resultado = detalleNota(req.params.id);
  resultado
    .then((Notas) => {
      res.json(Notas);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
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


ruta.put("/:id", verificarToken, (req, res) => {
    const { error, value } = schema.validate({ titulo: req.body.titulo });
    if (!error) {
      let resultado = actulizarNota(req.params.id, req);
      resultado
        .then((valor) => {
          res.json({
            valor: valor,
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

ruta.delete("/:id", verificarToken, (req, res) => {
  let resultado = desactivarNota(req.params.id);
  resultado
    .then((valor) => {
      res.json({
        Nota: valor,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});
ruta.put("/activar/:id", verificarToken, (req, res) => {
  let resultado = activarNota(req.params.id);
  resultado
    .then((valor) => {
      res.json({
        Nota: valor,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
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

listarNotasActivos = async (req, limit, page) => {
  tempBody = {};

  if (req.usuario.rol === 2) {
    tempBody = { estado: true, autor: req.usuario._id };
  } else {
    tempBody = { estado: true };
  }

  let notas = await Nota.paginate(tempBody, {
    limit,
    page,
    populate: { path: "autor", select: "nombre" },
  });
  return notas;
};


listarNotasActivos = async (req, limit, page) => {
  tempBody = {};

  if (req.usuario.rol === 2) {
    tempBody = { estado: true, autor: req.usuario._id };
  } else {
    tempBody = { estado: true };
  }

  let notas = await Nota.paginate(tempBody, {
    limit,
    page,
    populate: { path: "autor", select: "nombre" },
  });
  return notas;
};

detalleNota = async (id) => {
    Nota.findOne({ _id: id })
    let nota = await Nota.findOne({ _id: id })
    return nota;
};

desactivarNota = async (id) => {
  let nota = await Nota.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        estado: false,
      },
    },
    {
      new: true,
    }
  );
  return nota;
};
activarNota = async (id) => {
  let nota = await Nota.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        estado: true,
      },
    },
    {
      new: true,
    }
  );
  return nota;
};

module.exports = ruta;
