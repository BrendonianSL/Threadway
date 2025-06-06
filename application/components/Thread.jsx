import { Link } from 'react-router';

export default function Thread({ id, title, description, link, deleteFunction, editFunction}) {
    return (
        <div className='flex gap-4 px-4 py-4 rounded-md cursor:pointer bg-[#181819] border-[1px] border-[#363839] lg:hover:scale-101 lg:transition-transform duration-75 ease-linear'>
            <div className='flex items-center gap-4 grow overflow-hidden'>
                <img className='w-[35px] h-[35px]' src='/purplelogo.svg' alt='Icon' />
                <div className='w-full'>
                    <h2>{title}</h2>
                    <p className='text-[#727478]'>{description}</p>
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <Link to={link}>
                    <img className='w-[24px] h-[24px]' src='/link.svg' alt='Link Icon' />
                </Link>
                <img onClick={() => editFunction({ title: title, description: description, link: link, id: id})} className='w-[24px] h-[24px] lg:hover:cursor-pointer' src='/edit.svg' alt='Settings Icon' />
                <img onClick={() => deleteFunction(id)} className='w-[24px] h-[24px] lg:hover:cursor-pointer' src='/delete.svg' alt='Settings Icon' />
            </div>
        </div>
    )
}