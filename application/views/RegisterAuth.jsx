import { useNavigate, Link } from 'react-router';
import { useState } from 'react';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState(null);

    //Sets The Navigate Variable.
    const navigate = useNavigate();

    //Helper Function To Register The User.
    const registerUser = async (e) => {
        //Stops Page Re-Render
        e.preventDefault();

        if(isLoading) {
            return;
        }

        setIsLoading(true);

        const newErrors = { username: null, password: null};
        let hasErrors = false;

        //Validate Input
        if(!e.target.username.value.trim()) {
            //Set A Username Error
            newErrors.username = 'Username Is Required';
            hasErrors = true;
        }

        if(!e.target.password.value.trim()) {
            newErrors.password = "Password Is Required.";
            hasErrors = true;
        }

        if(hasErrors) {
            setFormErrors(newErrors);
            //Disables Loading
            setIsLoading(false);
            return;
        }

        //Clears Form Errors If Both Pass.
        setFormErrors(null);

        const registerRes = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: e.target.username.value.trim(),
                password: e.target.password.value.trim()
            })
        });

        //Parse The Response.
        const data = await registerRes.json();

        //Check If The Response Is Ok.
        if(!registerRes.ok) {
            //Handle Errors With User Creation.
        }

        //Disables Loading.
        setIsLoading(false);

        //If The Response Is Ok, Navigate To The Login Screen. Send This Message Along With It.
        navigate('/login', { state: { message: data.message } });
    }
    
    return (
        <section className='flex justify-center items-center w-full h-[100vh] px-4'>
            <div className='flex flex-col gap-8 w-full max-w-[43.75rem] h-auto'>
                <div className='flex flex-col gap-8'>
                    <img className='w-[50px] h-[50px]' src='/logoicon.svg' alt='Threadway Logo' />
                    <div className='flex flex-col gap-2'>
                        <h1>Register Account</h1>
                        <p className='text-(--onyx80)'>Enter your details below</p>
                    </div>
                </div>
                <form className='flex flex-col gap-8' onSubmit={registerUser}>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='username'>Username</label>
                            <input className='flex px-4 py-4 rounded-lg w-full bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720] focus' type='text' name='username' placeholder="Username" />
                            <span className={`${formErrors?.username ? 'block' : 'hidden'} text-(--error)`}>{formErrors?.username}</span>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='password'>Password</label>
                            <input className='flex px-4 py-4 rounded-lg w-full bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='password' name='password' placeholder="••••••••" />
                            <span className={`${formErrors?.username ? 'block' : 'hidden'} text-(--error)`}>{formErrors?.password}</span>
                        </div>
                    </div>
                    <input className='w-full bg-(--ctaColor) lg:hover:cursor-pointer rounded-lg text-(--ivory) px-8 py-4' type='submit' value='Register' />
                </form>
                <span>Dont Have An Account? <Link className='text-(--ctaColor) underline' to='/login'>Sign In</Link></span>
            </div>
        </section>
    )
}