'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MobileMenuProps {
  isAuthenticated: boolean;
  userEmail: string;
  comparingCount: number;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isAuthenticated,
  userEmail,
  comparingCount,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  return (
    <div className="sm:hidden relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-gray-200 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={closeMenu}
          />
          
          {/* Menu */}
          <div
            className="fixed w-64 bg-white rounded-lg shadow-xl border border-gray-300 z-50 overflow-hidden"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
            }}
          >
            <div className="p-3 space-y-2">
              {/* Compare Link */}
              <Link
                href="/compare"
                onClick={closeMenu}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition block w-full"
              >
                <span>Compare</span>
                {comparingCount > 0 && (
                  <span className="ml-auto bg-teal-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {comparingCount}
                  </span>
                )}
              </Link>

              <hr className="border-gray-200 my-2" />

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 rounded-lg truncate">
                    {userEmail}
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition block w-full"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu();
                      onLogout();
                    }}
                    className="w-full px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition block w-full"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="px-3 py-2.5 text-sm font-semibold bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition block text-center w-full"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
