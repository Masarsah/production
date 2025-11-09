import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

// --- Services ---
import { ChatGPTService } from "./ollama.js";
import { PDFProcessor } from "./utiles/pdf.js";
import webpush from "./utiles/webpush.js";
import { db, listener } from "./database/config.js";

// --- Routes ---
import usersRouter from "./routers/users.js";
import teachersRouter from "./routers/teachers.js";
import classesRouter from "./routers/classes.js";
import enrollmentsRouter from "./routers/enrollments.js";
import unitsRouter from "./routers/units.js";
import quizzesRouter from "./routers/quizzes.js";
import submissionsRouter from "./routers/submissions.js";
import chatRouter from "./routers/chat.js";
import pushRoutes from "./routers/pushRoutes.js"; // your push notification routes

// --- Express + HTTP + Socket.IO ---
const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(bodyParser.json());

// Mount all routers
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/teachers", teachersRouter);
app.use("/api/v1/enrollments", enrollmentsRouter);
app.use("/api/v1/classes", classesRouter);
app.use("/api/v1/units", unitsRouter);
app.use("/api/v1/quizzes", quizzesRouter);
app.use("/api/v1/submissions", submissionsRouter);

// Web Push endpoints
app.use("/", pushRoutes);

// --- Initialize services ---
const ollama = new ChatGPTService();
const pdfProcessor = new PDFProcessor();

// --- Real-time Postgres Listener (LISTEN/NOTIFY) ---
listener.connect()
  .then(obj => {
    console.log("📡 Connected to PostgreSQL LISTEN/NOTIFY channel");
    const cn = obj.client;
    cn.query("LISTEN new_event");

    cn.on("notification", async (data) => {
      const payload = data.payload;
      console.log("📢 DB Notification received:", payload);

      // Send to connected sockets
      io.emit("db_event", payload);

      // Send Web Push to subscribers
      try {
        const subs = await db.any("SELECT * FROM push_subscriptions");
        const pushPayload = JSON.stringify({ title: "New Event", body: payload });

        await Promise.all(subs.map(async (s) => {
          try {
            const sub = JSON.parse(s.subscription);
            await webpush.sendNotification(sub, pushPayload);
          } catch (err) {
            console.error("Push send error:", err.message);
          }
        }));
      } catch (err) {
        console.error("Error sending web push:", err);
      }
    });
  })
  .catch(err => console.error("LISTEN connection error:", err));

// --- Socket.IO Handlers ---
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);
  let pdfContext = "";

  // PDF upload
  socket.on("upload_pdf", async (pdfBuffer) => {
    try {
      pdfContext = await pdfProcessor.extractText(pdfBuffer);
      socket.emit("pdf_processed", { success: true });
    } catch {
      socket.emit("error", { message: "PDF processing failed" });
    }
  });

  // ChatGPT with PDF context
  socket.on("chat_message", async (message) => {
    try {
      const response = await ollama.ChatGPTService(message, pdfContext);
      socket.emit("ai_response", response);
    } catch {
      socket.emit("error", { message: "AI response failed" });
    }
  });

  // AI quiz evaluation
  socket.on("submit_answer", async (data) => {
    try {
      const evaluation = await ollama.evaluateAnswer(
        data.correctAnswer,
        data.userAnswer
      );
      socket.emit("answer_evaluation", evaluation);
    } catch {
      socket.emit("error", { message: "Answer evaluation failed" });
    }
  });

  // Simple chat
  socket.on("user-message", async (msg) => {
    try {
      const response = await ollama.ChatGPTService(msg);
      socket.emit("ai-response", response);
    } catch (err) {
      console.error("Chat error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error("❗ Internal error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  httpServer.close(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});
