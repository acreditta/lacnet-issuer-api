import express from 'express';
import routerApi from './routes/index.js';
import { errorHandler, boomErrorHandler } from './middlewares/errorHandler.js';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/index.js';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = config.port;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(', ') || [];

app.use(express.json());
const corsOptions = {
  origin: allowedOrigins
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Api is running :)');
});

routerApi(app);

app.use(helmet());
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});