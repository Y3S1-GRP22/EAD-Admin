import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import background from "../../assets/admin.avif";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "../CommonLayout/ConfirmationModal";

export default function UserProfile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { logout } = useAuth();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("auth"));
    if (userData && userData.user) {
      const { fullName, email, contact, id, role } = userData.user;
      setFullName(fullName);
      setEmail(email);
      setContact(contact);
      setId(id);
      setRole(role);
    }
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("auth"));
      const token = userData.accessToken;
      const { data } = await axios.put(
        `http://localhost:8090/v1/users/${id}`,
        {
          fullName,
          email,
          password,
          contact,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("You've updated your account successfully.");
        localStorage.removeItem("auth");
        localStorage.removeItem("isLoggedIn");
        logout();
        navigate("/signin");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while deleting the user.");
      }
    }
  };

  const deleteProfile = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("auth"));
      const token = userData.accessToken;
      const { data } = await axios.delete(
        `http://localhost:8090/v1/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("You've deleted your account successfully.");
        localStorage.removeItem("auth");
        localStorage.removeItem("isLoggedIn");
        logout();
        navigate("/signup");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while deleting the user.");
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      <div
        className="flex min-h-screen justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${background})`,
          width: "100%",
          height: "100%",
        }}
      >
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center text-black text-2xl font-semibold italic">
              <FontAwesomeIcon className="mr-[10px]" icon={faBook} />
              LearnHub
            </div>
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Your User Profile
            </h2>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="mt-6 space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    className="block p-5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                    value={fullName}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block p-5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Contact Number
                </label>
                <div className="mt-2">
                  <input
                    id="contact"
                    name="contact"
                    type="number"
                    autoComplete="contact"
                    required
                    className="block p-5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                    value={contact}
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={updateProfile}
                  className="flex-1 justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={deleteProfile}
                  className="flex-1 justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Delete Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}
