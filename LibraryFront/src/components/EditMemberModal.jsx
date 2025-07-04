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
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
      >
        {loading ? (
          <p className="text-center text-gray-600">Loading member...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              Edit Member
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={member.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={
                  member.membershipDate
                    ? member.membershipDate.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={member.birthYear || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-700 hover:underline"
              >
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
