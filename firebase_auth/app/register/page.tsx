"use client";
import { useState, FormEvent} from "react";
import { useRouter } from "next/navigation";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[confirmPassword, setConfirmPassword] = useState("");
    const[error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const handleRegister = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            await sendEmailVerification(user); 

            //temporary store user data

            localStorage.setItem(
                "registrationData",
                JSON.stringify({
                    firstName,
                    lastName,
                    gender,
                    email,
                })
            );

            setMessage(
                "Registration successful. Please check your email for verification."
            );

            //clear form fields
            setFirstName("");
            setLastName("");
            setGender("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (error){
            if (error instanceof Error){
                setError(error.message);
            } else{
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-orange-900 via-black to-black min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-white mb-6">Register</h2>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 w-96">
            <form className="space-y-6">
            {/* First & Last Name (Side by Side) */}
            <div className="flex space-x-4">
                <div className="w-1/2">
                <label className="text-sm font-medium text-gray-300">First Name</label>
                <input type="text" className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
                </div>

                <div className="w-1/2">
                <label className="text-sm font-medium text-gray-300">Last Name</label>
                <input type="text" className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
                </div>
            </div>

            {/* Gender */}
            <div>
                <label className="text-sm font-medium text-gray-300">Gender</label>
                <select className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                </select>
            </div>

            {/* Email */}
            <div>
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input type="email" className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
            </div>

            {/* Password */}
            <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input type="password" className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <input type="password" className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-300">
                Sign Up
            </button>
            </form>

            {/* Login Link */}
            <p className="text-sm text-gray-400 mt-4 text-center">
            Already have an account? <a href="/login" className="text-orange-500 hover:underline">Log In</a>
            </p>
        </div>
        {message && <p className="text-green-500 text-sm">{message}</p>}

        </div>

    );
}

export default Register