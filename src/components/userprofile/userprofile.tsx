import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, saveUserProfile } from "../../store/db"; // Import IndexedDB functions

// Define UserProfile type
interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [isReturningUser, setIsReturningUser] = useState<boolean>(false);

  // Check if user profile exists
  useEffect(() => {
    const checkProfile = async () => {
      const profile: UserProfile | null = await getUserProfile();
      if (profile) {
        setIsReturningUser(true);
      }
    };
    checkProfile();
  }, []);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !dateOfBirth) {
      alert("Please fill out all fields.");
      return;
    }

    // Get existing profile
    const existingProfile: UserProfile | null = await getUserProfile();

    // If a different user is detected, clear old data
    if (
      existingProfile &&
      (existingProfile.firstName !== firstName ||
        existingProfile.lastName !== lastName ||
        existingProfile.dateOfBirth !== dateOfBirth)
    ) {
      await saveUserProfile({ firstName, lastName, dateOfBirth, gender }); // Save new user
      navigate("/test"); // Redirect new user to homepage
    } else {
      await saveUserProfile({ firstName, lastName, dateOfBirth, gender });
      navigate("/testresult"); // Redirect existing user to test results
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex items-center justify-center px-4 mt-4">
        <img
          src="/logo.jpg"
          alt="SymptoBuddy Logo"
          className="w-48 h-48 sm:w-36 sm:h-36 lg:w-52 lg:h-52"
        />
      </div>


      {/* Form to collect user information */}
      <form className="w-full max-w-4xl mt-8 px-4 space-y-4 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            placeholder="John"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
            placeholder="Doe"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDateOfBirth(e.target.value)
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setGender(e.target.value as "Male" | "Female")
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-600 focus:ring focus:ring-green-300"
        >
          {isReturningUser ? "Begin Test" : "Go to Home"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
