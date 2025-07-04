import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getMemberById, updateMember } from "../services/api";

const modalRoot = document.getElementById("modal-root");

const EditMemberModal = ({ memberId, onClose, onSave }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const memberData = await getMemberById(memberId);
        setMember(memberData);
      } catch (error) {
        console.error("Greška pri dohvaćanju člana:", error);
      } finally {
        setLoading(false);
      }
    };
    if (memberId) fetchMember();
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const memberToUpdate = {
      name: member.name,
      membershipDate: new Date(member.membershipDate).toISOString(),
      birthYear: Number(member.birthYear),
    };
    try {
      await updateMember(memberId, memberToUpdate);
      onSave();
      onClose();
    } catch (error) {
      console.error("Greška pri ažuriranju člana:", error);
    }
  };

  if (!memberId) return null;

  const modalContent = (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <p>Loading member...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Edit Member</h2>

            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={member.name || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Membership Date</label>
              <input
                type="date"
                name="membershipDate"
                value={
                  member.membershipDate
                    ? member.membershipDate.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Year of Birth</label>
              <input
                type="number"
                name="birthYear"
                value={member.birthYear || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default EditMemberModal;
