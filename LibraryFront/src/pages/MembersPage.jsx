import { useEffect, useState } from "react";
import { getMembers, deleteMember } from "../services/memberApi";
import AddMemberForm from "../components/AddMemberForm";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleMemberAdded = (created) => {
    setMembers((prev) => [created, ...prev]);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    setDeletingId(id);

    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete member");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2>Members</h2>
      <AddMemberForm onMemberAdded={handleMemberAdded} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {members.map((m) => (
            <li key={m.id}>
              <span>
                {m.name} ({m.birthYear}) -{" "}
                {m.membershipDate
                  ? new Date(m.membershipDate).toLocaleDateString()
                  : "N/A"}
              </span>
              <button
                onClick={() => handleDelete(m.id)}
                disabled={deletingId === m.id}
                title="Delete member"
              >
                {deletingId === m.id ? "Deleting" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default MembersPage;
