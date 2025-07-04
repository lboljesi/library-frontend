import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getLoanById, updateLoan } from "../services/api"; // promjena ovdje

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
        const found = await getLoanById(loanId); // pozovi getLoanById
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
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {!loan ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Edit Loan</h2>

            <div>
              <label>Loan Date</label>
              <input
                type="date"
                name="loanDate"
                value={formData.loanDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Returned Date</label>
              <input
                type="date"
                name="returnedDate"
                value={formData.returnedDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Must Return</label>
              <input
                type="date"
                name="mustReturn"
                value={formData.mustReturn}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default EditLoanModal;
