import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  useLocation();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow">
      <Link to={token ? "/home" : "/login"} className="text-2xl font-bold">NayePankh Foundation</Link>
      <div className="flex items-center gap-5">
        <Link to="/home" className="hover:text-blue-200">Home</Link>
        {!token || !user ? (
          <>
            <Link to="/login" className="hover:text-blue-200">Login</Link>
            <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">Sign Up</Link>
          </>
        ) : (
          <>
            {user.role === "volunteer" && <>
              <Link to="/volunteer/dashboard" className="hover:text-blue-200">Volunteer Dashboard</Link>
              <Link to="/volunteer" className="hover:text-blue-200">Apply / Volunteer</Link>
            </>}
            {user.role === "admin" && <Link to="/admin" className="hover:text-blue-200">Admin Dashboard</Link>}
            <button onClick={logout} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
