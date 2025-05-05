import Thread from "../components/Thread";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Dashboard() {

    //UseStates For Threads
    const [threads, setThreads] = useState([]);
    const [threadToDelete, setThreadToDelete] = useState(null); //Holds Information On Attempt To Delete A Thread.
    const [threadToEdit, setThreadToEdit] = useState(null); //Holds Information About Thread To Edit.
    const [toggleCreateThread, setToggleCreateThread] = useState(false);
    const [threadErrors, setThreadErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState();

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

        //Trims The Title.
        title = title.trim();

        //Check The Title
        if(!title) {
            console.log('Title Missing');
            errors.title = 'Thread Title Is Required.';
        }

        if(!link.trim()) {
            console.log('Link Missing');
            errors.link = 'Thread Link Is Required.';
        } else if(!isValidURL(link)) {
            console.log('Invalid URL');
            errors.link = 'Thread Link Must Be A Valid URL.';
        }

        if(!description) {
            console.log('Description Missing');
            errors.description = 'Thread Description Is Required.';
        }

        //Checks All Properties Of The Error Object To See If At Least One Is Ture.
        if (Object.values(errors).some(error => error !== null)) {

            console.log('There Are Form Errors 2.');
            return {
                errors: errors,
                hasErrors: true
            }
        } else {
            return {
                errors: null,
                hasErrors: false
            }
        }
    }

    //Helper Function To Fetch All Threads That Belong To The User.
    const fetchThreads = async () => {
        try {
            //Fetch All Threads.
            const threadResponse = await fetch('http://localhost:3001/threads', {
                credentials: 'include',
            });

            //Parses The Data.
            const data = await threadResponse.json();

            //Check For Errors.
            if(!threadResponse.ok) {
                if(threadResponse.status === 401) {
                    navigate('/login');
                }
            }

            //Sets The Threads.
            setThreads(data);
        } catch (error) {
            alert('Something Went Wrong.' + error);
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

        const variable = handleDataCheck(e.target.title.value, e.target.link.value, e.target.description.value);
        
        if(variable.hasErrors) {
            setThreadErrors(variable.errors);
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

        //Toggle Menu Off
        setToggleCreateThread(false);

        //Disable Loading.
        setIsLoading(false);

        //Clear Target Values.
        e.target.title.value = '';
        e.target.link.value = '';
        e.target.description.value = '';

        //Display Notification
        setShowNotification('Thread Created.');

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

            //Parse Data.
            const data = await response.json();

            //Check For Errors
            if(!response.ok) {
                //Handle Errors.
                if(response.status === 401) {
                    navigate('/login');
                } else if (response.status(400)) {
                    alert(data.message);
                } else if (response.status === 500) {
                    alert(data.message);
                }
            }

            //Toggle Off The Delete Menu.
            setThreadToDelete(null);

            //Disable Loading.
            setIsLoading(false);

            //Trigger Notification.
            setShowNotification('Thread Deleted.');
            
            //Reload Threads
            fetchThreads();
        } catch(error) {
            alert('Something Went Wrong.' + error);
        }
    }

    async function editThread(e) {
        try {
            //Prevents Page Re-Render.
            e.preventDefault();

            console.log('Error Handling.');
            //Check If We Are Already Loading.
            if(isLoading) {
                return; 
            }
            console.log('Error Handling.');

            //Triggers Loading State.
            setIsLoading(true);

            //Check For Errors
            const variable = handleDataCheck(e.target.title.value, e.target.link.value, e.target.description.value);

            //Check For Errors
            if(variable.hasErrors) {
                console.log('There Are Form Errors.');
                //Handle Form Errors.
                setThreadErrors(variable.errors);

                //Disable Loading.
                setIsLoading(false);
                return;
            }

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

            //Set Thread To Edit To Null.
            setThreadToEdit(null);

            //Disable Loading.
            setIsLoading(true);

            //Trigger Notification.
            setShowNotification(true);

            //Retrigger Fetch.
            fetchThreads();

        } catch(error) {
            alert('Something Went Wrong.' + error);
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
            const timer = setTimeout(() => setShowNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [showNotification, setShowNotification]);

    return (
        <section className='w-full max-w-[1000px] h-full flex flex-col grow gap-8 px-4 py-8 lg:px-8 lg:py-16'>
          <div className='flex w-full justify-between'>
            <h1>Thread Dashboard</h1>
            <button
              onClick={() => setToggleCreateThread(true)}
              className='flex items-center gap-2 px-4 py-1 rounded-lg text-sm text-(--ivory) bg-(--ctaColor)'
            >
              <img src='plus.svg' alt='Plus Symbol' />
            </button>
          </div>
      
          {threads.data?.length === 0 ? (
            <div className='flex grow flex-col items-center justify-center gap-4'>
              <img className='h-[6.25rem] w-[4.688rem]' src='/paperclip.svg' />
              <h2 className='text-center'>You haven't created any threads yet!</h2>
              <button
                onClick={() => setToggleCreateThread(true)}
                className='flex items-center gap-2 px-4 py-4 rounded-lg text-sm text-(--ivory) bg-(--ctaColor)'
              >
                <img src='plus.svg' alt='Plus Symbol' />Create A Thread
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              {threads.data?.map((thread) => (
                <Thread
                  key={thread.id}
                  id={thread.id}
                  title={thread.title}
                  description={thread.description}
                  link={thread.link}
                  deleteFunction={setThreadToDelete}
                  editFunction={setThreadToEdit}
                />
              ))}
            </div>
          )}
      
          <div
            className={`${toggleCreateThread ? 'flex' : 'hidden'} absolute top-0 left-0 h-full w-full items-center justify-center px-4`}
          >
            <div className='flex flex-col gap-8 rounded-lg border-[1px] border-[#363839] bg-[#1F1F1F] px-8 py-8 w-[43.75rem] max-w-[90rem]'>
              <h2>New Thread</h2>
              <form onSubmit={submitThread} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor='title'>Thread Title</label>
                  <input
                    className='flex w-full rounded-lg border-[1px] border-[#27272720] bg-[#F2F2F2] px-4 py-4 text-(--night)'
                    type='text'
                    id='title'
                    name='title'
                    placeholder='Cool Thread Title'
                  />
                  <span className={`${threadErrors?.title ? 'block' : 'hidden'} text-(--error)`}>
                    {threadErrors?.title}
                  </span>
                </div>
      
                <div className='flex flex-col'>
                  <label htmlFor='link'>Thread Link</label>
                  <input
                    className='flex w-full rounded-lg border-[1px] border-[#27272720] bg-[#F2F2F2] px-4 py-4 text-(--night)'
                    type='text'
                    id='link'
                    name='link'
                    placeholder='https://www.reallycoollink.com'
                  />
                  <span className={`${threadErrors?.link ? 'block' : 'hidden'} text-(--error)`}>
                    {threadErrors?.link}
                  </span>
                </div>
      
                <div className='flex flex-col'>
                  <label htmlFor='description'>Thread Description</label>
                  <input
                    className='flex w-full rounded-lg border-[1px] border-[#27272720] bg-[#F2F2F2] px-4 py-4 text-(--night)'
                    type='text'
                    id='description'
                    name='description'
                    placeholder='Cool Thread Description'
                  />
                  <span className={`${threadErrors?.description ? 'block' : 'hidden'} text-(--error)`}>
                    {threadErrors?.description}
                  </span>
                </div>
      
                <div className='flex justify-end gap-4'>
                  <input
                    onClick={() => {
                      if (isLoading) return;
                      setToggleCreateThread(false);
                      setThreadErrors(null);
                    }}
                    className='rounded-lg bg-(--error) px-4 py-2 text-sm text-(--ivory) lg:hover:cursor-pointer lg:hover:bg-[#FCA5A5]'
                    type='button'
                    value='Cancel'
                  />
                  <input
                    className='rounded-lg bg-(--ctaColor) px-4 py-2 text-sm text-(--ivory) lg:hover:cursor-pointer lg:hover:bg-[#2FC769]'
                    type='submit'
                    value='Create'
                  />
                </div>
              </form>
            </div>
          </div>
      
          <div
            className={`${threadToDelete ? 'flex' : 'hidden'} absolute top-0 left-0 h-full w-full items-center justify-center px-4`}
          >
            <div className='flex flex-col gap-8 rounded-lg bg-[#1F1F1F] px-8 py-8 w-[43.75rem] max-w-[90rem]'>
              <h2>Delete Thread</h2>
              <span>Are You Sure You Want To Delete This Thread?</span>
              <div className='flex justify-end gap-4'>
                <button
                  onClick={() => {
                    if (isLoading) return;
                    setThreadToDelete(null);
                  }}
                  className='rounded-lg bg-(--onyx) px-4 py-2 text-sm text-(--ivory) lg:hover:cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteThread()}
                  className='rounded-lg bg-(--error) px-4 py-2 text-sm text-(--ivory) lg:hover:cursor-pointer lg:hover:bg-[#FCA5A5]'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
      
          <div
            className={`${threadToEdit ? 'flex' : 'hidden'} absolute top-0 left-0 h-full w-full items-center justify-center px-4`}
          >
            <div className='flex flex-col gap-8 rounded-lg border-[1px] border-[#363839] bg-[#1F1F1F] px-8 py-8 w-[43.75rem] max-w-[90rem]'>
              <h2>Edit Thread</h2>
              <form onSubmit={editThread} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor='title'>Thread Title</label>
                  <input
                    className='flex w-full rounded-lg border-[1px] border-[#27272720] bg-[#F2F2F2] px-4 py-4 text-(--night)'
                    type='text'
                    id='title'
                    name='title'
                    placeholder='Cool Thread Title'
                    value={threadToEdit?.title || ''}
                    onChange={(e) =>
                      setThreadToEdit({ ...threadToEdit, title: e.target.value })
                    }
                  />
                  <span className={`${threadErrors?.title ? 'block' : 'hidden'} text-(--error)`}>
                    {threadErrors?.title}
                  </span>
                </div>
      
                <div className='flex flex-col'>
                  <label htmlFor='link'>Thread Link</label>
                  <input
                    className='flex w-full rounded-lg border-[1px] border-[#27272720] bg-[#F2F2F2] px-4 py-4 text-(--night)'
                    type='text'
                    id='link'
                    name='link'
                    placeholder='https://www.reallycoollink.com'
                    value={threadToEdit?.link.replace('/&#x2F;/g', '/') || ''}
                    onChange={(e) =>
                      setThreadToEdit({ ...threadToEdit, link: e.target.value })
                    }
                  />
                  <span className={`${threadErrors?.link ? 'block' : 'hidden'} text-(--error)`}>
                    {threadErrors?.link}
                  </span>
                </div>
      
                <div className='flex flex-col'>
                  <label htmlFor='description'>Thread Description</label>
                  <input
                    className='flex w-full rounded-lg border-[1px] border-[#27272720] bg-[#F2F2F2] px-4 py-4 text-(--night)'
                    type='text'
                    id='description'
                    name='description'
                    placeholder='Cool Thread Description'
                    value={threadToEdit?.description || ''}
                    onChange={(e) =>
                      setThreadToEdit({ ...threadToEdit, description: e.target.value })
                    }
                  />
                  <span className={`${threadErrors?.description ? 'block' : 'hidden'} text-(--error)`}>
                    {threadErrors?.description}
                  </span>
                </div>
      
                <div className='flex justify-end gap-4'>
                  <input
                    onClick={() => {
                      if (isLoading) return;
                      setThreadToEdit(null);
                      setThreadErrors(null);
                    }}
                    className='rounded-lg bg-(--error) px-4 py-2 text-sm text-(--ivory) lg:hover:cursor-pointer lg:hover:bg-[#FCA5A5]'
                    type='button'
                    value='Cancel'
                  />
                  <input
                    className='rounded-lg bg-(--ctaColor) px-4 py-2 text-sm text-(--ivory) lg:hover:cursor-pointer lg:hover:bg-[#2FC769]'
                    type='submit'
                    value='Update'
                  />
                </div>
              </form>
            </div>
          </div>
      
          <div
            className={`fixed bottom-4 right-4 rounded-lg border-b-4 border-b-[var(--ctaColor)] bg-[#F2F2F2] px-4 py-4 text-(--night) shadow-md transition-all duration-500 ease-in-out ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
          >
            {showNotification}
          </div>
        </section>
      );
      
}