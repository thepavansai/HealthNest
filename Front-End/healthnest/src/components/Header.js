import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, FileText, Calendar, Heart, UserPlus, LogIn } from 'lucide-react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    if (userId && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HealthNest</span>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a>
            
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <User className="h-5 w-5" />
                  <span>{userName}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button onClick={() => handleNavigate("/editprofile")} 
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                    <button onClick={() => handleNavigate("/appointments")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <Calendar className="h-4 w-4 mr-2" />
                      My Appointments
                    </button>
                    <button onClick={() => handleNavigate("/health-reports")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <FileText className="h-4 w-4 mr-2" />
                      Health Reports
                    </button>
                    <button onClick={() => handleNavigate("/settings")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => handleNavigate("/login")}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <LogIn className="h-5 w-5" />
                  Login
                </button>
                <button onClick={() => handleNavigate("/signup")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <UserPlus className="h-5 w-5" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;