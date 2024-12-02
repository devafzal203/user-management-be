import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import passport from "./strategies/passport";
import { router as authRoutes } from "./routes/auth.route";
import { router as userRoutes } from "./routes/user.route";
import { apiKeyValidator } from "./middlewares/apiKeyValidator";
import { cronRouter } from "./routes/cron.route";
import { corsOptions } from "./utils/cors.options";
import { authenticateToken } from "./middlewares/authMiddleware";

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.send("Welcome to the API");
});

// Routes,
app.get("/", async (_req, res) => {
  res.send("We're up!");
});
app.use("/auth", authRoutes);
app.use("/user", apiKeyValidator, authenticateToken, userRoutes);

// Cron Jobs (e.g Expired refresh token clean)
app.use("/api/cron", cronRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
