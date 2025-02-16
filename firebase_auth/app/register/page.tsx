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

    return{
        <div className>
    }
}