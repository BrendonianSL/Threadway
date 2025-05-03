import { Router } from "express";
import { body, validationResult } from 'express-validator';

const router = Router();

const validateThreadInput = [body('title').notEmpty().withMessage('Thread Title Is Required.').escape(), body('description').notEmpty().withMessage('Thread Description Is Required').escape(),
    body('link').notEmpty().withMessage('Thread Link Is Required.').isURL().withMessage('Thread Link Must Be A Valid URL.').escape()
];

const validateID = [body('id').notEmpty().withMessage('Thread ID Is Required').escape().isInt().withMessage('Thread ID Must Be An Integer.')];


//Router Responsible For Creating Threads.
router.post('/', validateThreadInput, async (req, res, next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        return res.status(400).json({ error: validationErrors.array() })
    }

    //Check If User Is Authorized.
    if(!req.isAuthenticated()) {
        console.log("Not Authorized");
        //Return A 401 (Not Authorized).
        return res.status(401).json({ message: 'User Is Not Authorized.' });
    }

    //Parse Data From Request Body
    const { title, description, link } = req.body;

    //Create A Record In Database With Title And Description.
    const { error } = await req.supabase.from('threads').insert({ title: title, description: description, link: link, user_id: req.user.id });

    //Check For An Error.
    if(error) {
        //Return A 500.
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    //Send A 201.
    return res.status(201).json({ message: 'Thread Created.' });
});

//Router Repsonsible For Grabbing Existing Threads.
router.get('/', async (req, res, next) => {
    //Check If The User Is Logged In.
    if(!req.isAuthenticated()) {
        //Return A 401 (Unauthorized).
        return res.status(401).json({ error: 'User Is Not Authorized.' });
    }

    //Begin A Search Of All Threads.
    const { data, error } = await req.supabase.from('threads').select('*').eq('user_id', req.user.id).limit(20);

    //Checks For Error.
    if(error) {
        //Return A 500 Error Code.
        return res.status(500).json({ error: 'Trouble Fetching Threads' });
    }
    //Return A 200.
    return res.status(200).json({ message: 'Successfully Fetched Threads.', data: data});
});

//Router Responsible For Updating An Existing Thread
router.put('/', validateThreadInput, async (req, res, next) => {
    //Check For Data Errors.
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        return res.status(400).json({ error: validationErrors.array() })
    }

    //Check If The User Is Authenticated.
    if(!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User Is Not Authorized.' });
    }

    //Parse Request Body.
    const { id, title, description, link } = req.body;

    //Initiate Update Request.
    const { error } = await req.supabase.from('threads').update({ title: title, description: description, link: link }).eq('id', id).eq('user_id', req.user.id).single();

    //Check For An Error.
    if(error) {
        //Return A 500.
        return res.status(500).json({ error: 'Internal Server Error.' });
    }

    //If Success, Return A 200.
    return res.status(200).json({ message: 'Thread Updated.' });
});

//Router Responsible For Deleting An Existing Thread
router.delete('/', validateID, async (req, res, next) => {
    try {
        //Check If User Is Authorized.
        if(!req.isAuthenticated()) {
            //Send A 401 (Unauthorized)
            return res.status(401).json({ error: 'User Is Not Authorized.'} );
        }

        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()) {
            return res.status(400).json({ error: validationErrors.array() })
        }

        //Parse Request Body.
        const { id } = req.body;

        //Initiate Delete Request.
        const { error } = await req.supabase.from('threads').delete().eq('id', id).eq('user_id', req.user.id).single();

        //Check For An Error.
        if(error) {
            //Return A 500.
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        //If Success, Return A 200.
        return res.status(200).json({ message: 'Thread Deleted' });
    } catch(error) {
        console.log(error);
    }
});

export default router;