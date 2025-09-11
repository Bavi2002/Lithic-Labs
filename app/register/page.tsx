"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../lib/firebase";
import { setLoading, setError, setUser } from "../redux/authSlice";
import { useRouter } from "next/navigation";
import type { RootState } from "../redux/store";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const userCredential = await signUp(email, password);
      dispatch(setUser(userCredential.user));
      router.push("/bookings");
    } catch (err: unknown) {
      let errorMessage = "Failed to register";
      console.log(err);

      if (typeof err === "object" && err !== null) {
        const error = err as { code?: string; message?: string };

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already in use.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password should be at least 6 characters.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      dispatch(setError(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-400 overflow-hidden">
          <div className="bg-green-700 px-8 py-10 text-center">
           
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-green-100 text-sm">Join us today and get started</p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg  bg-gray-50 text-gray-900 placeholder-gray-500"
                    required
                  />
                
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg  bg-gray-50  text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Register</span>
                   
                  </div>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>

   
      </div>
    </div>
  );
}