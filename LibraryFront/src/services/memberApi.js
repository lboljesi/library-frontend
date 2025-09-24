import api from "./api";

export async function getMembers() {
  const { data } = await api.get("/member");
  return data;
}

export async function createMember(payload) {
  const { data, status } = await api.post("/member", payload, {
    validateStatus: () => true,
  });
  if (status === 201) return data;

  throw new Error("Failed to create member");
}

export async function deleteMember(id) {
  const { status } = await api.delete(`/member/${id}`, {
    validateStatus: () => true,
  });
  if (status === 204) return true;
  if (status === 404) return new Error("Member not found");
  throw new Error("Failed to delete member");
}

export async function updateMember(id, payload) {
  const { status } = await api.put(`/member/${id}`, payload, {
    validateStatus: () => true,
  });
  if (status === 204) return true;
  if (status === 404) throw new Error("Member not found");
  throw new Error("Failed to update member");
}

export async function getMembersPaged(params) {
  const { data } = await api.get("/member/paged", { params });
  return data;
}
