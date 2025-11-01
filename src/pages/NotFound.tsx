import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import FootballIcon from "@/components/FootballIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Football field pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.1) 20px,
            rgba(255,255,255,0.1) 22px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.1) 20px,
            rgba(255,255,255,0.1) 22px
          )`
        }}></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-block p-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <FootballIcon className="w-24 h-24 text-white relative z-10 transition-all duration-300 hover:scale-110" />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold text-white mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold text-blue-200 mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-blue-100 mb-8"
          >
            Oops! The page you're looking for doesn't exist or has been moved. 
            Let's get you back to the field!
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link to="/">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Return to Home</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 text-blue-200 text-sm"
        >
          <p>VARtificial Intelligence - Advanced Football Match Prediction</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;