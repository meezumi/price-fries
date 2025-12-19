'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href="/" className='flex items-center gap-1'>
          <p className='nav-logo'>
            Price<span className='text-teal-500'>Fries</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard"
                className="text-sm font-semibold text-gray-700 hover:text-teal-500 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login"
                className="text-sm font-semibold text-gray-700 hover:text-teal-500 transition"
              >
                Login
              </Link>
              <Link 
                href="/auth/register"
                className="text-sm font-semibold px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
              >
                Register
              </Link>
            </>
          )}
          <a href={'https://github.com/meezumi'} target="_blank" rel="noopener noreferrer">
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