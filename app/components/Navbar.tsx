'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logOut } from '../lib/firebase';
import { setUser } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { GiCarWheel } from 'react-icons/gi';
import { CiMenuBurger } from 'react-icons/ci';
import { IoMdMenu } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

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
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center mr-3">
              <GiCarWheel />
            </div>
            <Link 
              href="/" 
              className="text-gray-800 text-xl font-bold "
              onClick={closeMenu}
            >
              <span className="text-xl font-black text-gray-900">
                Luxe<span className="text-green-500">Ride</span>
              </span>
            </Link>
          </div>

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
                    className="bg-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-all duration-200 border border-gray-200 hover:border-green-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
            
              <IoMdMenu className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}/>

              <RxCross2 className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-4 pt-2 pb-3 space-y-2 bg-white border-t border-green-100">
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
                className="bg-green-700 hover:from-green-700 hover:to-green-800 text-white block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-md text-center"
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