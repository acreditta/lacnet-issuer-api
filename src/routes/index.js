import issuersRouter from "./issuersRouter.js";
import vcRouter from "./vcRouter.js";
import didRouter from "./didRouter.js";
import express from "express";
import config from "../config/index.js";
import fetch from "node-fetch";

const routerApi = (app) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/issuers', issuersRouter);
    router.use('/vc', vcRouter);
    router.use('/did', didRouter);
    app.get('/healthy', (req, res) => {
        res.status(200).json({
            message: 'Healthy'
        });
    });
    app.get('/healthy/ssiapi', (req, res) => {
        fetch(`${config.ssiApiUrl}/healthy`).then((response) => {
            if (response.status === 200) {
                res.status(200).json({
                    message: 'Healthy'
                });
            } else {
                res.status(500).json({
                    message: 'Unhealthy'
                });
            }
        }).catch((err) => {
            res.status(500).json({
                message: 'Unhealthy'
            });
        }
        );
    });
            
}

export default routerApi;