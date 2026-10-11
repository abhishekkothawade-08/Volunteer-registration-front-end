import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api, getApiError, getStoredUser } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const user = getStoredUser();
      navigate(user?.role === "admin" ? "/admin" : "/volunteer/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/volunteer/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 bg-gray-50"><div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
    <h1 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
    <p className="text-center text-gray-500 mt-2 mb-6">Login to NayePankh Foundation</p>
    {location.state?.message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{location.state.message}</p>}
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" name="email" placeholder="Email address" className="border border-gray-300 w-full p-3 rounded-lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" name="password" placeholder="Password" className="border border-gray-300 w-full p-3 rounded-lg" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white w-full py-3 rounded-lg font-semibold" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
    <p className="text-center text-gray-600 mt-6">Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign Up</Link></p>
  </div></div>;
}
