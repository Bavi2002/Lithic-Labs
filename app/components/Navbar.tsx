'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logOut } from '../lib/firebase';
import { setUser } from '../redux/authSlice';
import { RootState } from '../redux/store';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    dispatch(setUser(null));
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <Link 
              href="/" 
              className="text-gray-800 text-xl font-bold hover:text-green-600 transition-colors duration-200"
              onClick={closeMenu}
            >
              CarBooking
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {user ? (
                <>
                  <Link
                    href="/bookings"
                    className="text-gray-600 hover:bg-green-50 hover:text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-green-200"
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/add-car"
                    className="text-gray-600 hover:bg-green-50 hover:text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-green-200"
                  >
                    Add Car
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-200 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:bg-green-50 hover:text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-green-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-all duration-200 border border-gray-200 hover:border-green-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-4 pt-2 pb-3 space-y-2 bg-green-50 border-t border-green-100">
          {user ? (
            <>
              <Link
                href="/bookings"
                className="text-gray-600 hover:bg-green-100 hover:text-green-700 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border border-transparent hover:border-green-200"
                onClick={closeMenu}
              >
                My Bookings
              </Link>
              <Link
                href="/add-car"
                className="text-gray-600 hover:bg-green-100 hover:text-green-700 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border border-transparent hover:border-green-200"
                onClick={closeMenu}
              >
                Add Car
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-100 hover:text-red-700 block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border border-red-200 hover:border-red-300 bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:bg-green-100 hover:text-green-700 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border border-transparent hover:border-green-200"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-md text-center"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}