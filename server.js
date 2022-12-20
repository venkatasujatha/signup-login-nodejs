const { dataSource } = require('./database');
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const router = require('./router/router');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

async function run() {
    try {
        await dataSource.initialize();
        console.log('Datasource is intialized');
        app.use('/', router);
        app.listen(process.env.PORT, () => {
        console.log(`Server is running at ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error.message);
    }
}
run();