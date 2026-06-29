"use server";

export async function createProjectAction(_data: unknown) {
  return { success: false, error: "Use local DB for projects" };
}

export async function updateProjectAction(_id: string, _data: unknown) {
  return { success: false, error: "Use local DB for projects" };
}

export async function deleteProjectAction(_id: string) {
  return { success: false, error: "Use local DB for projects" };
}
