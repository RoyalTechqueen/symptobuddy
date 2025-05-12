import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, saveUserProfile } from "../../store/db";

interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

// Define the type for form errors
interface FormErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [isReturningUser, setIsReturningUser] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({}); // Updated to use FormErrors type

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

  const validateForm = () => {
    const errors: FormErrors = {}; // Use FormErrors type

    if (!firstName || /\d/.test(firstName)) {
      errors.firstName = "First name can contain only letters.";
    }

    if (!lastName ||/\d/.test(lastName)
) {
      errors.lastName = "Last name can contain only letters.";
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required.";
    } else {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        errors.dateOfBirth = "Date of birth must be in the past.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const existingProfile: UserProfile | null = await getUserProfile();
    const newProfile = { firstName, lastName, dateOfBirth, gender };

    if (
      existingProfile &&
      (existingProfile.firstName !== firstName ||
        existingProfile.lastName !== lastName ||
        existingProfile.dateOfBirth !== dateOfBirth)
    ) {
      await saveUserProfile(newProfile);
      navigate("/test");
    } else {
      await saveUserProfile(newProfile);
      navigate("/testresult");
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
          {formErrors.firstName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
          )}
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
          {formErrors.lastName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
          )}
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
          {formErrors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.dateOfBirth}
            </p>
          )}
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
