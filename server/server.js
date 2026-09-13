import express from 'express';
import cors from 'cors';
import connectDb from './config/db.js'
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';
import conversationRouter from './routes/conversation.route.js';
import documentRouter from './routes/document.route.js';
const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://nexusai.onrender.com"
].filter(Boolean);

app.use(cors({
    // Let phones on the same private Wi-Fi use the local frontend too.
    origin: (origin, callback) => {
        const isPrivateNetwork = /^http:\/\/(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)\d+\.\d+:5173$/.test(origin || "");
        callback(null, !origin || allowedOrigins.includes(origin) || isPrivateNetwork);
    },
    credentials: true,
}));
const PORT = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/', chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/documents", documentRouter);

app.listen(PORT, () => {
    connectDb();
    console.log("Server is running on the port " + PORT);
});
