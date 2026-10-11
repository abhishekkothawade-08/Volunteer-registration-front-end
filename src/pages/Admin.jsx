import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authConfig, clearSession, getApiError } from "../api";

export default function Admin() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const handleAccessError = useCallback((requestError) => {
    if (requestError.response?.status === 401) {
      clearSession();
      navigate("/login", { replace: true });
      return true;
    }
    if (requestError.response?.status === 403) {
      navigate("/volunteer/dashboard", { replace: true });
      return true;
    }
    return false;
  }, [navigate]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [volunteersResponse, statsResponse] = await Promise.all([
        api.get("/volunteers", authConfig()),
        api.get("/volunteers/stats", authConfig()),
      ]);
      setVolunteers(volunteersResponse.data.volunteers);
      setStats(statsResponse.data);
    } catch (requestError) {
      if (!handleAccessError(requestError)) setError(getApiError(requestError, "Unable to load the admin dashboard."));
    } finally {
      setLoading(false);
    }
  }, [handleAccessError]);

  useEffect(() => {
    void Promise.resolve().then(loadDashboard);
  }, [loadDashboard]);

  const updateStatus = async (id, status) => {
    const adminRemarks = window.prompt(`Optional remarks for this ${status.toLowerCase()} decision:`);
    if (adminRemarks === null) return;
    setActionId(id);
    try {
      await api.put(`/volunteers/${status.toLowerCase()}/${id}`, { adminRemarks }, authConfig());
      await loadDashboard();
    } catch (requestError) {
      if (!handleAccessError(requestError)) setError(getApiError(requestError, `Unable to ${status.toLowerCase()} this application.`));
    } finally { setActionId(""); }
  };

  const deleteVolunteer = async (id) => {
    if (!window.confirm("Delete this volunteer application? This cannot be undone.")) return;
    setActionId(id);
    try {
      await api.delete(`/volunteers/${id}`, authConfig());
      await loadDashboard();
    } catch (requestError) {
      if (!handleAccessError(requestError)) setError(getApiError(requestError, "Unable to delete this application."));
    } finally { setActionId(""); }
  };

  const statusClass = (status) => status === "Approved" ? "bg-green-100 text-green-700" : status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl font-semibold">Loading Admin Dashboard...</p></div>;

  return <div className="min-h-screen bg-gray-50 p-6"><div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"><div><h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1><p className="text-gray-500 mt-1">Review and manage volunteer applications.</p></div><button onClick={loadDashboard} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium">Refresh</button></div>
    {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">{[["Total Volunteers", stats.total, "border-blue-500"], ["Pending", stats.pending, "border-yellow-500"], ["Approved", stats.approved, "border-green-500"], ["Rejected", stats.rejected, "border-red-500"]].map(([label, value, borderColor]) => <div key={label} className={`bg-white rounded-xl shadow p-6 border-l-4 ${borderColor}`}><p className="text-gray-500 text-sm">{label}</p><p className="text-3xl font-bold text-gray-800 mt-2">{value}</p></div>)}</div>
    <div className="bg-white rounded-xl shadow overflow-hidden"><div className="p-6 border-b"><h2 className="text-xl font-bold text-gray-800">Volunteer Applications</h2></div>
      {!volunteers.length ? <p className="p-10 text-center text-gray-500 text-lg">No volunteer applications found.</p> : <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50 text-sm text-gray-600">{["Name", "Email", "Phone", "Age", "City", "Skills", "Availability", "Status", "Actions"].map((heading) => <th key={heading} className="px-4 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y">{volunteers.map((volunteer) => <tr key={volunteer._id} className="hover:bg-gray-50"><td className="px-4 py-4 font-medium">{volunteer.name}</td><td className="px-4 py-4">{volunteer.email}</td><td className="px-4 py-4">{volunteer.phone}</td><td className="px-4 py-4">{volunteer.age}</td><td className="px-4 py-4">{volunteer.city}</td><td className="px-4 py-4">{volunteer.skills}</td><td className="px-4 py-4">{volunteer.availability}</td><td className="px-4 py-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(volunteer.status)}`}>{volunteer.status}</span>{volunteer.adminRemarks && <p className="mt-2 max-w-40 text-xs text-gray-500">{volunteer.adminRemarks}</p>}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><button disabled={actionId === volunteer._id || volunteer.status === "Approved"} onClick={() => updateStatus(volunteer._id, "Approve")} className="bg-green-600 disabled:bg-gray-300 text-white px-3 py-1.5 rounded-lg text-sm">Approve</button><button disabled={actionId === volunteer._id || volunteer.status === "Rejected"} onClick={() => updateStatus(volunteer._id, "Reject")} className="bg-yellow-500 disabled:bg-gray-300 text-white px-3 py-1.5 rounded-lg text-sm">Reject</button><button disabled={actionId === volunteer._id} onClick={() => deleteVolunteer(volunteer._id)} className="bg-red-600 disabled:bg-gray-300 text-white px-3 py-1.5 rounded-lg text-sm">Delete</button></div></td></tr>)}</tbody></table></div>}
    </div>
  </div></div>;
}
