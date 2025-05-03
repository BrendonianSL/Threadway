import Thread from "../components/Thread";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Dashboard() {

    //UseStates For Threads
    const [threads, setThreads] = useState([]);
    const [threadToDelete, setThreadToDelete] = useState(null); //Holds Information On Attempt To Delete A Thread.
    const [threadToEdit, setThreadToEdit] = useState(null); //Holds Information About Thread To Edit.

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

    function handleDataCheck(title, link, description) {
        //Creates An Error Object.
        const errors = { title: null, link: null, description: null };
        const hasErrors = false;

        //Check The Title
        if(!title) {
            errors.title = 'Thread Title Is Required.';
        }

        if(!link.trim()) {
            errors.link = 'Thread Link Is Required.';
        } else if(!isValidURL(link)) {
            errors.link = 'Thread Link Must Be A Valid URL.';
        }

        if(!description) {
            errors.description = 'Thread Description Is Required.';
        }

        //Checks All Properties Of The Error Object To See If At Least One Is Ture.
        if(Object.values(errors).some()) {
            console.log('Returning Error Object.');
            return {
                errors: errors,
                hasErrors: true
            }
        }
    }

    //UseEffect To Log threadToDelete.
    useEffect(() => {
        console.log(threadToDelete);
    }, [threadToDelete]);

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

        //Toggle Menu Off
        setToggleCreateThread(false);

        //Disable Loading.
        setIsLoading(false);

        //Display Notification
        setShowNotification(true);

        //Retrigger Fetch.
        fetchThreads();
    }
    
    //Helper Function TO Delete A Thread.
    async function deleteThread() {
        try {
            //Sets Is Loading To True.
            setIsLoading(true);

            //Initiate Fetch.
            const response = await fetch('http://localhost:3001/threads', {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: threadToDelete,
                })
            });

            //Check For Errors
            if(!response.ok) {
                //Handle Errors.
            }

            console.log('Delete Worked');

            //Parse The Data And Log it.
            const data = await response.json();
            console.log(data);

            //Toggle Off The Delete Menu.
            setThreadToDelete(null);

            //Disable Loading.
            setIsLoading(false);

            //Trigger Notification.

            //Reload Threads
            fetchThreads();
        } catch(error) {
            
        }
    }

    async function editThread(e) {
        try {
            //Prevents Page Re-Render.
            e.preventDefault();

            console.log('In Edit Thread.')

            //Check If We Are Already Loading.
            if(isLoading) {
                console.log('Already Loading.');
                return; 
            }

            //Triggers Loading State.
            setIsLoading(true);


            console.log('No Errors. Starting Fetch.');

            //Initiate Update.
            const editResponse = await fetch('http://localhost:3001/threads', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: threadToEdit.id,
                    title: e.target.title.value,
                    link: e.target.link.value,
                    description: e.target.description.value
                })
            });

            //Parse The Response.
            const data = await editResponse.json();

            //Check For Errors.
            if(!editResponse.ok) {
                //Handle Errors.
            }

            console.log(data);

            //Set Thread To Edit To Null.
            setThreadToEdit(null);

            //Disable Loading.
            setIsLoading(true);

            //Trigger Notification.
            setShowNotification(true);

            //Retrigger Fetch.
            fetchThreads();

        } catch(error) {

        }
    }
      
    //UseEffect For Fetching All Threads That Belong To The User On Mount.
    useEffect(() => {
        fetchThreads();
    }, []);

    useEffect(() => {
        if (threadToEdit?.link?.includes('&#x2F;')) {
          setThreadToEdit(prev => ({
            ...prev,
            link: prev.link.replace(/&#x2F;/g, "/")
          }));
        }
      }, [threadToEdit]);
      
    //UseEffect For Removing The Notification After 3 Seconds.
    useEffect(() => {
        if(showNotification) {
            const timer = setTimeout(() => setShowNotification(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showNotification, setShowNotification]);

    return (
        <section className='w-full max-w-[1000px] h-full flex flex-col gap-8 px-4 py-8 lg:py-16 lg:px-8 grow'>
            <div className='flex justify-between w-full'>
                <h1>Thread Dashboard</h1>
                <button  onClick={() => setToggleCreateThread(true)} className='flex items-center gap-2 bg-(--ctaColor) text-(--ivory) text-sm px-4 py-1 rounded-lg'><img src='plus.svg' alt='Plus Symbol' /></button>
            </div>
            {threads.data?.length === 0 ? <div className='flex flex-col gap-4 items-center justify-center grow'>
                <img className='w-[4.688rem] h-[6.25rem]' src='/paperclip.svg' />
                <h2>You haven't created any threads yet!</h2>
                <button onClick={setShowNotification(true)} className='flex items-center gap-2 bg-(--ctaColor) text-(--ivory) text-sm px-4 py-4 rounded-lg'><img src='plus.svg' alt='Plus Symbol' />Create A Thread</button>
            </div> : <div className='flex flex-col gap-4'>{threads.data?.map(thread => <Thread key={thread.id} id={thread.id} title={thread.title} description={thread.description} link={thread.link} deleteFunction={setThreadToDelete} editFunction={setThreadToEdit} />)}</div>}
            <div className={`${toggleCreateThread ? 'flex' : 'hidden'} items-center justify-center absolute w-full h-full top-0 left-0`}>
                <div className='flex flex-col gap-8 bg-[#1F1F1F] border-[1px] border-[#363839] w-[43.75rem] max-w-[90rem] rounded-lg px-8 py-8'>
                    <h2>New Thread</h2>
                    <form onSubmit={submitThread} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='title'>Thread Title</label>
                            <input className='flex px-4 py-4 rounded-lg w-full bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='text' id='title' name='title' placeholder='Cool Thread Title' />
                            <span className={`${createThreadErrors.title ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.title}</span>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='link'>Thread Link</label>
                            <input className='flex px-4 py-4 rounded-lg w-full  bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='text' id='link' name='link' placeholder='https://www.reallycoollink.com' />
                            <span className={`${createThreadErrors.link ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.link}</span>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='description'>Thread Description</label>
                            <input className='flex px-4 py-4 rounded-lg w-full  bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='text' id='description' name='description' placeholder='Cool Thread Description' />
                            <span className={`${createThreadErrors.description ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.description}</span>
                        </div>
                        <div className='flex justify-end gap-4'>
                            <input onClick={() => {if(isLoading) return; setToggleCreateThread(false)}} className='bg-(--error) lg:hover:bg-[#FCA5A5] lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='button' value='Cancel' />
                            <input className='bg-(--ctaColor) lg:hover:bg-[#2FC769] lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='submit' value='Create' />
                        </div>
                    </form>
                </div>
            </div>
            <div className={`${threadToDelete ? 'flex' : 'hidden'} items-center justify-center w-full absolute h-full top-0 left-0`}>
                <div className='flex flex-col gap-8 bg-[#1F1F1F] w-[43.75rem] max-w-[90rem] rounded-lg px-8 py-8'>
                    <h2>Delete Thread</h2>
                    <span>Are You Sure You Want To Delete This Thread?</span>
                    <div className='flex justify-end gap-4'>
                        <button onClick={() => {if(isLoading) return; setThreadToDelete(null)}} className='bg-(--onyx) lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='button' value='Cancel'>Cancel</button>
                        <button onClick={() => deleteThread()} className='bg-(--error) lg:hover:bg-[#FCA5A5] lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='submit' value='Create'>Delete</button>
                    </div>
                </div>
            </div>
            <div className={`${threadToEdit ? 'flex' : 'hidden'} items-center justify-center absolute w-full h-full top-0 left-0`}>
                <div className='flex flex-col gap-8 bg-[#1F1F1F] border-[1px] border-[#363839] w-[43.75rem] max-w-[90rem] rounded-lg px-8 py-8'>
                    <h2>New Thread</h2>
                    <form onSubmit={editThread} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='title'>Thread Title</label>
                            <input className='flex px-4 py-4 rounded-lg w-full bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='text' id='title' name='title' placeholder='Cool Thread Title' value={threadToEdit?.title || ""} onChange={(e) => setThreadToEdit({...threadToEdit, title: e.target.value})}/>
                            <span className={`${createThreadErrors.title ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.title}</span>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='link'>Thread Link</label>
                            <input className='flex px-4 py-4 rounded-lg w-full  bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='text' id='link' name='link' placeholder='https://www.reallycoollink.com' value={threadToEdit?.link.replace('/&#x2F;/g', '/') || ""} onChange={(e) => setThreadToEdit({...threadToEdit, link: e.target.value})}/>
                            <span className={`${createThreadErrors.link ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.link}</span>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='description'>Thread Description</label>
                            <input className='flex px-4 py-4 rounded-lg w-full  bg-[#F2F2F2] border-[1px] text-(--night) border-[#27272720]' type='text' id='description' name='description' placeholder='Cool Thread Description' value={threadToEdit?.description || ""} onChange={(e) => setThreadToEdit({...threadToEdit, description: e.target.value})} />
                            <span className={`${createThreadErrors.description ? 'block' : 'hidden'} text-(--error)`}>{createThreadErrors.description}</span>
                        </div>
                        <div className='flex justify-end gap-4'>
                            <input onClick={() => {if(isLoading) return; setThreadToEdit(null)}} className='bg-(--error) lg:hover:bg-[#FCA5A5] lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='button' value='Cancel' />
                            <input className='bg-(--ctaColor) lg:hover:bg-[#2FC769] lg:hover:cursor-pointer rounded-lg text-(--ivory) px-4 py-2 text-sm' type='submit' value='Update' />
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