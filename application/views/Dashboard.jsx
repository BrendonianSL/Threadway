import Thread from "../components/Thread";

export default function Dashboard() {
    return (
        <section className='w-full max-w-[1440px] flex flex-col gap-8 px-4 lg:px-8'>
            <div className='flex justify-between w-full'>
                <h1>Hey, Brendan!</h1>
                <button className='flex items-center gap-2 bg-(--onyx) text-(--ivory) text-sm'><img src='plus.svg' alt='Plus Symbol' /></button>
            </div>
            <article>
                <Thread />
                <Thread />
                <Thread />
                <Thread />

            </article>
        </section>
    )
}