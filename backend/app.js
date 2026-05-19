import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
// Removed legacy page routes as the CMS architecture is now fully dynamic
import authRoutes from './routes/admin/adminRoute.js';
import { createMainAdmin } from './config/createmainAdmin.js';
import agencyRouter from './routes/adminSectionRouter.js';
import adminRouter from './routes/adminPageRouter.js';
import sectionRouter from './routes/adminSectionRouter.js';
import publicRouter from './routes/publicPageRouter.js';
import utilityRouter from './routes/utilityRouter.js';
import blogRouter from './routes/blogPage/adminBlogRouter.js';
import blogPublicRouter from './routes/blogPage/publicBlogRouter.js';

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin || true);
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', (req, res, next) => {
    console.log(req.method, req.url);
    next();
})

app.get('/', (req, res) => {
    res.send("Welcome to SrashtaSoft API");
})

const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);
// Legacy specific API routes removed in favor of dynamic rendering and CMS endpoints

app.use('/admin', adminRouter);
app.use('/admin', sectionRouter);
app.use('/admin', utilityRouter);
app.use('/', publicRouter);

app.use('/admin', blogRouter);
app.use('/', blogPublicRouter);


const startServer = async () => {
    try {
        await connectDB();
        await createMainAdmin();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/`);
        });
    } catch (err) {
        console.log("Failed to start server due to DB connection error..", err);
        process.exit(1);
    }
};

startServer();