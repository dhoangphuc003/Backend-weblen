const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const compression = require("compression");
dotenv.config()

const app = express()
const port = process.env.PORT || 3001
app.use(cors({
    credentials: true 
}));
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(bodyParser.json())
app.use(cookieParser())
routes(app);
app.use(compression({
    threshold: 10240, 
    level: 6 
}));
mongoose.connect(`${process.env.MONGODB}`)
.then(()=>{
    console.debug("Connect success!!")
})
.catch((err)=>{
    console.debug(err)
})

app.listen(port, () => {
    console. log(`Server is running in port: http://localhost:${port}/`)
})


