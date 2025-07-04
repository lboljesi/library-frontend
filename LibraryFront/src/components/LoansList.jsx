import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLoans, deleteLoan } from "../services/api";
import EditLoan from "./EditLoan";
const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("LoanDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [isReturned, setIsReturned] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [editingLoanId, setEditingLoanId] = useState(null);
  const navigate = useNavigate();
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const data = await getAllLoans({
        page,
        pageSize,
        sortBy,
        sortDirection,
        isReturned,
      });
      setLoans(data.loans);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLoans();
  }, [sortBy, sortDirection, isReturned, page]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;
    try {
      await deleteLoan(id);
      setLoans((prev) => prev.filter((loan) => loan.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  const openEditModal = (id) => {
    setEditingLoanId(id);
  };
  const closedEditModal = () => {
    setEditingLoanId(null);
  };
  const handleSave = () => {
    fetchLoans();
  };
  return (
    <div>
      <h1>Loans</h1>
      <div>
        <button onClick={() => navigate("/loans/add")}>➕ Add Loan</button>
      </div>
      <div>
        <div>
          <label>Sort by</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="LoanDate">Loan Date</option>
            <option value="ReturnedDate">Returned Date</option>
            <option value="MustReturn">Must Return Date</option>
            <option value="Title">Book Title</option>
            <option value="Name">Member Name</option>
          </select>
        </div>
        <div>
          <label>Direction</label>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <label>Returned status</label>
          <select
            value={isReturned === null ? "all" : isReturned ? "true" : "false"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "all") setIsReturned(null);
              else if (val === "true") setIsReturned(true);
              else setIsReturned(false);
            }}
          >
            <option value="all">All</option>
            <option value="true">Returned</option>
            <option value="false">Not returned</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>ISBN</th>
                  <th>Price</th>
                  <th>Member Name</th>
                  <th>Loan Date</th>
                  <th>Returned Date</th>
                  <th>Must Return</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(loans) && loans.length > 0 ? (
                  loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>{loan.book?.title}</td>
                      <td>{loan.book?.isbn}</td>
                      <td>{loan.book?.price}</td>
                      <td>{loan.member?.name}</td>
                      <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                      <td>
                        {loan.returnedDate ? (
                          new Date(loan.returnedDate).toLocaleDateString()
                        ) : (
                          <span>Not returned</span>
                        )}
                      </td>
                      <td>{new Date(loan.mustReturn).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => openEditModal(loan.id)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(loan.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No loans found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p>
            Showing {Math.min(page * pageSize, totalCount)} of {totalCount}{" "}
            loans
          </p>
          <div>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              disabled={loans.length < pageSize}
              onClick={() => {
                if (loans.length === pageSize) setPage((p) => p + 1);
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
      {editingLoanId && (
        <EditLoan
          loanId={editingLoanId}
          onClose={closedEditModal}
          onSave={() => {
            fetchLoans();
            closedEditModal();
          }}
        />
      )}
    </div>
  );
};
export default LoansList;
