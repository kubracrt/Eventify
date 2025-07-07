import express from "express";
import dotenv from "dotenv";
import postgresClient from "./db.js";
import userRouter from "./routes/userRouter.js"; 
import eventRouter from "./routes/eventRouter.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", userRouter); 
app.use("/", eventRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ayakta ${PORT}`);

  postgresClient.connect((error) => {
    if (error) {
      console.error("PostgreSQL veritabanına bağlanılamadı:", error);
    } else {
      console.log("PostgreSQL veritabanına başarıyla bağlandı.");
    }
  });
});
