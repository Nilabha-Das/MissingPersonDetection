"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    // Mock Authentication Check
    const isAuthenticated = false; // Replace with actual auth check (e.g., NextAuth session)
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login"); // Your dedicated login page
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
          FindMe AI
        </Link>
        
        <div className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-200 font-medium">
          <Link href="#home" className="hover:text-blue-500 transition">Home</Link>
          <Link href="#about" className="hover:text-blue-500 transition">About Us</Link>
          <Link href="#features" className="hover:text-blue-500 transition">Features</Link>
          <Link href="#contact" className="hover:text-blue-500 transition">Contact</Link>
        </div>

        <button 
          onClick={handleLoginClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Login
        </button>
      </div>
    </nav>
  );
}