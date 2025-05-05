import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Authorization() {

    //Use State For Loading.
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    //Sets Navigate Variable
    const navigate = useNavigate();
    

    //Helper Function To Have Us Log In.
    async function handleLogin (e) {
        //Stops Page Re-Render
        e.preventDefault();

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
            return;
        }

        //Clears Form Errors If Both Pass.
        setFormErrors({});

        try {
            //Attempts A Match To The Server.
            const response = await fetch('http://localhost:3001/user/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: e.target.username.value.trim(),
                    password: e.target.password.value.trim(),
                })
            });

            //Check The Response
            if(!response.ok) {
                //Parse The Response For Error
                const data = await response.json();

                //Do Individual Status Checks Below!
            }

            setIsLoading(false);

            navigate('/dashboard');
        } catch(error) {
            alert('Something Went Wrong.' + error);
        }
    }

    //Runs On Mount To Check If The User Is Logged In.
    useEffect(() => {
        const checkAuth = async () => {
            //Initiates Server Fetch.
            const response = await fetch('http://localhost:3001/user', {
                method: 'GET',
                credentials: 'include',
            });

            //If We Are Successful, We Navigate To Dashboard.
            if(response.ok) {
                navigate('/dashboard');
            } else {
                return;
            }
        }

        //Runs The Above Function.
        checkAuth();
    }, []);


    return (
        <section className='flex justify-center items-center w-full h-[100vh] px-4'>
            <div className='flex flex-col gap-8 w-full max-w-[43.75rem] h-auto'>
                <div className='flex flex-col gap-8'>
                    <img className='w-[50px] h-[50px]' src='/logoicon.svg' alt='Threadway Logo' />
                    <div className='flex flex-col gap-2'>
                        <h1>Welcome Back!</h1>
                        <p className='text-(--onyx80)'>Sign in to your account below.</p>
                    </div>
                </div>
                <form className='flex flex-col gap-8' onSubmit={handleLogin}>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='username'>Username</label>
                            <input className='flex px-4 py-4 rounded-lg w-full bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720] focus' type='text' name='username' placeholder="Username" />
                            <span className={`${formErrors.username ? 'block' : 'hidden'} text-(--error)`}>{formErrors.username}</span>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='password'>Password</label>
                            <input className='flex px-4 py-4 rounded-lg w-full bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='password' name='password' placeholder="••••••••" />
                            <span className={`${formErrors.password ? 'block' : 'hidden'} text-(--error)`}>{formErrors.password}</span>
                        </div>
                    </div>
                    <input className='w-full bg-(--ctaColor) lg:hover:cursor-pointer rounded-lg text-(--ivory) px-8 py-4' type='submit' value='Sign In' />
                </form>
                <span>Dont Have An Account? <a className='text-(--ctaColor) underline' href='/register'>Sign Up</a></span>
            </div>
        </section>
    )
}