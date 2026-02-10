'use client';

import React, { useState } from 'react';

export default function UserProfileForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    experience: '',
    newsletter: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = formData.fullName && formData.role && formData.experience;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl" data-testid="success-message">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-full">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Registration Successful!</h2>
        </div>
        <p className="text-slate-400 mb-6">Thank you, <span className="text-indigo-400 font-semibold">{formData.fullName}</span>. Your developer profile has been created.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
        >
          Create Another Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto shadow-2xl">
      <div className="space-y-1 border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">User Profile</h1>
        <p className="text-sm text-slate-500 italic">Complete your registration below</p>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-semibold text-slate-300">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          required
        />
      </div>

      {/* Select Dropdown */}
      <div className="space-y-2">
        <label htmlFor="role" className="block text-sm font-semibold text-slate-300">Preferred Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
          required
        >
          <option value="" className="bg-slate-900 text-slate-400">Select a role</option>
          <option value="developer" className="bg-slate-900 text-slate-100">Developer</option>
          <option value="designer" className="bg-slate-900 text-slate-100">Designer</option>
          <option value="manager" className="bg-slate-900 text-slate-100">Product Manager</option>
        </select>
      </div>

      {/* Radio Buttons */}
      <div className="space-y-3">
        <span className="block text-sm font-semibold text-slate-300">Experience Level</span>
        <div className="grid grid-cols-3 gap-3">
          {['Junior', 'Mid', 'Senior'].map((level) => (
            <label 
              key={level} 
              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                ${formData.experience === level.toLowerCase() 
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                  : 'bg-slate-800/30 border-slate-700 text-slate-500 hover:border-slate-600'}
              `}
            >
              <input
                type="radio"
                name="experience"
                value={level.toLowerCase()}
                checked={formData.experience === level.toLowerCase()}
                onChange={handleChange}
                className="hidden"
                required
              />
              <span className="text-xs font-bold uppercase tracking-wider">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-lg border border-slate-800/50">
        <input
          id="newsletter"
          name="newsletter"
          type="checkbox"
          checked={formData.newsletter}
          onChange={handleChange}
          className="w-5 h-5 text-indigo-500 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500/50 focus:ring-offset-slate-900"
        />
        <label htmlFor="newsletter" className="text-sm font-medium text-slate-400 cursor-pointer select-none">
          Stay updated with our newsletter
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all shadow-xl
          ${isFormValid 
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-indigo-500/25 active:scale-[0.98]' 
            : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}
        `}
      >
        {isFormValid ? 'Complete Registration' : 'Finish Required Fields'}
      </button>
    </form>
  );
}
