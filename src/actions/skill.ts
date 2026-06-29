"use server";

export async function addSkillAction(_data: unknown) {
  return { success: false, error: "Use local DB for skills" };
}

export async function updateSkillLevelAction(_id: string, _level: number) {
  return { success: false, error: "Use local DB for skills" };
}

export async function removeSkillAction(_id: string) {
  return { success: false, error: "Use local DB for skills" };
}
