import { useState } from "react";
import { createMember } from "../services/memberApi";

function AddMemberForm({ onMemberAdded }) {
  const [form, setForm] = useState({
    name: "",
    birthYear: "",
    membershipDate: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.name.trim()) {
      alert("Name is required.");
      return;
    }

    if (!form.birthYear || Number.isNaN(parseInt(form.birthYear, 10))) {
      alert("Birth Year must be a number.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),

        birthYear: parseInt(form.birthYear, 10),
        membershipDate: form.membershipDate
          ? new Date(form.membershipDate).toISOString()
          : null,
      };
      const created = await createMember(payload);

      onMemberAdded?.(created);

      setForm({ name: "", birthYear: "", membershipDate: "" });
    } catch (err) {
      alert("Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        required
        disabled={loading}
      />
      <input
        type="number"
        placeholder="Birth Year"
        value={form.birthYear}
        onChange={(e) => update("birthYear", e.target.value)}
        min={1900}
        max={currentYear}
        required
        disabled={loading}
      />

      <input
        type="date"
        value={form.membershipDate}
        onChange={(e) => update("membershipDate", e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Saving" : "Add Member"}
      </button>
    </form>
  );
}
export default AddMemberForm;
