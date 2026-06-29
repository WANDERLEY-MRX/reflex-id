"use server";

export async function requestVerificationAction(_data: unknown) {
  return { success: false, error: "Use local DB for verifications" };
}

export async function approveVerificationAction(_id: string) {
  return { success: false, error: "Use local DB for verifications" };
}

export async function rejectVerificationAction(_id: string, _reason: string) {
  return { success: false, error: "Use local DB for verifications" };
}
