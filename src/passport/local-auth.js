const passport = require('passport');
const LocalStrategy =require('passport-local').Strategy;

//aqui tomamos el archivo user de base datos
//que ya viene con la password encryptada o cifrada
const User = require('../models/user');


//aqui serializamos los datos para que la pagina
//no pida el logeo a cada motento -> seria una session o guardarlo en un archivo
//cada vez que un usuario navege en diferentes paginas
passport.serializeUser((user,done)=>{
   //serializar o almacenar no un error si no que del usuario su ID
   done(null,user.id);
});

//ahora hacemos el caso inverso que es deserializar
passport.deserializeUser(async (id,done)=>{
  const user = await User.findById(id);
   //terminamos sin ningun erreror y con un usuario
   done(null,user)
});


passport.use('local-registro', new LocalStrategy({
   usernameField: 'email',
   passwordField: 'password',
   passReqToCallback: true
 }, async (req, email, password, done) => {
   const user = await User.findOne({'email': email})
   console.log(user)
   if(user) {
     return done(null, false, req.flash('usuarioexiste', 'El email ya se encuentra registrado'));
   } else {
     const newUser = new User();
     newUser.email = email;
     newUser.password = newUser.encriptarPassword(password);
   console.log(newUser)
     await newUser.save();
     done(null, newUser);
   }
 }));
 
 passport.use('local-login', new LocalStrategy({
   usernameField: 'email',
   passwordField: 'password',
   passReqToCallback: true
 }, async (req, email, password, done) => {
   const user = await User.findOne({email: email});
   if(!user) {
     return done(null, false, req.flash('logeomensaje', 'Usuario no encontrado'));
   }
   if(!user.CompararEmail(password)) {
     return done(null, false, req.flash('logeomensaje', 'Contraseña incorrecta'));
   }
   return done(null, user);
 }));












/* //funcion define que vamos hacer cuando tengos los datos del cliente
//como se va llamar el metodo de autentificacion, nueva strategia,// objeto de configuracion,          //collback de ejecucion
                                                                  //que datos recibimos del cliente,   //que vamos hacer con estos datos                       

//passReqToCallback:true quiere decir que puedes obtener mas datos aparte del email y password
//done le devuelve una respuesta al cliente
//aqui recibimos los dos campos con sus datos mediante router local-registro
passport.use('local-registro',new localStrategy({
   usernameField:'email',
   passwordField:'password',
   passReqToCallback:true
},async (req,email,password,done) => {
   //buscamos al usuario en la base de datos si lo encuentra! le retornamos un mensaje
  const CorreoDeUsuario = User.findById({email:email})

         if(CorreoDeUsuario){
               return done(null,false,req.flash('usuarioexiste','El email ya existe'));
         }else{   
               //aqui tomamos los datos
               //que vienen desde el archivo user y constante const User = require('../models/user'); 
               const usera = new User();
               usera.email = email,
               //aqui igual a password le pasamos el siguiente metodo del archivo user carpeta models
               usera.password = usera.encriptarPassword(password);
               await usera.save();
               //devolvemos un error de tipo null y un usuario
               done(null,usera);
         }

}));

/* 
//ahora creamos el siguiente metodo de validacion pero para el registro
passport.use('local-login', new localStrategy({
   usernameField:'email',
   passwordField:'password',
   passReqToCallback:true
}, async (req,email,password,done) => {
       
      const user = User.findOne({email:email});
      
      if(!user){
         //significa que no devuelve ni un error ni un usuario pero si entrega el mensaje 
            return done(null,false,req.flash('usuarioexiste','Usuario no se ha encontrado'))
       }

       if(!user.CompararEmail(password)){
         return done(null,false,req.flash('usuarioexiste','contraseña invalida'))
       }

       //en el caso que si sea correcta le devolvemos un null y un usuario
       //es un metodo determinante dentro de otra funcion
       done(null,user)
})); */ 