'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [comparingCount, setComparingCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth-token');
      setIsAuthenticated(!!token);

      if (token) {
        try {
          const response = await fetch('/api/auth/check', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUserEmail(data.email);
          } else {
            setIsAuthenticated(false);
            setUserEmail('');
          }
        } catch (error) {
          setIsAuthenticated(false);
          setUserEmail('');
        }
      }
    };

    const updateComparingCount = () => {
      const items = JSON.parse(localStorage.getItem('comparing-products') || '[]');
      setComparingCount(items.length);
    };

    checkAuth();
    updateComparingCount();

    // Listen for storage changes
    const handleStorageChange = (e?: StorageEvent) => {
      if (!e || e.key === 'auth-token') {
        checkAuth();
      }
      if (!e || e.key === 'comparing-products') {
        updateComparingCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for manual localStorage changes in the same tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (key === 'auth-token') {
        checkAuth();
      }
      if (key === 'comparing-products') {
        updateComparingCount();
      }
      originalSetItem.apply(this, [key, value]);
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('auth-token');
    
    // Clear cookie via API
    await fetch('/api/auth/logout', {
      method: 'POST'
    });
    
    // Full page reload
    window.location.href = '/';
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
          <Link 
            href="/compare"
            className="flex items-center gap-2 text-sm font-semibold text-teal-500 hover:text-teal-600 transition"
          >
            Compare
            {comparingCount > 0 && (
              <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {comparingCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">{userEmail}</span>
              </div>
              <Link 
                href="/profile"
                className="text-sm font-semibold text-teal-500 hover:text-teal-600 transition"
              >
                Settings
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