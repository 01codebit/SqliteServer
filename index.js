import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';

import { router as api } from './routes/api.mjs';

const port = 4000;
const DB_PATH = 'D:/W3/Proj/Unity/SogeiCarburanti_LocalData/Database/database.db';

/* Workaround for lack of __dirname in ES6 modules */
const __dirname = path.resolve();

/* APP */
const app = express();

/* ROUTES */
//app.use("/", index);
//app.use("/", test);
app.use("/", api);


app.get('/', (req, res) => {
    res.statusCode = 200;
    res.end("API Server")
})

/* START */
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})