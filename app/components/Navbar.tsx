'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../lib/firebase';
import { setUser } from '../redux/authSlice';
import { RootState } from '../redux/store';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logOut();
    dispatch(setUser(null));
  };

  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/">Home</Link>
        <div>
          {user ? (
            <>
              <Link href="/bookings" className="mr-4">Bookings</Link>
              <Link href="/add-car" className="mr-4">Add Car</Link>
              <button onClick={handleLogout} className="ml-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}