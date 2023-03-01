import usersRouter from "./usersRouter";
import express from "express";

const routerApi = (app: express.Application) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', usersRouter);
}

export default routerApi;