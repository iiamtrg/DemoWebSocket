import express from "express";
import chatRouter from "./chat.mjs";
import loginRouter from "./login.mjs";

const routers = {
    loginRouter,
    chatRouter
}
export default routers; 
