import express from "express";
import cors from "cors";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import session from "express-session";
import colors from "colors";

import { connectDatabase, createSessionStore } from "./config/db.config.js";
import authRoute from "./routes/authRoute.js";

// Load environment variables
config();

// Connect to the database
connectDatabase();

const app = express();

// Create and configure session store
const initializeSessionStore = async () => {
    try {
        return await createSessionStore();
    } catch (error) {
        console.error("Error initializing session store:", error);
        process.exit(1); // Exit process if session store initialization fails
    }
};

// Middleware for rate limiting
const limit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: parseInt(process.env.LIMIT || 100, 10),
    statusCode: 429,
    message: "Too many requests!!! Please try again after: ",
    handler: (req, res, next, options) => {
        return res.status(options.statusCode).json({
            message: `Too many requests!!! Please try again after: ${options.windowMs / 1000} seconds.`,
            error: "Rate limit exceeded!!!",
            retryAfter: options.windowMs / 1000,
        });
    }
});

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    maxAge: 3600
}));

app.use(helmet());
app.use(limit);
app.use(express.json());

// Initialize session store and apply session middleware
const storePromise = initializeSessionStore();

storePromise.then(store => {
    app.use(session({
        secret: process.env.Session_Secret,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
            maxAge: 86400,
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax'
        }
    }));

    app.use("/auth",authRoute);

    app.use("/", (req, res) => {
        return res.status(200).send('<h1>Backend Service!</h1>');
    });

    // Start the server after initializing session store
    const Port = process.env.PORT || 5000;
    app.listen(Port, () => {
        console.log(`Server running on PORT: ${Port}`.bgGreen.white);
    });
}).catch(error => {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit process if server startup fails
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});