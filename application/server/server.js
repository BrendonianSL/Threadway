import express from 'express';
import threadRouter from './threadRouter.js';
import userRouter from './userRouter.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy, Strategy } from 'passport-local';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

const port = 3001;

//Establishes A Supabase Connection.
const supabase = createClient('https://ehmaqwxkmgpwloquwvfm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobWFxd3hrbWdwd2xvcXV3dmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MTk4NjksImV4cCI6MjA2MTI5NTg2OX0.i7GDc2TBBzAcWAcfHRU39dZs_tXojabzDws7eQHJMm4');

//Parses Any JSON Body
app.use(express.json());

app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

//Redirects Request To Specified Routers.
app.use('/user', userRouter);
app.use('/threads', threadRouter);

//Server Begins Listening For Request.
app.listen(port, () => {
    console.log(`Now Listening On Port ${port}.`);
})