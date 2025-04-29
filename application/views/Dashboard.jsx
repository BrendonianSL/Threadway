import Thread from "../components/Thread";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Dashboard() {

    //UseState For Holding All Current Threads.
    const [threads, setThreads] = useState([]);
    const [togglePlatform, setTogglePlatform] = useState(false);


    const [toggleCreateThread, setToggleCreateThread] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createThreadErrors, setCreateThreadErrors] = useState({});
    const [showNotification, setShowNotification] = useState(false);

    const navigate = useNavigate();

    //Helper Function To Check Valid URLs.
    function isValidURL(string) {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
    }

    //Helper Function To Fetch All Threads That Belong To The User.
    const fetchThreads = async () => {
        try {
            //Fetch All Threads.
            const threadResponse = await fetch('http://localhost:3001/threads', {
                credentials: 'include',
            });

            //Check For Errors.
            if(!threadResponse.ok) {

            }

            //Parses The Data.
            const data = await threadResponse.json();
            console.log('Parsed');
            console.log(data);
            //Sets The Threads.
            setThreads(data);
        } catch (error) {
            console.log('Error');
        }
    }

    //Helper Function To Submit A New Thread.
    async function submitThread(e) {
        e.preventDefault();

        //Check If We Are Already Loading.
        if(isLoading) {
            return;
        }

        setIsLoading(true);

        const errors = { title: null, link: null, description: null };
        let hasErrors = false;

        //Checks Title.
        if(!e.target.title.value) {
            //Missing Title.
            errors.title = 'Thread Title Is Required.';
            hasErrors = true;
        }

        //Checks Link.
        if(!e.target.link.value.trim()) {
            //Missing Link
            errors.link = 'Thread Link Is Required.';
            hasErrors = true;
        } else if(!isValidURL(e.target.link.value)) {
            //Invalid URL.
            errors.link = 'Thread Link Must Be A Valid URL.';
            hasErrors = true;
        }

        //Checks Description.
        if(!e.target.description.value) {
            //Missing Description.
            errors.description = 'Thread Description Is Required.';
            hasErrors = true;
        }

        //Checks If Errors Exist.
        if(hasErrors) {
            console.log('There Are Errors');
            console.log(errors.title);
            setCreateThreadErrors(errors);
            setIsLoading(false);
            return;
        }

        const response = await fetch('http://localhost:3001/threads', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: e.target.title.value,
                link: e.target.link.value,
                description: e.target.description.value
            })
        });

        //Parse The Response
        const data = await response.json();

        //Check The Response
        if(!response.ok) {
            //Check For 401 (Not Authorized)
            if(response.status === 401) {
                //Redirect To Login.
                navigate('/login');
            }

            //Check For 500 (Internal Server Error)
            if(response.status === 500) {
                alert(data.message);
            }
        }

        //Log It
        console.log(data);
        console.log('Toggling Off');

        //Toggle Menu Off
        setToggleCreateThread(false);

        //Disable Loading.
        setIsLoading(false);

        //Display Notification
        setShowNotification(true);

        //Retrigger Fetch.
        fetchThreads();
    }
      
    //UseEffect For Fetching All Threads That Belong To The User On Mount.
    useEffect(() => {
        fetchThreads();
    }, []);

    //UseEffect For Removing The Notification After 3 Seconds.
    useEffect(() => {
        if(showNotification) {
            const timer = setTimeout(() => setShowNotification(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showNotification, setShowNotification]);

    return (
        <section className='w-full max-w-[90rem] flex flex-col gap-8 px-4 lg:px-8 grow'>
            <div className='flex justify-between w-full'>
                <h1>Hey, Brendan!</h1>
                <button  onClick={() => setToggleCreateThread(true)} className='flex items-center gap-2 bg-(--ctaColor) text-(--ivory) text-sm px-2 py-2 rounded-lg'><img src='plus.svg' alt='Plus Symbol' />Create</button>
            </div>
            <div className='flex gap-4 items-center'>
                <div className='flex'>
                    <img src='filter.svg' />
                    <span className='ml-2'>Filters</span>
                </div>
                <div className='flex bg-(--onyx) overflow-hidden rounded-sm'>
                    <div className='flex items-center lg:hover:bg-(--ctaColor) justify-center w-[36px] h-[36px]'>
                        <img className='w-[18px] h-[18px]' src='post.svg' />
                    </div>
                    <div className='flex items-center lg:hover:bg-(--ctaColor) justify-center w-[36px] h-[36px]'>
                        <img className='w-[18px] h-[18px]' src='video.svg' />
                    </div>
                    <div className='flex items-center lg:hover:bg-(--ctaColor) justify-center w-[36px] h-[36px]'>
                        <img className='w-[18px] h-[18px]' src='image.svg' />
                    </div>
                    <div className='flex items-center lg:hover:bg-(--ctaColor) justify-center w-[36px] h-[36px]'>
                        <img className='w-[18px] h-[18px]' src='audio.svg' />
                    </div>
                    <div className='flex items-center lg:hover:bg-(--ctaColor) justify-center w-[36px] h-[36px]'>
                        <img className='w-[18px] h-[18px]' src='article.svg' />
                    </div>
                </div>
                <div onClick={() => setTogglePlatform(prev => !prev)} className='relative flex items-center bg-(--onyx) text-(--ivory) rounded-sm h-[36px] px-4 lg:hover:cursor-pointer'>
                    All Platforms
                    <div className={`${togglePlatform ? 'block' : 'hidden'} absolute top-[105%] left-0 w-[150px] bg-(--onyx) rounded-sm`}>
                        <div className='px-2 py-2'>
                            Youtube
                        </div>
                        <div className='px-2 py-2'>
                            Reddit
                        </div>
                        <div className='px-2 py-2'>
                            X
                        </div>
                        <div className='px-2 py-2'>
                            Instagram
                        </div>
                    </div>
                </div>
            </div>
            {threads.data?.length === 0 ? <div className='flex flex-col gap-4 items-center justify-center grow'>
                <img className='w-[4.688rem] h-[6.25rem]' src='/paperclip.svg' />
                <h2>You haven't created any threads yet!</h2>
                <button onClick={setShowNotification(true)} className='flex items-center gap-2 bg-(--ctaColor) text-(--ivory) text-sm px-4 py-4 rounded-lg'><img src='plus.svg' alt='Plus Symbol' />Create A Thread</button>
            </div> : threads.data?.map(thread => <Thread title={thread.title} description={thread.description} link={thread.link}/>)}
            <div className={`${toggleCreateThread ? 'flex' : 'hidden'} items-center justify-center absolute min-w-[100vw] min-h-[100vh] bg-(--onyx80) left-0`}>
                <div className='flex flex-col gap-8 bg-(--ivory) w-[43.75rem] max-w-[90rem] rounded-lg px-8 py-8'>
                    <h2>New Thread</h2>
                    <form onSubmit={submitThread} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='title'>Thread Title</label>
                            <input className='flex px-4 py-4 rounded-lg w-full bg-[#F2F2F2] border-[1px] border-[#27272720]' type='text' id='title' name='title' placeholder='Cool Thread Title' />
                            <span className={`${createThreadErrors.title ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.title}</span>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='link'>Thread Link</label>
                            <input className='flex px-4 py-4 rounded-lg w-full  bg-[#F2F2F2] border-[1px] border-[#27272720]' type='text' id='link' name='link' placeholder='https://www.reallycoollink.com' />
                            <span className={`${createThreadErrors.link ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.link}</span>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='description'>Thread Description</label>
                            <input className='flex px-4 py-4 rounded-lg w-full  bg-[#F2F2F2] border-[1px] border-[#27272720]' type='text' id='description' name='description' placeholder='Cool Thread Description' />
                            <span className={`${createThreadErrors.description ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.description}</span>
                        </div>
                        <div className='flex justify-end gap-4'>
                            <input onClick={() => {if(isLoading) return; setToggleCreateThread(false)}} className='bg-(--error) lg:hover:bg-[#FCA5A5] lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='button' value='Cancel' />
                            <input className='bg-(--ctaColor) lg:hover:bg-[#2FC769] lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='submit' value='Create' />
                        </div>
                    </form>
                </div>
            </div>
            <div className={`fixed bottom-4 right-4 px-4 py-4 rounded-lg border-b-4 border-b-[var(--ctaColor)] bg-[#F2F2F2] shadow-md transition-all duration-500 ease-in-out ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                Thread Creation Complete.
            </div>
        </section>
    )
}