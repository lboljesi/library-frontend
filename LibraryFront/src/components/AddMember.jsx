import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMember } from "../services/api";

const AddMember = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState({
    name: "",
    membershipDate: "",
    birthYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMember = {
      name: member.name,
      membershipDate: member.membershipDate,
      birthYear: Number(member.birthYear),
    };

    try {
      await createMember(newMember);
      navigate("/members");
    } catch (error) {
      console.error("Greška pri dodavanju člana:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Add Member
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Membership Date
          </label>
          <input
            type="date"
            name="membershipDate"
            value={member.membershipDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year of Birth
          </label>
          <input
            type="number"
            name="birthYear"
            value={member.birthYear}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Member
        </button>
      </form>
    </div>
  );
};

export default AddMember;
