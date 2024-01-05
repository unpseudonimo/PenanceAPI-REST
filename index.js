const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db');
const adminRoutes = require('./controllers/controllerAdmin');
const bookRoutes = require('./controllers/controllerHomework');
const userRoutes = require('./controllers/controllerUser');
const sliderRoutes = require('./controllers/controllerSlider');


const app = express();
dotenv.config();


app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/homework', bookRoutes);
app.use('/user', userRoutes);
app.use('/slider', sliderRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
