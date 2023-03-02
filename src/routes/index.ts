import issuersRouter from "./issuersRouter";
import express from "express";

const routerApi = (app: express.Application) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/issuers', issuersRouter);
}

export default routerApi;