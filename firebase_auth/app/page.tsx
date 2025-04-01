"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth,firestore } from '@/firebase/firebase';
import { doc, getDoc} from "firebase/firestore";
import type { User } from "firebase/auth";
import Link from "next/link";
import '../app/globals.css';

const HomePage = () => {
  const[loading, setLoading] = useState(true);
  const[user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if(user){
      if(user.emailVerified) {
        const userDoc = await getDoc(doc(firestore, "users",user.uid));

        if(userDoc.exists()){
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
        }
        
        }
        setUser(user);
    }

    setLoading(false);
  });
  return () => unsubscribe();
}, [router]);

if (loading) {
  return <p className="text-center">Loading...</p>;
}

  return(
    <div>
      
    
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold">
            Digi <span className="text-orange-500">Fines</span>
            <br /> Sri Lanka
          </h1>
        </div>
        <div className="flex space-x-4 items-center">
          {user && userName ? (
            <span className="text-orange-500 font-bold">{"Hello, " + userName}</span>
          ) : null}
          
          <div className="space-x-4">
            <Link href="/register" className="px-4 py-2 bg-orange-500 text-black font-bold rounded-md hover:bg-orange-600">
              SIGN UP
            </Link>
            <Link href="/login" className="px-4 py-2 bg-orange-500 text-black font-bold rounded-md hover:bg-orange-600">
              LOG IN
            </Link>

            </div>
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className="bg-gray-200 py-4 shadow-md">
          <div className="flex justify-center space-x-8 text-black font-semibold">
            <Link href="/">HOME</Link>
            <Link href="/payfines">PAY FINES</Link>
            <Link href="/checkviolations">CHECK VIOLATIONS</Link>
            <Link href="/disputefines">DISPUTE FINES</Link>
          </div>
        </nav>

        {/* How It Works Section */}
        <section className="max-w-6xl mx-auto mt-10 flex flex-col md:flex-row items-center justify-center mr-4">
          <img src="/9414772.jpg" alt="How It Works" width={450} height={250} className="w-full md:w-1/3 rounded-lg shadow-lg" />
          <div className="md:w-1/2 p-6">
            <h2 className="text-3xl font-bold border-b-4 border-orange-500 inline-block mb-6">HOW IT WORKS</h2>
            <ol className="space-y-4 text-lg ml-6 md:ml-0">
              <li><span className="font-bold">1. Violation Detection:</span> Traffic violations are captured using cameras & officers.</li>
              <li><span className="font-bold">2. Notification:</span> Offenders receive email notifications with violation details, including evidence like photos or videos.</li>
              <li><span className="font-bold">3. Payment:</span> Pay fines quickly and securely online via PayHere.</li>
              <li><span className="font-bold">4. Dispute:</span> Submit an appeal online if you believe a fine is incorrect.</li>
            </ol>
          </div>
        </section>
        <section className="max-w-6xl mx-auto mt-10">
          <h2 className="text-3xl font-bold border-b-4 border-orange-500 inline-block">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            <details className="p-4 bg-gray-800 text-white rounded-lg">
              <summary className="cursor-pointer font-bold">How do I check my fines?</summary>
              <p className="mt-2">Simply enter your vehicle number or ID to view your fines.</p>
            </details>
            <details className="p-4 bg-gray-800 text-white rounded-lg">
              <summary className="cursor-pointer font-bold">Can I dispute a fine online?</summary>
              <p className="mt-2">Yes! Click on &apos;Dispute Fines&apos; and follow the steps to submit an appeal.</p>
            </details>
            <details className="p-4 bg-gray-800 text-white rounded-lg">
              <summary className="cursor-pointer font-bold">What payment methods are supported?</summary>
              <p className="mt-2">We accept credit/debit cards, PayPal, and other online payment methods.</p>
            </details>
          </div>
        </section>

        <section className="bg-gradient-to-b from-gray-900 to-black py-12 text-white">
          <h2 className="text-3xl text-center font-bold mb-6 text-orange-500">What Our Users Say</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-orange-500">
              <p className="italic">Super easy to pay my fine online. No more waiting in lines!</p>
              <h4 className="mt-4 font-bold text-orange-400">- Jinuka W.</h4>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-orange-500">
              <p className="italic">I disputed my fine in minutes. Great service!</p>
              <h4 className="mt-4 font-bold text-orange-400">- Pawani J.</h4>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-orange-500">
              <p className="italic">Real-time notifications helped me avoid late fees!</p>
              <h4 className="mt-4 font-bold text-orange-400">- Alex P.</h4>
            </div>
          </div>
        </section>
        <section className="bg-gray-900 text-white py-12 text-center">
          <h2 className="text-3xl font-bold">Need Help?</h2>
          <p className="mt-4 text-lg">Contact our support team for any inquiries.</p>
          <div className="mt-6 space-x-4">
            <Link href="/contact" className="px-6 py-3 bg-orange-500 rounded-lg">Contact Us</Link>
            <a href="mailto:support@yourwebsite.com" className="px-6 py-3 border border-white rounded-lg">Email Us</a>
          </div>
        </section>



        {/* Footer Section */}
        <footer className="bg-gray-300 p-6 mt-10 text-black">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-bold">FOR INQUIRIES</h3>
              <p>Name :- _______</p>
              <p>Vehicle No:- _______</p>
              <p>Inquiry :- _______</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">FOLLOW US ON</h3>
              <div className="flex space-x-4 mt-2">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <span className="text-orange-500 text-2xl">
                      {/* Instagram SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="text-orange-500"
                      >
                        <path
                          fill="currentColor"
                          d="M12 2.163c3.015 0 3.374.011 4.566.065 1.28.054 2.363.247 3.254 1.338.891.891 1.284 1.974 1.338 3.254.054 1.192.065 1.551.065 4.566s-.011 3.374-.065 4.566c-.054 1.28-.247 2.363-1.338 3.254-.891 1.091-1.974 1.284-3.254 1.338-1.192.054-1.551.065-4.566.065s-3.374-.011-4.566-.065c-1.28-.054-2.363-.247-3.254-1.338-.891-.891-1.284-1.974-1.338-3.254-.054-1.192-.065-1.551-.065-4.566s.011-3.374.065-4.566c.054-1.28.247-2.363 1.338-3.254.891-1.091 1.974-1.284 3.254-1.338 1.192-.054 1.551-.065 4.566-.065zM12 0c-3.144 0-3.548.012-4.797.068-1.348.056-2.477.28-3.429 1.232-.952.952-1.176 2.081-1.232 3.429-.056 1.249-.068 1.653-.068 4.797s.012 3.548.068 4.797c.056 1.348.28 2.477 1.232 3.429.952.952 2.081 1.176 3.429 1.232 1.249.056 1.653.068 4.797.068s3.548-.012 4.797-.068c1.348-.056 2.477-.28 3.429-1.232.952-.952 1.176-2.081 1.232-3.429.056-1.249.068-1.653.068-4.797s-.012-3.548-.068-4.797c-.056-1.348-.28-2.477-1.232-3.429-1.031-.952-2.081-1.176-3.429-1.232-1.249-.056-1.653-.068-4.797-.068zM12 5.838c-3.44 0-6.162 2.722-6.162 6.162 0 3.44 2.722 6.162 6.162 6.162 3.44 0 6.162-2.722 6.162-6.162 0-3.44-2.722-6.162-6.162-6.162zM12 16.17c-2.41 0-4.37-1.96-4.37-4.37 0-2.41 1.96-4.37 4.37-4.37 2.41 0 4.37 1.96 4.37 4.37 0 2.41-1.96 4.37-4.37 4.37zM17.488 4.512a1.44 1.44 0 1 0 2.882 0 1.44 1.44 0 1 0-2.882 0z"
                        />
                      </svg>
                    </span>
                  </a>
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <span className="text-orange-500 text-2xl">
                      {/* Facebook SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="text-orange-500"
                      >
                        <path
                          fill="currentColor"
                          d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351c0 .732.593 1.325 1.325 1.325h11.498v-9.294h-3.125v-3.622h3.125v-2.671c0-3.1 1.834-4.804 4.695-4.804 1.358 0 2.536.101 2.876.147v3.358h-2.029c-1.591 0-1.887.755-1.887 1.849v2.495h3.779l-.496 3.622h-3.283v9.294h6.459c.732 0 1.325-.593 1.325-1.325V1.325c0-.732-.593-1.325-1.325-1.325z"
                        />
                      </svg>
                    </span>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <span className="text-orange-500 text-2xl">
                      {/* Twitter SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="text-orange-500"
                      >
                        <path
                          fill="currentColor"
                          d="M22.46 6c-.77.35-1.59.59-2.46.69a4.263 4.263 0 0 0 1.88-2.35 8.517 8.517 0 0 1-2.72 1.04c-.81-.86-1.96-1.4-3.24-1.4-2.45 0-4.43 2-4.43 4.44 0 .35.04.7.12 1.03-3.68-.18-6.94-1.94-9.12-4.62-.38.64-.6 1.39-.6 2.19 0 1.51.77 2.83 1.94 3.6-.71 0-1.37-.22-1.96-.56-.05 1.95 1.35 3.74 3.22 4.14-.52.14-1.07.21-1.62.21-.4 0-.79-.04-1.18-.11.79 2.47 3.08 4.27 5.79 4.32-2.13 1.66-4.81 2.64-7.69 2.64-.5 0-.99-.03-1.47-.09 2.73 1.75 5.97 2.77 9.44 2.77 11.32 0 17.55-9.38 17.55-17.55 0-.27 0-.54-.02-.81a12.473 12.473 0 0 0 3.09-3.17z"
                        />
                      </svg>
                    </span>
                  </a>
                </div>

            </div>
          </div>
          <div className="text-center mt-4 text-sm">© 2025 Privacy & Policy | Terms & Conditions</div>
        </footer>
      </div>
      </div>
  );



};

export default HomePage