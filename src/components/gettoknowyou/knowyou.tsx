import React, { useState } from 'react';
import useStore from '../../store/store';
import { useNavigate } from 'react-router-dom';

const KnowYou: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');

  const handleHome = () => {
    setUser(firstName, lastName, dateOfBirth, gender); // Save to store
    navigate('/homepage'); // Redirect to NewTest page
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center px-4 mt-4">
        <img
          src="logo.jpg" // Replace with your logo path
          alt="SymptoBuddy Logo"
          className="w-32 h-32 sm:w-16 sm:h-16 lg:w-40 lg:h-40"
        />
      </div>

      <div className="w-full max-w-4xl mt-10 px-4 text-center">
        <p className="text-lg sm:text-xl text-gray-700">
          Welcome to SymptoBuddy where you get instant diagnosis for common ailments
        </p>
      </div>

      <form className="w-full max-w-4xl mt-8 px-4 space-y-4 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Abdulmuiz"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Sanusi"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleHome}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-600 focus:ring focus:ring-green-300"
        >
          Go to Home
        </button>
      </form>
    </div>
  );
};

export default KnowYou;
