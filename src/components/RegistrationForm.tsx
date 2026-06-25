import React, { useState } from "react";
import { useStore } from "../store/useStore";

interface RegistrationFormProps {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const setUser = useStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const alphaPattern = /^[a-zA-Z\s]+$/;
    const usernamePattern = /^[a-zA-Z0-9]+$/;

    if (!formData.name.trim()) {
      tempErrors.name = "Field is required";
    } else if (!alphaPattern.test(formData.name)) {
      tempErrors.name = "Name should only contain letters";
    }

    if (!formData.username.trim()) {
      tempErrors.username = "Field is required";
    } else if (!usernamePattern.test(formData.username)) {
      tempErrors.username = "Username must be alphanumeric with no spaces";
    }

    if (!emailPattern.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!phonePattern.test(formData.mobile)) {
      tempErrors.mobile = "Please enter a 10-digit phone number";
    }

    if (!formData.agreeToTerms) {
      tempErrors.agreeToTerms = "Check this box if you want to proceed";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        agreeToTerms: formData.agreeToTerms,
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleFormSubmission} className="flex flex-col gap-4 w-full max-w-md select-none">
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full bg-[#1e1e1e] border-2 ${
            errors.name ? "border-red-500" : "border-[#252525] focus:border-[#72DB73]"
          } rounded-xl px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-gray-600 transition-all`}
        />
        {errors.name && <span className="text-xs text-red-500 font-extrabold pl-1">{errors.name}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={`w-full bg-[#1e1e1e] border-2 ${
            errors.username ? "border-red-500" : "border-[#252525] focus:border-[#72DB73]"
          } rounded-xl px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-gray-600 transition-all`}
        />
        {errors.username && <span className="text-xs text-red-500 font-extrabold pl-1">{errors.username}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full bg-[#1e1e1e] border-2 ${
            errors.email ? "border-red-500" : "border-[#252525] focus:border-[#72DB73]"
          } rounded-xl px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-gray-600 transition-all`}
        />
        {errors.email && <span className="text-xs text-red-500 font-extrabold pl-1">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className={`w-full bg-[#1e1e1e] border-2 ${
            errors.mobile ? "border-red-500" : "border-[#252525] focus:border-[#72DB73]"
          } rounded-xl px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-gray-600 transition-all`}
        />
        {errors.mobile && <span className="text-xs text-red-500 font-extrabold pl-1">{errors.mobile}</span>}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="w-4 h-4 rounded bg-[#1e1e1e] border-gray-700 text-[#72DB73] focus:ring-[#72DB73] accent-[#72DB73] mt-1"
          />
          <span className="text-[11px] text-gray-500 font-extrabold tracking-wide leading-tight">
            Check this box if you want to proceed
          </span>
        </label>
        {errors.agreeToTerms && (
          <span className="text-xs text-red-500 font-extrabold pl-1">{errors.agreeToTerms}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-4 mt-4 bg-[#72DB73] hover:bg-[#61ca62] text-black font-black text-sm uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-lg shadow-[#72DB73]/10"
      >
        Sign Up
      </button>
    </form>
  );
}
