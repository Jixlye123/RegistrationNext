"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import Link from "next/link";
import { MessageCircle, XCircle, Send, ChevronDown } from 'lucide-react'; 
import '../app/globals.css';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null); 

  
  const getChatbotResponse = useCallback((userInput: string) => {
    const lowerCaseInput = userInput.toLowerCase();

    if (lowerCaseInput.includes("pay") || lowerCaseInput.includes("fine")) {
      return "To pay fines, go to the 'My Fines' page, click on the license number, and then proceed to payment.";
    } else if (lowerCaseInput.includes("dispute") || lowerCaseInput.includes("find")) {
      return "To view your disputed fines, go to the 'Dispute Fines' page, enter your license number, and view the status.";
    } else if (lowerCaseInput.includes("contact")) {
      return "You can contact our admin through this email: pawijayawardhana0408@gmail.com";
    } else {
      return "Sorry, we are unavailable to assist you right now. Please call 1987 for immediate assistance.";
    }
  }, []);

  
  const addMessage = useCallback((sender: 'user' | 'bot', text: string) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  }, []);

  
  const handleSendMessage = useCallback(() => {
    if (currentInput.trim()) {
      addMessage('user', currentInput);
      const response = getChatbotResponse(currentInput);
      setTimeout(() => {
        addMessage('bot', response);
      }, 500); 
      setCurrentInput('');
    }
  }, [currentInput, addMessage, getChatbotResponse]);

  
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));

          if (userDoc.exists()) {
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

  return (
    <div className="relative"> 
      <div className="min-h-screen text-white bg-gradient-to-b from-black to-gray-900">
        {/* Header Section */}
        <header className="flex items-center justify-between p-6 mx-auto max-w-7xl">
          <div>
            <h1 className="text-4xl font-bold">
              Digi <span className="text-orange-500">Fines</span>
              <br /> Sri Lanka
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && userName ? (
              <span className="font-bold text-orange-500">{"Hello, " + userName}</span>
            ) : null}

            <div className="space-x-4">
              <Link href="/register" className="px-4 py-2 font-bold text-black bg-orange-500 rounded-md hover:bg-orange-600">
                SIGN UP
              </Link>
              <Link href="/login" className="px-4 py-2 font-bold text-black bg-orange-500 rounded-md hover:bg-orange-600">
                LOG IN
              </Link>

            </div>
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className="py-4 bg-gray-200 shadow-md">
          <div className="flex justify-center space-x-8 font-semibold text-black">
            <Link href="/">HOME</Link>
            <Link href="/myFines">MY FINES</Link>
            <Link href="/dispute-fines">DISPUTE FINES</Link>
          </div>
        </nav>

        {/* How It Works Section */}
        <section className="flex flex-col items-center justify-center max-w-6xl mx-auto mt-10 mr-4 md:flex-row">
          <img src="/9414772.jpg" alt="How It Works" width={450} height={250} className="w-full rounded-lg shadow-lg md:w-1/3" />
          <div className="p-6 md:w-1/2">
            <h2 className="inline-block mb-6 text-3xl font-bold border-b-4 border-orange-500">HOW IT WORKS</h2>
            <ol className="ml-6 space-y-4 text-lg md:ml-0">
              <li><span className="font-bold">1. Violation Detection:</span> Traffic violations are captured using cameras & officers.</li>
              <li><span className="font-bold">2. Notification:</span> Offenders receive email notifications with violation details, including evidence like photos or videos.</li>
              <li><span className="font-bold">3. Payment:</span> Pay fines quickly and securely online via PayHere.</li>
              <li><span className="font-bold">4. Dispute:</span> Submit an appeal online if you believe a fine is incorrect.</li>
            </ol>
          </div>
        </section>
        <section className="max-w-6xl mx-auto mt-10">
          <h2 className="inline-block text-3xl font-bold border-b-4 border-orange-500">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            <details className="p-4 text-white bg-gray-800 rounded-lg">
              <summary className="font-bold cursor-pointer">How do I check my fines?</summary>
              <p className="mt-2">Simply enter your vehicle number or ID to view your fines.</p>
            </details>
            <details className="p-4 text-white bg-gray-800 rounded-lg">
              <summary className="font-bold cursor-pointer">Can I dispute a fine online?</summary>
              <p className="mt-2">Yes! Click on &apos;Dispute Fines&apos; and follow the steps to submit an appeal.</p>
            </details>
            <details className="p-4 text-white bg-gray-800 rounded-lg">
              <summary className="font-bold cursor-pointer">What payment methods are supported?</summary>
              <p className="mt-2">We accept credit/debit cards, PayPal, and other online payment methods.</p>
            </details>
          </div>
        </section>

        <section className="py-12 text-white bg-gradient-to-b from-gray-900 to-black">
          <h2 className="mb-6 text-3xl font-bold text-center text-orange-500">What Our Users Say</h2>
          <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
            <div className="p-6 bg-gray-800 border border-orange-500 rounded-lg shadow-lg">
              <p className="italic">Super easy to pay my fine online. No more waiting in lines!</p>
              <h4 className="mt-4 font-bold text-orange-400">- Jinuka W.</h4>
            </div>
            <div className="p-6 bg-gray-800 border border-orange-500 rounded-lg shadow-lg">
              <p className="italic">I disputed my fine in minutes. Great service!</p>
              <h4 className="mt-4 font-bold text-orange-400">- Pawani J.</h4>
            </div>
            <div className="p-6 bg-gray-800 border border-orange-500 rounded-lg shadow-lg">
              <p className="italic">Real-time notifications helped me avoid late fees!</p>
              <h4 className="mt-4 font-bold text-orange-400">- Alex P.</h4>
            </div>
          </div>
        </section>
        <section className="py-12 text-center text-white bg-gray-900">
          <h2 className="text-3xl font-bold">Need Help?</h2>
          <p className="mt-4 text-lg">Contact our support team for any inquiries.</p>
          <div className="mt-6 space-x-4">
            <Link href="/contact" className="px-6 py-3 bg-orange-500 rounded-lg">Contact Us</Link>
            <a href="mailto:support@yourwebsite.com" className="px-6 py-3 border border-white rounded-lg">Email Us</a>
          </div>
        </section>



        
        <footer className="p-6 mt-10 text-black bg-gray-300">
          <div className="flex flex-col justify-between max-w-6xl mx-auto md:flex-row">
            <div>
              <h3 className="text-lg font-bold">FOR INQUIRIES</h3>
              <p>Name :- _______</p>
              <p>Vehicle No:- _______</p>
              <p>Inquiry :- _______</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">FOLLOW US ON</h3>
              <div className="flex mt-2 space-x-4">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <span className="text-2xl text-orange-500">
                    
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
                  <span className="text-2xl text-orange-500">
                    
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
                  <span className="text-2xl text-orange-500">
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
          <div className="mt-4 text-sm text-center">© 2025 Privacy & Policy | Terms & Conditions</div>
        </footer>
      </div>

      
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed z-50 p-3 text-white transition-transform bg-orange-500 rounded-full shadow-lg bottom-4 right-4 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isChatOpen ? (
          <XCircle className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 bg-zinc-800 rounded-lg shadow-2xl z-50 w-80 h-[400px] flex flex-col border border-orange-500"
          >
            <div className="flex items-center justify-between p-4 border-b border-orange-500">
              <h2 className="text-lg font-semibold text-orange-400">Customer Support</h2>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto" ref={chatContainerRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={
                      message.sender === 'user'
                        ? 'bg-orange-500 text-white px-3 py-2 rounded-lg max-w-[70%] ml-auto'
                        : 'bg-zinc-700 text-gray-200 px-3 py-2 rounded-lg max-w-[70%] mr-auto'
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-orange-500">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-white rounded-md bg-zinc-700 border-zinc-600 focus:border-orange-500 focus:ring-orange-500" // Added basic padding and rounded-md for better appearance
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
                  disabled={!currentInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
