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
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">Loans</h1>
      <div className="mt-6 mb-6">
        <button
          onClick={() => navigate("/loans/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow:heavy_plus_sign:"
        >
          ➕ Add Loan
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="LoanDate">Loan Date</option>
            <option value="ReturnedDate">Returned Date</option>
            <option value="MustReturn">Must Return Date</option>
            <option value="Title">Book Title</option>
            <option value="Name">Member Name</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Direction
          </label>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Returned status
          </label>
          <select
            value={isReturned === null ? "all" : isReturned ? "true" : "false"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "all") setIsReturned(null);
              else if (val === "true") setIsReturned(true);
              else setIsReturned(false);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="true">Returned</option>
            <option value="false">Not returned</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Book Title
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    ISBN
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Member Name
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Loan Date
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Returned Date
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Must Return
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.isArray(loans) && loans.length > 0 ? (
                  loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{loan.book?.title}</td>
                      <td className="px-4 py-2">{loan.book?.isbn}</td>
                      <td className="px-4 py-2">{loan.book?.price}</td>
                      <td className="px-4 py-2">{loan.member?.name}</td>
                      <td className="px-4 py-2">
                        {new Date(loan.loanDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {loan.returnedDate ? (
                          new Date(loan.returnedDate).toLocaleDateString()
                        ) : (
                          <span className="italic text-gray-500">
                            Not returned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(loan.mustReturn).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => openEditModal(loan.id)}
                          className="text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(loan.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-6 text-center text-gray-500 italic"
                    >
                      No loans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Showing {Math.min(page * pageSize, totalCount)} of {totalCount}{" "}
            loans
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span className="px-4 py-2 border rounded text-gray-700">
              Page {page}
            </span>
            <button
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
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
