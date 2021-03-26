const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const usuariosSchema =  new mongoose.Schema(
    {
        email: {
            type:String,
            required: true,
            unique:true,
        },
        nombre:{
            type:String,
            required: true
        },
        password: {
            type:String,
            required:true,
        },
        estado:{
            type: Boolean,
            default: true,
        },
        rol: {
            type:Number,
            default: 1
        }
    }
);

usuariosSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Usuario', usuariosSchema);