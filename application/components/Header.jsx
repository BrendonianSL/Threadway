export default function Header() {
    return (
        <header className='flex justify-between px-4 lg:px-8 py-8 w-full'>
            <img src='/Logo.svg' alt='Threadway Logo' />
            <img className='block lg:hidden' src='/hamburgermenu.svg' alt='Mobile Menu Button' />
        </header>
    )
}