import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const navIcons = [
  { src: '/assets/icons/search.svg', alt: 'search' },
  { src: '/assets/icons/black-heart.svg', alt: 'heart' },
  { src: '/assets/icons/user.svg', alt: 'user' }
]

const Navbar = () => {
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href="/" className='flex items-center gap-1'>

          <p className='nav-logo'>
            Price<span className='text-teal-500'>Fries</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
            <a href={'https://github.com/meezumi'} target="_blank">
            <button>
              <Image
                src={"/assets/icons/github.svg"}
                width={28}
                height={28} 
                alt='github'
              />
            </button>
            </a>

        </div>

      </nav>
    </header>
  )
}

export default Navbar