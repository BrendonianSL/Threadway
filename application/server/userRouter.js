import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import passport from 'passport';

const router = Router();

const validateUser = [body('username').notEmpty().withMessage('Username Is Required').trim().escape(),
    body('password').notEmpty().withMessage('Password Is Required').trim().escape()
];

router.get('/', async (req, res, next) => {
    try {
        //Check If User Is Authenticated.
        if(!req.isAuthenticated()) {
            //Send A 401 (Unauthorized)
            return res.status(401).json({ error: 'User Is Not Authorized.'} );
        }

        //If They Are Authenticated, Send A 200.
        return res.status(200).json({ message: 'User Is Authorized' });
    } catch(error) {
        next(error);
    }
})

router.post('/register', validateUser, async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);

        // Validation error check
        if(!validationErrors.isEmpty()) {
            const formErrors = {};

            for (const error of validationErrors.errors) { // <-- Fixed
                if(error['path'] === 'username') {
                    formErrors['username'] = "Username is a required field.";
                } else if (error['path'] === 'password') {
                    formErrors['password'] = "Password is a required field.";
                }
            }

            return res.status(400).json({ error: formErrors });
        }

        //Parse Request Body.
        const { username, password } = req.body;

        //Ensure User Doesn't Already Exists. Expects Single Result.
        const { data, selectError } = await req.supabase.from('users').select('*').eq('username', username).single();

        //If An Error, Handle Accordingly
        if(selectError) {
            //Return A 409 (Conflict)
            return res.status(500).json({ error: 'Internal Server Error.' });
        }

        //If The User Exists, Let The User Know.
        if(data) {
            return res.status(409).json({error: 'This Username Already Exists' });
        }

        //Hashes Password.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const { data: insertData, error: insertError } = await req.supabase.from('users').insert({
            username: username,
            password: hashedPassword
        });

        if(insertError) {
            return res.status(500).json({ error: insertError.message || "Internal Server Error."});
        }

        //Return A 201 If Passed.
        return res.status(201).json({ message: 'Account Successully Created' });
    } catch(error) {
        next(error);
    }
});

//Handles User Login
router.post('/login', validateUser, async (req, res, next) => {
    try {
        //Check For Validation Errors
        const validationErrors = validationResult(req);

        //Validation Error Check
        if(!validationErrors.isEmpty()) {
            const formErrors = {};

            for (const error of validationErrors.errors) { // <-- Fixed
                if(error['path'] === 'username') {
                    formErrors['username'] = "Username is a required field.";
                } else if (error['path'] === 'password') {
                    formErrors['password'] = "Password is a required field.";
                }
            }

            return res.status(400).json({ error: formErrors });
        }

        console.log('Passed Validation & Sanitization');

        //Executes Our Created Strategy.
        const authenticate = passport.authenticate('local', (err, user, info) => {
            console.log('Beginning Authentication');

            if(err) {
                console.log('Authentication Error Occured!');
                return res.status(500).json({ error: err.message });
            }

            if(!user) {
                console.log('No User Found During Authentication!');
                return res.status(401).json({ error: info?.message || 'Login Failed.'});
            }

            //Attempt A Login
            req.login(user, (err) => {
                console.log('Attempting To Log In');

                if(err) {
                    return res.status(500).json({ error: err.message || 'Internal Server Error.'})
                }

                return res.status(200).json({ message: 'Login Successfull.' })
            });
        });

        console.log('Login Router: Before Authentication.');
        authenticate(req, res, next);

    } catch(error) {
        next(error);
    }
});

router.post('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) return next(err);
  
      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // optional
        return res.status(200).json({ message: 'Logout Successful.' });
      });
    });
  });
  
  

router.use((err, req, res, next) => {
    console.error('Unexpected Error.', err);
    return res.status(500).json({ error: 'Internal Server Error.' });
});

export default router;