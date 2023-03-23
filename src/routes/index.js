import issuersRouter from "./issuersRouter.js";
import vcRouter from "./vcRouter.js";
import express from "express";

const routerApi = (app) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/issuers', issuersRouter);
    router.use('/vc', vcRouter);
    app.get('/healthy', (req, res) => {
        res.status(200).json({
            message: 'Healthy'
        });
    });
}

export default routerApi;