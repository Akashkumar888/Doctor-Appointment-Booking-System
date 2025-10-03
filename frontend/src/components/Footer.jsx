import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* left section  */}
        <div className="">
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        {/* center section  */}
        <div className="">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              onClick={() => {
                navigate("/");
                scrollTo(0, 0);
              }}
              className="cursor-pointer"
            >
              Home
            </li>
            <li onClick={() => navigate("/about")} className="cursor-pointer">
              About us
            </li>
            <li onClick={() => navigate("/contact")} className="cursor-pointer">
              Contact us
            </li>
            <li>Privacy policy</li>
          </ul>
        </div>
        {/* right section  */}
        <div className="">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <a href="tel:+8675187984373" className="cursor-pointer">
              +86 751 8798 4373
            </a>

            <a href="mailto:test@testgmail.com" className="cursor-pointer">
              test@testgmail.com
            </a>
          </ul>
        </div>
      </div>
      {/* cpoy right text  */}
      <div >
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright {new Date().getFullYear()}&copy; hospital Open 24 hours -
          All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
