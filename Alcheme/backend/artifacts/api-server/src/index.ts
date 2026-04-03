import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./api/index.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./utils/errorHandler.js";

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

const app: Express = express();

// ─── Human-readable request logger ─────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const { method, url } = req;

  // Log request
  const timestamp = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  console.log(`\n📥 [${timestamp}] ${method} ${url}`);
  if (method !== "GET" && req.body && Object.keys(req.body).length > 0) {
    console.log(`   📦 Body: ${JSON.stringify(req.body).slice(0, 200)}`);
  }

  // Log response
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? "❌" : res.statusCode >= 300 ? "🔄" : "✅";
    console.log(`   ${statusColor} ${res.statusCode}  (${duration}ms)`);
    return originalEnd.apply(this, args);
  };

  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(errorHandler);

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, `Server listening on http://localhost:${port}`);
  console.log(`\n🚀 Server running at http://localhost:${port}\n`);
});
