
import React, { useState } from 'react';
import { Menu, X, LogIn, UserPlus, Info, BookOpen, Rocket } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom'
import logo from '../images/quizmaster-icon_transparent.png';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: 'About Us', to: '/aboutus', icon: Info },
    { name: 'User Guide', to: '/user-guide', icon: BookOpen },
  ];

  return (
    <nav className="w-screen h-[8vh] bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg font-sans fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img className='w-[45px]' src={logo} alt='logo'/>
             
              
              <span className="ml-2 text-xl font-bold text-white">Quiz Master</span>
            </Link>
          </div>
          {/* <div className="hidden sm:ml-0 sm:flex sm:items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-teal-600 transition duration-150 ease-in-out flex items-center"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              // onClick={navigate('/login')}
              className="px-3 py-2 rounded-md text-sm font-medium bg-white text-teal-600 hover:bg-gray-100 transition duration-150 ease-in-out flex items-center"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Link>
            <Link
              to="/register"
              // onClick={navigate('/login')}
              className="px-3 py-2 rounded-md text-sm font-medium bg-teal-700 text-white hover:bg-teal-800 transition duration-150 ease-in-out flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div> */}
        </div>
      </div>

      {/* {isOpen && (
        <div className="sm:hidden bg-teal-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-700 transition duration-150 ease-in-out flex items-center"
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
            <Link
              href="/signin"
              className="block px-3 py-2 rounded-md text-base font-medium bg-white text-teal-600 hover:bg-gray-100 transition duration-150 ease-in-out flex items-center"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block px-3 py-2 rounded-md text-base font-medium bg-teal-700 text-white hover:bg-teal-800 transition duration-150 ease-in-out flex items-center mt-2"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </Link>
          </div>
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;
