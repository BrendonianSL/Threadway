import express from 'express';
import threadRouter from './threadRouter.js';
import userRouter from './userRouter.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const app = express();
const port = 3001;

// Create Supabase Client
const supabase = createClient(
  'https://ehmaqwxkmgpwloquwvfm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobWFxd3hrbWdwd2xvcXV3dmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MTk4NjksImV4cCI6MjA2MTI5NTg2OX0.i7GDc2TBBzAcWAcfHRU39dZs_tXojabzDws7eQHJMm4'
);

// Setup MemoryStore for Sessions
const store = session.MemoryStore();

// Body Parser for JSON
app.use(express.json());

// Attach Supabase to req for Routers
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Allow CORS from Frontend
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Setup Sessions
app.use(
  session({
    name: 'connect.sid',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: false,    // secure: true for production with HTTPS
      sameSite: 'lax',  // could use 'none' if cross-site
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define LocalStrategy for Login
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        return done(error, false);
      }
      if (!data) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const passwordMatch = await bcrypt.compare(password, data.password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      // Success
      return done(null, data);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Serialize user into Session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from Session
passport.deserializeUser(async (id, done) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, created_at')
      .eq('id', id)
      .single();

    if (error) {
      return done(error, null);
    }

    done(null, data);
  } catch (error) {
    done(error, null);
  }
});

// Use Routers
app.use('/user', userRouter);
app.use('/threads', threadRouter);

// Start Server
app.listen(port, () => {
  console.log(`Now Listening On Port ${port}.`);
});
