import { useEffect, useState } from "react";
import { updateMember } from "../services/memberApi";
import { toast } from "react-toastify";

function EditMemberModal({ member, isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    birthYear: "",
    membershipDate: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !member) return;
    setForm({
      name: member.name ?? "",
      birthYear: member.birthYear != null ? String(member.birthYear) : "",
      membershipDate: member.membershipDate
        ? member.membershipDate.slice(0, 10)
        : "",
    });
  }, [isOpen, member]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, saving, onClose]);

  const updateField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!form.name.trim()) {
      toast.warn("Name is required.");
      return;
    }
    const by = parseInt(form.birthYear, 10);
    if (Number.isNaN(by)) {
      toast.warn("Birth Year must be a number.");
      return;
    }
    if (by < 1900 || by > new Date().getFullYear()) {
      toast.warn("Birth Year out of range.");
      return;
    }
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        birthYear: by,
        membershipDate: form.membershipDate
          ? new Date(form.membershipDate).toISOString()
          : null,
      };

      await updateMember(member.id, payload);

      onSaved?.({ ...member, ...payload });
      onClose?.();
      toast.success("Member updated.");
    } catch (err) {
      toast.error(err.message || "Failed to update member");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !member) return null;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Edit member</h3>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
          disabled={saving}
          placeholder="Name"
          autoFocus
        />
        <input
          type="number"
          value={form.birthYear}
          onChange={(e) => updateField("birthYear", e.target.value)}
          required
          disabled={saving}
          placeholder="Birth Year"
        />
        <input
          type="date"
          value={form.membershipDate}
          onChange={(e) => updateField("membershipDate", e.target.value)}
          disabled={saving}
        />
        <div>
          <button type="button" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default EditMemberModal;
