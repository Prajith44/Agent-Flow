"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/auth/local/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Reset failed");
      return;
    }

    // ✅ IMPORTANT PART
    router.push("/signin");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-11 mb-4 rounded-lg border px-3 text-gray-900 placeholder-gray-500"
        />

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-11 mb-4 rounded-lg border px-3 text-gray-900 placeholder-gray-500"
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <button
          onClick={handleReset}
          className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Reset Password
        </button>
      </div>
    </main>
  );
}
