import express from "express";
import { getAllRooms, isAuthenticated} from "../helper/index.mjs";
import util from 'util'

const router = express.Router();
router.get('/', isAuthenticated, async (req, res, next) => {
    try {
        const rooms = await getAllRooms();
        console.log(util.inspect(rooms, {showHidden: false, depth: null}))
        res.render('chat', {
            host: "http://localhost:3000",
            rooms: rooms
        }, (err, html) => {
            if (err) {
                next(err);
            }
            res.send(html);
        });
    } catch (err) {
        next(err);
    }

})

export default router;