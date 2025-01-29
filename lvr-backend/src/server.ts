import express from "express";
import cors from "cors";
import lvrRouter from "./routes/v1/lvrRouter";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use("/api/v1", lvrRouter);
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
