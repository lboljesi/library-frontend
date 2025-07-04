import React, { useEffect, useState } from "react";
import { deleteMember, fetchMembers } from "../services/api";
import { useNavigate } from "react-router-dom";
import EditMemberModal from "./EditMemberModal";

const MembersTable = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const [editingMemberId, setEditingMemberId] = useState(null);
  const navigate = useNavigate();

  const getMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchMembers({
        page,
        pageSize,
        search: searchTerm || undefined,
        sortBy,
        sortDirection,
      });
      setMembers(data.members);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Greška:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMembers();
  }, [sortBy, sortDirection, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovog člana?"))
      return;
    try {
      await deleteMember(id);
      await getMembers();
    } catch (error) {
      console.error("Greška prilikom brisanja člana:", error);
      alert("Došlo je do greške pri brisanju.");
    }
  };

  const openEditModal = (id) => {
    setEditingMemberId(id);
  };

  const closeEditModal = () => {
    setEditingMemberId(null);
  };

  const handleSave = () => {
    getMembers();
  };

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Members List</h2>

      <button
        type="button"
        onClick={() => navigate("/members/add")}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        ➕ Add Member
      </button>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-72"
        />

        <button
          onClick={getMembers}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Apply Filter
        </button>

        <label className="flex items-center gap-2">
          Sort By:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="Name">Name</option>
            <option value="BirthYear">Year of birth</option>
            <option value="MembershipDate">Date of membership</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          Direction:
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300 text-sm shadow-sm">
        <thead className="bg-gray-100 text-gray-800 font-semibold">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Year of Birth</th>
            <th className="border px-4 py-2 text-left">Registered</th>
            <th className="border px-4 py-2 text-left">Loans</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No members found.
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{member.name}</td>
                <td className="border px-4 py-2">{member.birthYear}</td>
                <td className="border px-4 py-2">
                  {new Date(member.membershipDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {member.loans.length === 0 ? (
                      <li className="italic text-gray-400">No loans</li>
                    ) : (
                      member.loans.map((loan) => (
                        <li key={loan.id}>
                          {loan.book.title} (
                          {new Date(loan.loanDate).toLocaleDateString()} –{" "}
                          {loan.returnedDate ? (
                            new Date(loan.returnedDate).toLocaleDateString()
                          ) : (
                            <span className="text-red-500 font-medium">
                              Not returned
                            </span>
                          )}
                          )
                        </li>
                      ))
                    )}
                  </ul>
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  <button
                    className="text-red-600 hover:underline mr-2"
                    onClick={() => handleDelete(member.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => openEditModal(member.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <p className="mt-2 text-sm text-gray-600 text-center">
        Showing {Math.min(page * pageSize, totalCount)} of {totalCount} loans
      </p>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="font-medium text-gray-700">Page {page}</span>

        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={members.length < pageSize}
        >
          Next
        </button>
      </div>

      {editingMemberId && (
        <EditMemberModal
          memberId={editingMemberId}
          onClose={closeEditModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MembersTable;
