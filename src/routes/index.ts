import issuersRouter from "./issuersRouter";
import vcRouter from "./vcRouter";
import express from "express";

const routerApi = (app: express.Application) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/issuers', issuersRouter);
    router.use('/vc', vcRouter);
}

export default routerApi;