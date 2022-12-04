//imports
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import ApiRouter from './routes/api/api.routes';
//consts for express
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
//middleware
app.use(cors({origin: '*'}));
app.use(express.static(__dirname+'../public'));
app.use(express.json());
app.use('/api', ApiRouter);
// main route
/*app.get('/*', (req, res) => {
    res.sendFile('public/index.html', {root: __dirname+'../public'});
});*/
//start server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});