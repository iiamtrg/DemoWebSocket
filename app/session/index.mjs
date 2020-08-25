import Session from "express-session";

var session = Session({
    secret: "catscanfly",
    resave: false,
    saveUninitialized: true
   
});
export default session;