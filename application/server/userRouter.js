import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

const router = Router();

const validateUser = [body('username').notEmpty().withMessage('Username Is Required').trim().escape(),
    body('password').notEmpty().withMessage('Password Is Required').trim().escape()
];

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
        console.log(error);
    }
});

export default router;