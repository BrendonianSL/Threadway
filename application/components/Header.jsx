import { Link } from 'react-router';
import { useState, useEffect } from 'react';

export default function Header() {

    //Keeps List Of Social Links
    const socialLinks = [
        {
            label: 'LinkedIn',
            icon: '/linkedin.svg',
            url: 'https://www.linkedin.com/in/brendanslewis/'
        },
        {
            label: 'GitHub',
            icon: '/github.svg',
            url: 'https://github.com/BrendonianSL'
        }
    ];

    const navigationLinks = [
        {
            label: 'Dashboard',
            icon: '/home.svg',
            url: '/dashboard'
        },
        {
            label: 'Settings',
            icon: '/settings.svg',
            url: '/settings'
        }
    ];

    //UseState For Toggling Menu Open Or Close.
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth >= 1024) {
                setMenuOpen(false);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //Helper Function To Set Selected Menu Item.
    return (
        <header className='relative flex lg:flex-col items-start justify-between lg:justify-start gap-8 w-full lg:min-h-screen lg:max-w-[18.75rem] bg-[#141414] px-4 py-8'>
            <img src='/logobig.svg' />
            <div className='hidden lg:flex flex-col gap-4 w-full grow'>
                <div className='flex flex-col gap-2'>
                    <span className='px-2'>Navigation</span>
                    {navigationLinks.map((link) => {
                        return (
                            <Link to={link.url} className='flex items-center gap-2 w-full px-2 py-2 rounded-md lg:hover:bg-[#1F1F1F] lg:hover:cursor-pointer'>
                                <img src={link.icon} />
                                {link.label}
                            </Link>
                        )
                    })}
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='px-2'>Socials</span>
                    {socialLinks.map((link) => {
                        return (
                            <Link to={link.url} className='flex items-center gap-2 w-full px-2 py-2 rounded-md lg:hover:bg-[#1F1F1F] lg:hover:cursor-pointer'>
                                <img src={link.icon} />
                                {link.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
            <span className='hidden lg:block w-full text-center'>© 2025 Brendan Lewis &#128513;</span>
            <img className='block lg:hidden' onClick={() => setMenuOpen(prev => !prev)} src='/hamburgermenu.svg' />
            <div className={`absolute ${menuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden w-full left-0 top-[100%] bg-[#141414] transition-all duration-800 linear z-50`}>
                <div className={`w-full left-0 top-[100%] px-4 py-8 bg-[#141414] flex flex-col gap-4 z-50`}>
                    <div className='flex flex-col gap-2'>
                        <span className='px-2'>Navigation</span>
                        {navigationLinks.map((link) => {
                            return (
                                <Link to={link.url} className='flex items-center gap-2 w-full px-2 py-2 rounded-md lg:hover:bg-[#1F1F1F] lg:hover:cursor-pointer'>
                                    <img src={link.icon} />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='px-2'>Socials</span>
                        {socialLinks.map((link) => {
                            return (
                                <Link to={link.url} className='flex items-center gap-2 w-full px-2 py-2 rounded-md lg:hover:bg-[#1F1F1F] lg:hover:cursor-pointer'>
                                    <img src={link.icon} />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

        </header>
    )
}