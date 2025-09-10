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
    } catch (err: any) {
      let errorMessage = "Failed to register";
      console.log(err);
      if (err?.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (err?.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (err?.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      dispatch(setError(errorMessage));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
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
          {loading ? "Loading..." : "Register"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
