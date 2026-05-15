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
import agencyRouter from './routes/adminSectionRouter.js';
import adminRouter from './routes/adminPageRouter.js';
import sectionRouter from './routes/adminSectionRouter.js';
import publicRouter from './routes/publicPageRouter.js';
import utilityRouter from './routes/utilityRouter.js';

const app=express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/',(req,res,next)=>{
    console.log(req.method , req.url);
    next();
})

app.get('/', (req, res)=>{
    res.send("Welcome to SrashtaSoft API");
})

const PORT=process.env.PORT;

// app.use('/api/services', serviceRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/subcategories', subcategoryRoutes);
// app.use('/api/projects', projectRoutes);

app.use('/admin',adminRouter);
app.use('/admin',sectionRouter);
app.use('/admin',utilityRouter);
app.use('/',publicRouter);


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}/`);
        });
    } catch (err) {
        console.log("Failed to start server due to DB connection error..", err);
        process.exit(1);
    }
};

startServer();