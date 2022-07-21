
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { json } from 'express';
import routes from '../src/routes.js'


dotenv.config()

const app = express();
app.use(json());
app.use(cors());

app.use(routes)

app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server on port ${process.env.PORT}`)
});