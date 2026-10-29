require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const errorCatcher = require("./middleware/error.middleware");


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());



app.use(cors());
app.use(errorCatcher);  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});