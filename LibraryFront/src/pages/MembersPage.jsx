import { useEffect, useState } from "react";
import {
  getMembers,
  deleteMember,
  getMembersPaged,
} from "../services/memberApi";
import AddMemberForm from "../components/AddMemberForm";
import EditMemberModal from "../components/EditMemberModal";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SortByAndOrderSelector from "../components/SortByAndOrderSelector";
import ResetFilters from "../components/ResetFilters";
import Pagination from "../components/Pagination";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "name");
  const [desc, setDesc] = useState(searchParams.get("desc") === "true");
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") ?? "1", 10)
  );
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("pageSize") ?? "10", 10)
  );
  const [totalCount, setTotalCount] = useState(0);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, desc, pageSize]);

  useEffect(() => {
    setSearchParams({
      search: search || "",
      sortBy,
      desc: String(desc),
      page: String(page),
      pageSize: String(pageSize),
    });
  }, [search, sortBy, desc, page, pageSize, setSearchParams]);

  const openEdit = (m) => setEditing(m);
  const closeEdit = () => setEditing(null);
  const handleSaved = (updated) => {
    setMembers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembersPaged({
        search: debouncedSearch || null,
        sortBy,
        desc,
        page,
        pageSize,
      });
      setMembers(data.items);
      setTotalCount(data.totalCount);
    } catch (err) {
      toast.error("Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [debouncedSearch, sortBy, desc, page, pageSize]);

  const handleMemberAdded = (created) => {
    setMembers((prev) => [created, ...prev]);
    toast.success("Member added");
  };

  const handleDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setTotalCount((t) => Math.max(0, t - 1));
      if (members.length === 1 && page > 1) setPage(page - 1);
      toast.success("Member deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete member");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return (
    <div>
      <h2>Members</h2>
      <AddMemberForm onMemberAdded={handleMemberAdded} />

      <SearchBar
        value={search}
        onChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Search by name"
      />

      <SortByAndOrderSelector
        sortBy={sortBy}
        desc={desc}
        options={[
          { value: "name", label: "Name" },
          { value: "birthyear", label: "Birth Year" },
          { value: "membershipDate", label: "Membership Date" },
        ]}
        onSortByChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        onDescChange={(val) => {
          setDesc(val);
          setPage(1);
        }}
      />

      <ResetFilters
        onReset={() => {
          setSearch("");
          setSortBy("name");
          setDesc(false);
          setPage(1);
          setPageSize(10);
        }}
      />

      {loading ? (
        <p>Loading members...</p>
      ) : members.length == 0 ? (
        <p>No members yet. Add the first one above.</p>
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
                onClick={() => openEdit(m)}
                disabled={deletingId === m.id || confirmDeleteId === m.id}
              >
                Edit
              </button>

              {confirmDeleteId === m.id ? (
                <>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={deletingId === m.id}
                    title="Confirm delete"
                  >
                    {deletingId === m.id ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={deletingId === m.id}
                    title="Cancel"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(m.id)}
                  disabled={deletingId === m.id}
                  title="Delete member"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Pagination
        currentPage={page}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />

      <EditMemberModal
        member={editing}
        isOpen={!!editing}
        onClose={closeEdit}
        onSaved={handleSaved}
      />
    </div>
  );
}
export default MembersPage;
