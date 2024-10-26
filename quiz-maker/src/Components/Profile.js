import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

const Profile = () => {
    const navigate = useNavigate();
    if (!localStorage.getItem("token") || localStorage.getItem("token") === null) {
        navigate("/login");
    }

    const [user, setUser] = useState({ username: "", email: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = process.env.REACT_APP_BACKEND_URL + "/users/me";
                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                console.log(data);
                setUser(data);
                setUsername(data.username);
                setEmail(data.email);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [newUsername, setNewUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (!passwordRegex.test(value)) {
            setPasswordError("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
        } else {
            setPasswordError("");
        }
        if (value !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value !== password) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        if (newUsername.length <= 6) {
            setUsernameError("Username must be longer than 6 characters.");
        } else if (newUsername.includes(" ")) {
            setUsernameError("Username should not contain spaces.");
        } else {
            setUsernameError("");
            try {
                const url = process.env.REACT_APP_BACKEND_URL + "/users/update-username";
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ username: newUsername }),
                });
                const data = await response.json();
                if (!response.ok) {
                    setUsernameError(data.msg || "Failed to update username. Please try again.");
                } else {
                    toast.success("Username updated successfully", { position: "top-center", autoClose: 3000, theme: "colored" });
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error updating username:", error);
                setUsernameError("Error updating username. Please try again.");
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordError === "" && confirmPasswordError === "" && password !== "") {
            try {
                const url = `${process.env.REACT_APP_BACKEND_URL}/users/update-password`;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ password, oldPassword }),
                });
                const data = await response.json();
                if (!response.ok) {
                    if (data.msg === "Invalid old password") {
                        setOldPasswordError(data.msg);
                    } else {
                        setPasswordError(data.msg || "Failed to update password. Please try again.");
                    }
                } else {
                    toast.success("Password updated successfully", { position: "top-center", autoClose: 3000, theme: "colored" });
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error updating password:", error);
                setPasswordError("Error updating password. Please try again.");
            }
        }
    };

    return (
        <div className="bg-[#0d1b2a] rounded-xl ml-1 h-[88vh] w-[80vw] fixed overflow-scroll flex flex-col pl-5 text-white mx-auto">
            <div className="sticky top-0 z-40 bg-[#0d1b2a] h-20">
                <h1 className="text-5xl font-serif p-4">Profile</h1>
                <hr className="bg-gray-400 h-[1px]" />
            </div>
            <div className="profile-info mt-7 ml-7 flex flex-col bg-white text-[#2d3b45] p-5 rounded-lg w-full max-w-sm mb-16 border border-[#235] shadow-md">
                <div className="flex justify-between mb-2">
                    <span className="font-bold">Username:</span>
                    <span className="text-gray-500">{username}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-bold">Email:</span>
                    <span className="text-gray-500">{email}</span>
                </div>
            </div>
            <div className="flex justify-around gap-5 w-full flex-wrap">
                <div className="profile-card bg-[#1a2a33e9] p-5 rounded-lg w-full max-w-lg shadow-md">
                    <form onSubmit={handleUsernameSubmit}>
                        <h3 className="mb-4">Update Username</h3>
                        <div className="form-group mb-4">
                            <label htmlFor="newUsername" className="block mb-2 text-[#b0c4de]">New Username:</label>
                            <input type="text" id="newUsername" value={newUsername} onChange={handleUsernameChange} required className="w-full p-3 rounded bg-[#13212c] text-white focus:outline-none focus:shadow-[0_0_5px_#1a2a33]" />
                            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
                        </div>
                        <button type="submit" className="px-4 py-2 rounded bg-[#212c34] text-white transition duration-300 hover:bg-[#13212c]">Update Username</button>
                    </form>
                </div>
                <div className="profile-card bg-[#1a2a33e9] p-5 rounded-lg w-full max-w-lg shadow-md">
                    <form onSubmit={handlePasswordSubmit}>
                        <h3 className="mb-4">Update Password</h3>
                        <div className="form-group mb-4">
                            <label htmlFor="oldPassword" className="block mb-2 text-[#b0c4de]">Old Password:</label>
                            <input type="password" id="oldPassword" value={oldPassword} onChange={handleOldPasswordChange} required className="w-full p-3 rounded bg-[#13212c] text-white focus:outline-none focus:shadow-[0_0_5px_#1a2a33]" />
                            {oldPasswordError && <p className="text-red-500 text-sm">{oldPasswordError}</p>}
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="password" className="block mb-2 text-[#b0c4de]">New Password:</label>
                            <input type="password" id="password" value={password} onChange={handlePasswordChange} required className="w-full p-3 rounded bg-[#13212c] text-white focus:outline-none focus:shadow-[0_0_5px_#1a2a33]" />
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="confirmPassword" className="block mb-2 text-[#b0c4de]">Confirm Password:</label>
                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required className="w-full p-3 rounded bg-[#13212c] text-white focus:outline-none focus:shadow-[0_0_5px_#1a2a33]" />
                            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                        </div>
                        <button type="submit" className="px-4 py-2 rounded bg-[#212c34] text-white transition duration-300 hover:bg-[#13212c]">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;