import { useState } from "react";
import { createMember } from "../services/memberApi";
import { toast } from "react-toastify";

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
      toast.warn("Name is required.");
      return;
    }

    const year = parseInt(form.birthYear, 10);
    if (Number.isNaN(year)) {
      toast.warn("Birth Year must be a number.");
      return;
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      toast.warn("Birth Year out of range.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),

        birthYear: year,
        membershipDate: form.membershipDate
          ? new Date(form.membershipDate).toISOString()
          : null,
      };
      const created = await createMember(payload);

      onMemberAdded?.(created);

      setForm({ name: "", birthYear: "", membershipDate: "" });
    } catch (err) {
      toast.error("Failed to create member");
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
