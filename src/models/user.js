//creamos el schema de nuestra base de datos
//o llamado como ORM
const mongoose = require('mongoose');
const {Schema} = mongoose;
//requerimos el bcrypt para que la contraseñá
//se cifrar la contraseña o el dato en si
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email:String,
    password:String,
});

//aqui siframos la contraseña de cierta forma
userSchema.methods.encriptarPassword = (password) => {
        //10 es la cantidad de veces que se cifrara la contraseña
      return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};

//comprar la contraseña o recibir la contraseña lo compare
//con lo que ya esta en la base de datos
userSchema.methods.CompararEmail = function (password){
     return bcrypt.compareSync(password,this.password);
};


//y todo esto se utilizara en la clase passport
//  o en el archivo local-auth.js
module.exports = mongoose.model('users',userSchema);