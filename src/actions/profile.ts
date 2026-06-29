"use server";

export async function updateProfileAction(_data: unknown) {
  return { success: false, error: "Use local auth provider to update profile" };
}
