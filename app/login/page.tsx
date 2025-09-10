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
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
