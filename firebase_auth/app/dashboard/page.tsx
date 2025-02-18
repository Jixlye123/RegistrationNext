"use client"
import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore} from "@/firebase/firebase";
import { doc, getDoc, setDoc} from "firebase/firestore";
import { User } from "firebase/auth"

const DashboardPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if(user){
            setUser(user);
            
              const userDoc = await getDoc(doc(firestore, "users",user.uid));
              if(userDoc.exists()){
                const userData = userDoc.data();
                setUserName(`${userData.firstName} ${userData.lastName}`);
              }
            }else {
                router.push("/login");
            }
            setLoading(false);
      });   
      return () => unsubscribe();
    },[router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        }catch(error){
            console.error("Logout error: ", error);
        }
    };

    const handleChangePassword = () => {
        router.push("/changepassword");
    };

    const handleHomePageButton = () => {
        router.push("/");
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return(
        <div className="min-h-screen bg-gradient-to-b from-orange-900 via-black to-black flex flex-col">
        {/* Navbar */}
        <nav className="bg-white/10 backdrop-blur-md border border-white/20 shadow-md p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Dashboard</h1>
            </div>
        </nav>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-grow">
            {username && (
            <h1 className="text-4xl font-bold text-white mb-6">
                Welcome, {username}
            </h1>
            )}

            <div className="space-x-4">
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
            >
                Logout
            </button>

            {/* Change Password Button */}
            <button
                onClick={handleChangePassword}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
                Change Password
            </button>
            <button
                onClick={handleHomePageButton}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
                Go to Homepage
            </button>

            </div>
        </main>
        </div>

    );

};

export default DashboardPage
