import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getApiError } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await api.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      navigate("/login", { replace: true, state: { message: "Account created. Please log in." } });
    } catch (requestError) {
      setError(getApiError(requestError, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50 px-4"><div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
    <h1 className="text-3xl font-bold text-center text-gray-800">Create Account</h1>
    <p className="text-gray-500 mt-2 mb-6 text-center">All public accounts are volunteer accounts.</p>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Full name" className="w-full border border-gray-300 rounded-lg px-4 py-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-lg px-4 py-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password (minimum 6 characters)" className="w-full border border-gray-300 rounded-lg px-4 py-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength="6" />
      <input type="password" placeholder="Confirm password" className="w-full border border-gray-300 rounded-lg px-4 py-3" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required minLength="6" />
      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold">{loading ? "Creating account..." : "Create Account"}</button>
    </form>
    <p className="text-center text-gray-600 mt-6">Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Login</Link></p>
  </div></div>;
}
