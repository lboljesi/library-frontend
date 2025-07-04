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
    <div>
      <h2>Add Member</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Membership Date</label>
          <input
            type="date"
            name="membershipDate"
            value={member.membershipDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Year of Birth</label>
          <input
            type="number"
            name="birthYear"
            value={member.birthYear}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Save Member</button>
      </form>
    </div>
  );
};

export default AddMember;
