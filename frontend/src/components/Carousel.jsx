"use client";
import { useState, useEffect } from "react";

const slides = [
  { id: 1, title: "Face Detection Preview", desc: "Real-time bounding box and facial landmark extraction.", bg: "bg-blue-100" },
  { id: 2, title: "Dashboard Analytics UI", desc: "Comprehensive stats on scanned feeds and match probabilities.", bg: "bg-indigo-100" },
  { id: 3, title: "CCTV Scanning Example", desc: "Live monitoring interface with multi-camera support.", bg: "bg-purple-100" }
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className={`min-w-full h-full flex flex-col items-center justify-center ${slide.bg} dark:bg-gray-800 p-8`}>
            {/* Placeholder for an actual image */}
            <div className="w-3/4 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-inner mb-6 flex items-center justify-center border-2 border-dashed border-gray-400">
               <span className="text-gray-500">Image Mockup: {slide.title}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{slide.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{slide.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full hover:bg-white shadow-md transition opacity-0 group-hover:opacity-100">❮</button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full hover:bg-white shadow-md transition opacity-0 group-hover:opacity-100">❯</button>
    </div>
  );
}