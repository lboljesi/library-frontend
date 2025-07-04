import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getLoanById, updateLoan } from "../services/api";  // promjena ovdje

const modalRoot = document.getElementById("modal-root");

const EditLoanModal = ({ loanId, onClose, onSave }) => {
  const [loan, setLoan] = useState(null);
  const [formData, setFormData] = useState({
    loanDate: "",
    returnedDate: "",
    mustReturn: "",
  });

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const found = await getLoanById(loanId);  // pozovi getLoanById
        if (found) {
          setLoan(found);
          setFormData({
            loanDate: found.loanDate?.split("T")[0] || "",
            returnedDate: found.returnedDate?.split("T")[0] || "",
            mustReturn: found.mustReturn?.split("T")[0] || "",
          });
        } else {
          alert("Loan not found");
          onClose();
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (loanId) fetchLoan();
  }, [loanId, onClose]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toISODateTime = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return date.toISOString();
    };

    const toLocalDateString = (isoString) => {
      if (!isoString) return null;
      const date = new Date(isoString);
      return date.toISOString().split("T")[0];
    };

    const updatedLoan = {
      bookId: loan.bookId,
      memberId: loan.memberId,
      loanDate: toLocalDateString(formData.loanDate),
      returnedDate: formData.returnedDate
        ? toLocalDateString(formData.returnedDate)
        : null,
      mustReturn: toLocalDateString(formData.mustReturn),
    };

    try {
      await updateLoan(loanId, updatedLoan);
      onSave(); // obavijesti roditelja da je update gotov
      onClose();
    } catch (err) {
      console.error("Error updating loan:", err);
    }
  };

  if (!loanId) return null;

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
      >
        {!loan ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
              Edit Loan
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Date
              </label>
              <input
                type="date"
                name="loanDate"
                value={formData.loanDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Returned Date
              </label>
              <input
                type="date"
                name="returnedDate"
                value={formData.returnedDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Must Return
              </label>
              <input
                type="date"
                name="mustReturn"
                value={formData.mustReturn}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default EditLoanModal;
