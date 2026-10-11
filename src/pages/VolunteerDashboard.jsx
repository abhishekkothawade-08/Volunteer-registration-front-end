import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authConfig, clearSession, getApiError, getStoredUser } from "../api";

export default function VolunteerDashboard() {
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useMemo(() => getStoredUser(), []);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const loadApplication = async () => {
      try {
        const res = await api.get("/volunteers/my-application", authConfig());
        setApplication(res.data.volunteer);
      } catch (requestError) {
        if (requestError.response?.status === 404) {
          setApplication(null);
        } else if (requestError.response?.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
        } else {
          setError(getApiError(requestError, "Unable to load your volunteer application."));
        }
      } finally {
        setLoading(false);
      }
    };

    void loadApplication();
  }, [navigate, user]);

  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getStatusMessage = (status) => {
    if (status === "Approved") {
      return "Congratulations! Your volunteer application has been approved.";
    }

    if (status === "Rejected") {
      return "Your application has been rejected. Please contact the administration for more information.";
    }

    return "Your application is currently under review by the administration.";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-700">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Volunteer Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back,{" "}
            <span className="font-semibold text-gray-800">
              {user?.name || "Volunteer"}
            </span>
          </p>

        </div>

        {/* Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Profile Details
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="font-semibold text-gray-800">
                  {user?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold text-gray-800">
                  {user?.email || "-"}
                </p>
              </div>

              {application && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="font-semibold text-gray-800">
                      {application.phone || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      City
                    </p>

                    <p className="font-semibold text-gray-800">
                      {application.city || "-"}
                    </p>
                  </div>
                </>
              )}

            </div>

          </div>

          {/* Volunteer Hours */}
          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Volunteer Hours
            </h2>

            <div className="flex items-center justify-center h-32">

              <div className="text-center">

                <p className="text-5xl font-bold text-blue-600">
                  {application?.volunteerHours || 0}
                </p>

                <p className="text-gray-500 mt-2">
                  Hours Completed
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Application */}
        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Volunteer Application
              </h2>

              <p className="text-gray-500 mt-1">
                Track your volunteer application status.
              </p>
            </div>

            {!application && (
              <button
                onClick={() => navigate("/volunteer")}
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold"
              >
                Apply Now
              </button>
            )}

          </div>

          {!application ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">

              <h3 className="text-lg font-semibold text-gray-700">
                No Volunteer Application Found
              </h3>

              <p className="text-gray-500 mt-2">
                You haven't submitted a volunteer application yet.
              </p>

              <button
                onClick={() => navigate("/volunteer")}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold"
              >
                Submit Application
              </button>

            </div>
          ) : (
            <>

              {/* Status */}
              <div className="border rounded-xl p-6 mb-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Application Status
                    </p>

                    <span
                      className={`inline-block mt-2 px-4 py-2 rounded-full font-semibold ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <div className="text-left md:text-right">

                    <p className="text-sm text-gray-500">
                      Submitted
                    </p>

                    <p className="font-semibold text-gray-800">
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                  </div>

                </div>

                <p className="text-gray-600 mt-5">
                  {getStatusMessage(application.status)}
                </p>

                {application.adminRemarks && (
                  <p className="mt-4 rounded-lg bg-gray-50 p-4 text-gray-700">
                    <span className="font-semibold">Admin remarks: </span>
                    {application.adminRemarks}
                  </p>
                )}

              </div>

              {/* Application Details */}
              <div>

                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Application Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Age
                    </p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {application.age || "-"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      City
                    </p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {application.city || "-"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Skills
                    </p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {application.skills || "-"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Availability
                    </p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {application.availability || "-"}
                    </p>
                  </div>

                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-5">

                  <p className="text-sm text-gray-500">
                    Why do you want to volunteer?
                  </p>

                  <p className="text-gray-800 mt-2">
                    {application.reason || "-"}
                  </p>

                </div>

              </div>

            </>
          )}

          {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

        </div>

      </div>

    </div>
  );
}
