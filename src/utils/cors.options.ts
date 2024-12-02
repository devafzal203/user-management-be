const whitelist = [
  "http://localhost:5173",
  "https://frontend-spark-cloud-assignment.vercel.app",
  process.env.FRONTEND_URL,
];

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};
