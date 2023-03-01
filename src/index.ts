import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routerApi from './routes';
import { errorHandler, boomErrorHandler } from './middlewares/errorHandler';
import helmet from 'helmet';
import cors from 'cors';
import config from './config';

const app: Express = express();
const port = config.port;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(', ') || [];

app.use(express.json());
const corsOptions = {
  origin: allowedOrigins
};
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Api is running :)');
});

routerApi(app);

app.use(helmet());
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});