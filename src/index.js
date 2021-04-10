const express = require('express');
const engine = require('ejs-mate');
//unir directorios o busqueda de directorios para establecer
const path = require('path');
//podemos ver gracias a morgan que es un modulo
//nos ayudara a ver las peticiones
const morgan = require('morgan');


//pedimos passport por que hay inicializarlo
const passport = require('passport');

//tambien llamamos a el modulo de session
const session = require('express-session');

//conecct flash hay que usarlo es un middleware
const flash = require('connect-flash');

//el servidor o donde inicializamos nuestro servidor
const app = express();
require('./database');
require('./passport/local-auth');

//configuraciones
//establecer la carpeta de vista para que lea o busquees las vista junto con el modulo path para unir directorios
//y que sea multiplataforma __dirname es una constante
app.set('views',path.join(__dirname, 'views'));
//utilizamos el motor de plantillas
app.engine('ejs',engine);
//ahora utilizamos la plantillas ejs
//o le damos el motor que se ha creado lo establezemos o le damos el motor creado
app.set('view engine','ejs');
app.set('port', process.env.PORT||3000);

//middlewares
//son funciones antes de las rutas 
app.use(morgan('dev'));
//para recibir de parte del cliente los datos que esta enviando ya que nosotros o este archivo es el servidor
app.use(express.urlencoded({urlencoded:false}));
//antes de inicializar passport se crea el metodo session que se configura de la siguiente forma
app.use(session({
 secret:'mysecretssesion',
 resave:false,
 saveUninitialized:false
}));
app.use(flash());
//inicializamos la session de passport
app.use(passport.initialize());
app.use(passport.session());
//aqui usuamos los mensajes que utilizaremos en diferentes paginas
app.use((req,res,next) => {
    //almacenamos el mensaje en toda la aplicacion
    app.locals.usuarioExiste =  req.flash('usuarioexiste');
    app.locals.logeoexite = req.flash('logeomensaje');
    //ahora tengo que tener mi usuario logeado para o obtener el usuario
    //para usarlo y navegar correctamente 
    app.locals.usua = req.user;
    //next continua con las demas rutas utilizando los mensajes
    next();
});

//Routes -> rutas 
//utilizamos los modulo y aqui ya implementamos todas rutas que sera manejadas
app.use('/',require('./routes/index'));


//iniciamos el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor Corriendo en Port',app.get('port'));
})