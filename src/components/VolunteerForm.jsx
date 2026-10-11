import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authConfig, clearSession, getApiError } from "../api";

const initialForm = { phone: "", age: "", city: "", skills: "", availability: "", reason: "" };

export default function VolunteerForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 16 || age > 120) {
      setError("Please enter an age between 16 and 120.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/volunteers", form, authConfig());
      navigate("/volunteer/dashboard", { replace: true });
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        clearSession();
        navigate("/login", { replace: true });
        return;
      }
      if (requestError.response?.status === 403) {
        navigate("/admin", { replace: true });
        return;
      }
      setError(getApiError(requestError, "Volunteer application could not be submitted."));
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-10"><div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8">
    <h1 className="text-3xl font-bold text-center text-gray-800">Volunteer Application</h1>
    <p className="text-center text-gray-500 mt-2 mb-6">Your name and email are taken securely from your account.</p>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="border p-3 w-full rounded" name="phone" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
      <input className="border p-3 w-full rounded" type="number" name="age" min="16" max="120" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
      <input className="border p-3 w-full rounded" name="city" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
      <input className="border p-3 w-full rounded" name="skills" placeholder="Skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} required />
      <input className="border p-3 w-full rounded" name="availability" placeholder="Availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} required />
      <textarea className="border p-3 w-full rounded" name="reason" placeholder="Why do you want to volunteer?" rows="4" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
      <button className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white w-full py-3 rounded font-semibold" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Application"}</button>
    </form>
  </div></div>;
}
