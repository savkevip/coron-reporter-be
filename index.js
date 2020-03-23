require("dotenv").config();
// const Sentry = require("@sentry/node");
const cors = require("cors");
const mongoose = require("mongoose");
const user = require("./routes/user");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", user);
app.use("/api/auth", auth);

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log(`Could not connect to MongoDB... ${err}`));

if (process.env.NODE_ENV === "production") {
    // Sentry.init({
    //     dsn: process.env.SENTRY_DSN
    // });
}

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
