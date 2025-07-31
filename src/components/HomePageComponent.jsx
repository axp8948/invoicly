import React from 'react';
import { ReactTyped } from 'react-typed';
import { useNavigate } from 'react-router-dom';


export default function Home() {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/signup")
  }

  return (
<div className="flex flex-col items-center justify-center text-center px-4">
  <span className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">
  Invoicly
</span>
  </span>

    {/* Typing Animation using react-typed */}
  <ReactTyped
    strings={['Manage Your Invoices',
  'Track Payments with Ease',
  'Simplify Your Freelance Finances',]}
    typeSpeed={50}
    backSpeed={30}
    loop
    className="text-lime-300 text-2xl font-medium mb-4"
  />

  <p className="text-white text-lg mt-16 opacity-70">
    The simplest way to organize your freelance business.
  </p>

  <div className="mt-6">
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-400 hover:scale-105"
    >
      Get Started
    </button>
  </div>
</div>

  )
}
