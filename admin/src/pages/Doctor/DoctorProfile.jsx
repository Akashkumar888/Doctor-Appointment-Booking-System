import React, { useContext, useEffect, useState } from "react";
import DoctorContext from "../../context/DoctorContext";
import { toast } from "react-toastify";
import api from "../../api/axios";
import AppContext from "../../context/AppContext";

const DoctorProfile = () => {
  const { dToken, getDoctorProfile, profileData, setProfileData } =
    useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateDoctorProfile = async () => {
    try {
    const updateData={
      address:profileData.address,
      fees:profileData.fees,
      available:profileData.available
    };

      const { data } = await api.post(
        `/api/doctor/update-profile`,
        updateData);
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getDoctorProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getDoctorProfile();
    }
  }, [dToken]);

  return (
    <div className="">
      <div className="flex flex-col gap-4 m-5">
        <div>
          <img
            className="bg-[#5F6FFF]/80 w-full sm:max-w-64 rounded-lg"
            src={profileData.image}
            alt=""
          />
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          {/* nam dgree experience  */}
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {profileData.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {profileData.experience}
            </button>
          </div>

          {/* doc about  */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
              About:
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {profileData.about}
            </p>
          </div>
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currencySymbol}{" "}
              {isEdit ? (
                <input
                  type="number"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fees: e.target.value })
                  }
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>
          <div className="flex gap-2 py-2">
            <p>Address: </p>
            <p className="text-sm">
              {isEdit ? (
                <input
                  type="text"
                  value={profileData.address.line1}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      address: {
                        ...profileData.address,
                        line1: e.target.value,
                      },
                    })
                  }
                />
              ) : (
                profileData?.address?.line1
              )}
              <br />
              {isEdit ? (
                <input
                  type="text"
                  value={profileData.address.line2}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      address: {
                        ...profileData.address,
                        line2: e.target.value,
                      },
                    })
                  }
                />
              ) : (
                profileData?.address?.line2
              )}
            </p>
          </div>

          <div className="flex gap-1 pt-2 items-center">
            <input
              onChange={() =>
                isEdit &&
                setProfileData({
                  ...profileData,
                  available: !profileData.available, // ✅ toggle current state
                })
              }
              readOnly={!isEdit} // ✅ only editable in edit mode
              type="checkbox"
              id="available"
              checked={profileData.available}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <label htmlFor="available" className="text-sm">
              Available
            </label>
          </div>
          {
            !isEdit ? <button
            onClick={() => setIsEdit(true)}
            className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 hover:bg-[#5F6FFF] hover:text-white transition-all cursor-pointer"
          >
            Edit
          </button>
          : 
          <button
            onClick={updateDoctorProfile} // if not send any parametre then simple if send then ()=> use this 
            className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 hover:bg-[#5F6FFF] hover:text-white transition-all cursor-pointer"
          >
            Save Changes
          </button>
          }
          
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;

// 🧠 Concept
// These two props (value + onChange) make an input a controlled component — meaning React (not the DOM) owns and updates the data.
// You use this only for form or editable UI elements such as:

// ✅ Element	            Example
// <input>	               text, number, checkbox, radio, etc.
// <textarea>	             multi-line input
// <select>	               dropdowns
// <range>	               sliders
// <date>	                 date/time pickers
