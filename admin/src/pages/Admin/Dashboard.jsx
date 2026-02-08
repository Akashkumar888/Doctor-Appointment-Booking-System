import React, { useContext, useEffect, useState } from "react";
import AdminContext from "../../context/AdminContext";
import AppContext from "../../context/AppContext";
import { assets } from "../../assets/assets";
import api from "../../api/axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { aToken, adminDashData, dashData, cancelAppointment } =
    useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  // 🔐 RESET PASSWORD STATES
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // LOAD DASHBOARD
  useEffect(() => {
    if (aToken) {
      adminDashData();
    }
  }, [aToken, adminDashData]);

  // 🔐 RESET PASSWORD FUNCTION (ADMIN ONLY)
  const resetPassword = async () => {
    if (!selectedDoctorId) {
      return toast.error("Please select a doctor");
    }

    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/admin/reset-doctor-password", {
        doctorId: selectedDoctorId,
        newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        setShowResetModal(false);
        setNewPassword("");
        setSelectedDoctorId("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!dashData) return null;

  return (
    <div className="m-5">
      {/* STATS */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border">
          <img className="w-14" src={assets.doctor_icon} />
          <div>
            <p className="text-xl font-semibold">{dashData.doctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border">
          <img className="w-14" src={assets.appointments_icon} />
          <div>
            <p className="text-xl font-semibold">{dashData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border">
          <img className="w-14" src={assets.patients_icon} />
          <div>
            <p className="text-xl font-semibold">{dashData.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* LATEST BOOKINGS */}
      <div className="bg-white mt-10 rounded">
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <img src={assets.list_icon} />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        {dashData.latestAppointments.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
          >
            <img className="rounded-full w-10" src={item.docData.image} />

            <div className="flex-1 text-sm">
              <p className="font-medium">{item.docData.name}</p>
              <p className="text-gray-500">{slotDateFormat(item.slotDate)}</p>
            </div>

            <button
              onClick={() => {
                setSelectedDoctorId(item.docData._id);
                setShowResetModal(true);
              }}
              className="text-blue-600 text-xs underline"
            >
              Reset Password
            </button>

            {!item.cancelled && !item.isComplete && (
              <img
                onClick={() => cancelAppointment(item._id)}
                className="w-8 cursor-pointer"
                src={assets.cancel_icon}
              />
            )}
          </div>
        ))}
      </div>

      {/* RESET PASSWORD MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-semibold mb-3">
              Reset Doctor Password
            </h2>

            <input
              type="password"
              className="border w-full p-2 rounded"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="border px-4 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={resetPassword}
                disabled={loading}
                className="bg-[#5F6FFF] text-white px-4 py-1 rounded cursor-pointer"
              >
                {loading ? "Saving..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
