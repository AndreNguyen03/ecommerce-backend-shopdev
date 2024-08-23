import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import router from "./routes/index.js";
import db from "./dbs/init.mongodb.js";

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// init db
db.connectMongoDB();

// init routes
app.use("/", router);

// handle errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  console.log(error.stack);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

export default app;
