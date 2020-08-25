import express from "express";
import logger from "morgan";
import path from "path";
import chatApp from "./app/index.mjs";
import routers from "./app/routers/index.mjs"
import bodyParser from "body-parser";

const app = express();


app.set('__dirname', path.resolve());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(app.get('__dirname'), 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(express.static(path.join(app.get('__dirname'), 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(chatApp.session);

//router
app.get('/', (req, res, next) => {
    res.redirect('/login');
});
app.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
})

app.use('/login', chatApp.routers.loginRouter);
app.use('/chat', chatApp.routers.chatRouter);


//error handler
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('Internal Server Error');
});
chatApp.IoServer(app).listen(app.get('port'), () => {
    console.log(`ChatApp listenning on ${app.get('port')}!`);
})
