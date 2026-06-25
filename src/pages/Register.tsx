import React from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";
import registerBanner from "../assets/images/register_banner_1782290678808.jpg";

export default function Register() {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    navigate("/categories");
  };

  return (
    <div
      id="registration_page_container"
      className="flex flex-col md:flex-row min-h-screen w-full bg-black text-white select-none overflow-x-hidden"
    >
      {/* Left Column: Hero Banner Image with Overlay Text */}
      <div
        id="registration_banner_panel"
        className="relative flex flex-col justify-end w-full md:w-[50%] lg:w-[45%] h-[40vh] md:h-screen p-8 md:p-16 overflow-hidden border-r border-[#1a1a1a]"
      >
        <div className="absolute inset-0 bg-[#000000]/40 z-10" />
        <img
          src={registerBanner}
          alt="Super App Showcase"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 select-none pointer-events-none"
        />

        <div className="relative z-20 flex flex-col max-w-md">
          <h1
            id="banner_title"
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-[#72DB73]"
          >
            Super app
          </h1>
          <p
            id="banner_subtitle"
            className="text-lg md:text-xl font-bold mb-2 leading-snug"
          >
            Discover new things on Superapp
          </p>
          <p id="banner_slogan" className="text-sm text-gray-300">
            Share your setup, your thoughts, your reviews. Discover your next favorite things here!
          </p>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div
        id="registration_form_panel"
        className="flex flex-col justify-center items-center w-full md:w-[50%] lg:w-[55%] px-6 py-12 md:px-16 lg:px-24 h-auto md:h-screen overflow-y-auto bg-black"
      >
        <div className="w-full max-w-md flex flex-col">
          <div className="mb-8 text-center md:text-left">
            <h2 id="app_brand_logo" className="text-3xl md:text-4xl font-serif text-[#72DB73] mb-2 font-black tracking-tight">
              Super app
            </h2>
            <p id="app_signup_title" className="text-gray-400 text-sm">
              Create your new account
            </p>
          </div>

          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        </div>
      </div>
    </div>
  );
}
