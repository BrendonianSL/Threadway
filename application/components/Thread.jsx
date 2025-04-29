import { Link } from 'react-router';

export default function Thread({ title, description, link}) {
    return (
        <Link to={`https://${link}`}>
            <div className='flex gap-4 px-4 py-4 rounded-md cursor:pointer lg:hover:bg-[#EAEAEA] lg:hover:scale-101 lg:transition-transform duration-75 ease-linear'>
                <div className='flex items-center gap-4 grow overflow-hidden'>
                    <img src='/Video Icon.svg' alt='Icon' />
                    <div className='w-full'>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <img className='w-[24px] h-[24px]' src='/info.svg' alt='Info Icon.' />
                    <img className='w-[24px] h-[24px]' src='/settings.svg' alt='Settings Icon' />
                </div>
            </div>
        </Link>
    )
}