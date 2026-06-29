"use server";

export async function createEvidenceAction(_data: unknown) {
  return { success: false, error: "Use local DB for evidences" };
}

export async function updateEvidenceAction(_id: string, _data: unknown) {
  return { success: false, error: "Use local DB for evidences" };
}

export async function deleteEvidenceAction(_id: string) {
  return { success: false, error: "Use local DB for evidences" };
}
