const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const notasSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
  descripcion: {
    type: String,
    required: false,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  NoteDate: {
    type: Date,
    default: Date.now(),
  },
});
notasSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Nota", notasSchema);
