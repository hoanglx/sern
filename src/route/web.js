import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage );
    router.get('/goodbye', (req, res) => {
        return res.send('goodbye');
    });

    return app.use("/", router);
}

module.exports = initWebRoutes;