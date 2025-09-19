const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const swaggerDocs = require("./docs/swagger");

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/contacts", contactRoutes);

// Swagger
swaggerDocs(app);

app.get("/", (req, res) => {
  res.json({ message: "API MyContacts is running 🚀" });
});

module.exports = app;
