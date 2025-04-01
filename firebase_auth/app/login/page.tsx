"use client"
import { useState} from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore} from "@/firebase/firebase";
import { doc, getDoc, setDoc} from "firebase/firestore";
import Link from "next/link";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try{
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            if(user.emailVerified){
                const registrationData = localStorage.getItem("registrationData");
                const {
                    firstName = "",
                    lastName = "",
                    gender = "",

                } = registrationData ? JSON.parse(registrationData) : {};

                //Check if the userdata exist in the firebase

                const userDoc = await getDoc(doc(firestore, "users",user.uid));
                if(!userDoc.exists()){
                    await setDoc(doc(firestore, "users", user.uid),{
                        firstName,
                        lastName,
                        gender,
                        email: user.email,
                    });
                }
                router.push("/dashboard");
            }else {
                setError("Please verify your email before Logging In.");
            }
        } catch (error) {
            if ( error instanceof Error){
                setError(error.message);
            }else{
                setError("An unknown error occured");
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-orange-800 via-black to-black min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-white mb-6">Digi <span className="text-orange-500">Fines</span> SriLanka</h2>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-8 w-96">
                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                    <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full p-3 mt-1 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"/>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button  type="submit" className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-300">
                    Log In
                </button>
                </form>

                <p className="text-sm text-gray-400 mt-4 text-center">
                Dont have an account? <a href="/register" className="text-orange-500 hover:underline">Register Here</a>
                </p>
            </div>
            </div>

    );

};

export default LoginPage