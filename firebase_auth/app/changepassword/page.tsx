"use client";
import { useState, FormEvent} from "react";
import { useRouter } from "next/navigation";
import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

const PasswordChangePage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const[error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handlePasswordChange = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (newpassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const user = auth.currentUser;
            if(user && user.email){
                const credential = EmailAuthProvider.credential(
                    user.email,
                    currentPassword
                );
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newpassword);
                setMessage("Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }else{
                setError("Email is not verified");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An error occurred");
            }
            }

        };

        return (
            <div className="flex flex-col items-center bg-gradient-to-b from-orange-900 via-black to-black justify-center min-h-screen bg-gray-100">
                    <div className="w-full max-w-md p-6 bg-white/20 backdrop-blur-lg border border-black rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">
                        Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div>
                            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-300">Current Password</label>
                            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="text-sm font-medium text-gray-300">New Password</label>
                            <input id="password" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} type="text" required className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
                            <input id="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="text" required className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {message && <p className="text-green-500 text-sm">{message}</p>}
                        <button  type="submit" className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-300">
                            Change Password
                        </button>

                    </form>
                 </div>   
            </div>
        );


};

export default PasswordChangePage;
