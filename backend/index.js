const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoute = require("./Routes/AuthRoute");
const powerUpdateRoutes = require("./Routes/powerUpdateRoutes");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error(err));

app.use(cors({
  origin: ["http://localhost:3000", "https://loadshedding-1.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/api/updates", powerUpdateRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

