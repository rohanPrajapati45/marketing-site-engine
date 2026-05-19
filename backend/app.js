import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import serviceRoutes from './routes/whatwedoPage/serviceRoute.js';
import categoryRoutes from './routes/workPage/categoryRoute.js';
import subcategoryRoutes from './routes/workPage/subcategoryRoute.js';
import projectRoutes from './routes/workPage/projectRoute.js';
import heroRoute from './routes/homePage/heroRoute.js';
import homeProjectRoute from './routes/homePage/projectRoute.js';
import caseStudyRoute from './routes/homePage/caseStudyRoute.js';
// ──Contact page routes ──
import contactInfoRoute from './routes/contactPage/contactInfoRoute.js';
import branchRoute from './routes/contactPage/branchRoute.js';
import contactFormRoute from './routes/contactPage/contactFormRoute.js';
import contactSubmissionRoute from './routes/contactPage/contactSubmissionRoute.js';
// ──sollution page routes ──
import solutionsHeaderRoute from './routes/solutionsPage/solutionsHeaderRoute.js';
import solutionRoute from './routes/solutionsPage/solutionRoute.js';
import demoRequestRoute from './routes/solutionsPage/demoRequestRoute.js';
import authRoutes from './routes/admin/adminRoute.js';
import { createMainAdmin } from './config/createmainAdmin.js';
import agencyRouter from './routes/adminSectionRouter.js';
import adminRouter from './routes/adminPageRouter.js';
import sectionRouter from './routes/adminSectionRouter.js';
import publicRouter from './routes/publicPageRouter.js';
import utilityRouter from './routes/utilityRouter.js';
import blogRouter from './routes/blogPage/adminBlogRouter.js';
import blogPublicRouter from './routes/blogPage/publicBlogRouter.js';
import mediaRouter from './routes/mediaRouter.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
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
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/home/hero', heroRoute);
app.use('/api/home/projects', homeProjectRoute);
app.use('/api/home/case-studies', caseStudyRoute);
// ═══════════════════════════════════════════════════════════════
// Contact page routes
// ═══════════════════════════════════════════════════════════════
app.use('/api/contact/info', contactInfoRoute);
app.use('/api/contact/branches', branchRoute);
app.use('/api/contact/form', contactFormRoute);
app.use('/api/contact/submissions', contactSubmissionRoute);
// ═══════════════════════════════════════════════════════════════
// solution page routes
// ═══════════════════════════════════════════════════════════════
app.use('/api/solutions/header', solutionsHeaderRoute);
app.use('/api/solutions', solutionRoute);
app.use('/api/solutions/demo-requests', demoRequestRoute);

app.use('/admin', adminRouter);
app.use('/admin', sectionRouter);
app.use('/admin', utilityRouter);
app.use('/', publicRouter);

app.use('/admin', blogRouter);
app.use('/', blogPublicRouter);
app.use('/admin', mediaRouter);


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