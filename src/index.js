
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { json } from 'express';


dotenv.config()

const app = express();
app.use(json());
app.use(cors());



app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server on port ${process.env.PORT}`)
});