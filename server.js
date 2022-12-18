require ('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {berry} = require('./twitch/berry')

const DEBUG = process.env.DEBUG_MODE;
// MIDDLEWARE
app.use( cors() )
app.use( express.json() )


app.use("/auth", require("./routes/authRoutes"));
app.use("/twitch", require("./routes/twitchRoutes"))
app.use("/music", require("./routes/musicRoutes"))

app.get('/', (req, res) => {
    res.send('<h1>Server is up and running</h1>')
})




berry()


const port = process.env.PORT || 3001;
app.listen(port, () => {
    DEBUG ? console.log('DEBUGGING IS ON!!!') : null
    console.log(`Server is running on port ${port}....`);
});


module.exports = app;