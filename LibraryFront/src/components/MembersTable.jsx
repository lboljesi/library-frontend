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
    <div>
      <h2>Members List</h2>

      <button type="button" onClick={() => navigate("/members/add")}>
        ➕ Add Member
      </button>

      {/* Filters */}
      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={getMembers}>Apply Filter</button>

        <label>
          Sort By:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Name">Name</option>
            <option value="BirthYear">Year of birth</option>
            <option value="MembershipDate">Date of membership</option>
          </select>
        </label>

        <label>
          Direction:
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Year of Birth</th>
            <th>Registered</th>
            <th>Loans</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={5}>No members found.</td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.birthYear}</td>
                <td>{new Date(member.membershipDate).toLocaleDateString()}</td>
                <td>
                  <ul>
                    {member.loans.length === 0 ? (
                      <li>No loans</li>
                    ) : (
                      member.loans.map((loan) => (
                        <li key={loan.id}>
                          {loan.book.title} (
                          {new Date(loan.loanDate).toLocaleDateString()} –{" "}
                          {loan.returnedDate ? (
                            new Date(loan.returnedDate).toLocaleDateString()
                          ) : (
                            <span>Not returned</span>
                          )}
                          )
                        </li>
                      ))
                    )}
                  </ul>
                </td>
                <td>
                  <button onClick={() => handleDelete(member.id)}>
                    Delete
                  </button>
                  <button onClick={() => openEditModal(member.id)}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <p>
        Showing {Math.min(page * pageSize, totalCount)} of {totalCount} loans
      </p>

      {/* Pagination */}
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
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
