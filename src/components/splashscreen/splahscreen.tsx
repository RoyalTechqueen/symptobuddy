// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const SplashScreen: React.FC = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate("/get-to-know-you");
//     }, 5000); // Show for 3 seconds
//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div className="flex  flex-col items-center justify-center h-screen text-white bg-primary">
      
//         {/* Logo */}
//         <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4  rounded-full flex items-center justify-center shadow-lg">
//           <img src="/logo.jpg" alt="logo" />
//         </div>
//         {/* App Name */}
//         <h1 className="mt-4 text-3xl sm:text-5xl font-black text-black">
//           SymptoBuddy
//         </h1>
        
//     </div>
//   );
// };

// export default SplashScreen;
