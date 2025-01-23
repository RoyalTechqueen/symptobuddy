import React from "react";
import { useNavigate } from "react-router-dom";

const KnowYou: React.FC = () => {
  const [state, setState] = React.useState<{ age: string; gender: string }>({
    age: "",
    gender: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Navigate to homepage upon form submission
    navigate("/home"); // Redirect to the homepage
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="bg-white p-8 rounded-lg  w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Get to Know You</h1>

        <div className="mb-4">
          <input
            name="age"
            type="text"
            placeholder="Enter your age"
            value={state.age}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-6">
          <select
            name="gender"
            value={state.gender}
            onChange={handleSelectChange}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button
          onClick={handleSubmit} // Trigger handleSubmit on click
          className="w-full bg-primary text-white p-3 rounded-md hover:bg-green-700 transition duration-200"
          disabled={!state.age || !state.gender}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default KnowYou;
