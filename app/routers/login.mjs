import express from "express";
import passport from "passport";

import { findUserLocalByUserName,createNewUserLocal,isUnauthenticated } from "../helper/index.mjs";

const router = express.Router();

router.get("/", isUnauthenticated, (req, res, next) => {
  res.render("login", (err, html) => {
    if (err) {
      next(err);
    }
    res.send(html);
  });
});

router.post("/", isUnauthenticated, async (req, res, next) => {
  const username = req.body.username
  if (!username) {
    res.status(422).send("User name is required")
  }
  const user = await findUserLocalByUserName(username)
  if (user) {
    req.session.user = user._id
    req.session.save()
    res.redirect('/chat')
  } else {
    const forwarded = req.headers['x-forwarded-for']
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    let data = {}
    data.username = username
    data.ip = ip
    let u = createNewUserLocal(data)
    u.then((data) => {
      console.log(data)
      req.session.user = data._id
      req.session.save()
      res.redirect("/chat")
    }).catch(err => {
      console.log(err)
      next(err)
    })
  }
});

export default router;
