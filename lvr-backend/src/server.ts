import express from "express";
import cors from "cors";
import lvrRouter from "./routes/v1/lvrRouter";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use("/api/v1", lvrRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Loan to Value Calculator",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/v1/*.ts"], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(openapiSpecification));
app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ message: `Can't find the requested url: ${req.originalUrl}` });
  next();
});

app.listen(9000, (error) => {
  if (error) {
    console.error(error.message);
  }
  console.log("Server is running at port 9000");
});
