import express from "express";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhook";

const app = express();

app.use(bodyParser.json());
app.use("/webhook", webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
