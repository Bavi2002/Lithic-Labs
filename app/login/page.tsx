"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../lib/firebase";
import { setLoading, setError, setUser } from "../redux/authSlice";
import { useRouter } from "next/navigation";
import type { RootState } from "../redux/store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const userCredential = await logIn(email, password);
      dispatch(setUser(userCredential.user));
      router.push("/bookings");
    } catch (err: unknown) {
      let errorMessage = "Failed to log in";

      if (typeof err === "object" && err !== null) {
        const error = err as { code?: string; message?: string };

        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email.";
        } else if (error.code === "auth/invalid-credential") {
          errorMessage = "Invalid credentials provided.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
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
        <div className="bg-white rounded-2xl border border-gray-400 overflow-hidden">
          <div className="bg-green-700 px-8 py-10 text-center">
          
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-green-100 text-sm">Sign in to your account</p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg  bg-gray-50  text-gray-900 placeholder-gray-500"
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
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg  bg-gray-50  text-gray-900 placeholder-gray-500"
                    required
                  />
                  
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02]  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Login</span>
                    
                  </div>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </form>


            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/register" className="font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
}