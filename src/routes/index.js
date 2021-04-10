const express = require('express');
const router = express.Router();
//hay que requerir passport ya que sera utilizado 
//en las peticiones http en este caso un post
const passport = require('passport');

//primera pagina
router.get('/',(req,res,next) => {
    res.render('index');
})

//registro recibimos la pagina
router.get('/registro',(req,res,next) => {
         res.render('registro')
})

//registro enviamos datos desde la pagina // y utilizamos passport y su metodo creado en el archivo local-auth
router.post('/registro',passport.authenticate('local-registro',{
    //si todo marcha bien se redireccionara en 
    //lo deje en log out por un problema que iniciaba sesion pero estaba en registrado la pagina
    successRedirect:'/logout',
    //si marcha mall se va a redirigir denuevo a registro
    failureRedirect: '/registro',
    passReqToCallback:true
}));

//login recibimos los datos desde la pagina
router.get('/login',(req,res,next) => {
    res.render('login')
})


//ahora enviamos los datos desde el login y aplicamos las rutas dependiendo del resultado del logeo
router.post('/login',passport.authenticate('local-login',{
    //si todo marcha bien se redireccionara en 
    successRedirect:'/perfil',
    //si marcha mall se va a redirigir denuevo a registro
    failureRedirect: '/login',
    passReqToCallback:true
}));

//aqui creamos la ruta que nos ayudara a deslogearnos
router.get('/logout',(req,res,next) =>{
req.logout();
res.redirect('/');
});



//esta ruta es creada en el caso que el usuario se haya registrado correctamente
router.get('/registrado',(req,res,next) =>{
      res.render('registrado');
});



//aqui asignamos las rutas la cual el usuario tiene que moverse
//luego de logearse
router.use((req,res,next) =>{
   isAuthenticated(req,res,next);
   next();
});


//perfil tiene como ruta o parametro 
//la autentificacion
//esta ruta es creada en el caso que el usuario se haya registrado correctamente
router.get('/perfil',(req,res,next) =>{
    res.render('perfil');
});

router.get('/entradas',(req,res,next) =>{
    res.render('entradas');
});

// la siguiente linea de codigo muestra como puede ser mostrada la ruta si no esta logeada
/* router.get('/perfil',isAuthenticated,(req,res,next) =>{
    res.render('perfil');
});
 */
//con este metodo asignamos la session .. si no ha iniciado sesion no puede entrar al perfil y a otras rutas
function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
         return next();
    }

    res.redirect('/');
};

module.exports = router;