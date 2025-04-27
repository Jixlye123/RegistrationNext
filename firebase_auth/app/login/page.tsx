"use client"
import { useState} from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore} from "@/firebase/firebase";
import { doc, getDoc, setDoc} from "firebase/firestore";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            if (user.emailVerified) {
                // Check if the user is an admin
                if (user.email === "sethjinuka@gmail.com") {
                    router.push("/admin");
                    return;
                }
    
                // Normal user login
                const registrationData = localStorage.getItem("registrationData");
                const { firstName = "", lastName = "", gender = "" } = registrationData ? JSON.parse(registrationData) : {};
    
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (!userDoc.exists()) {
                    await setDoc(doc(firestore, "users", user.uid), {
                        firstName,
                        lastName,
                        gender,
                        email: user.email,
                    });
                }
                router.push("/");
            } else {
                setError("Please verify your email before logging in.");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-800 via-black to-black">
            <h2 className="mb-6 text-4xl font-bold text-white">Digi <span className="text-orange-500">Fines</span> SriLanka</h2>

            <div className="p-8 border shadow-lg bg-white/10 backdrop-blur-md border-white/20 rounded-2xl w-96">
                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 mt-1 text-white bg-gray-800 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"/>
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                    <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full p-3 mt-1 text-white bg-gray-800 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"/>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button  type="submit" className="w-full py-3 mt-4 font-semibold text-white transition duration-300 bg-orange-600 rounded-lg shadow-md hover:bg-orange-700">
                    Log In
                </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-400">
                Dont have an account? <a href="/register" className="text-orange-500 hover:underline">Register Here</a>
                </p>
            </div>
            </div>

    );

};

export default LoginPage