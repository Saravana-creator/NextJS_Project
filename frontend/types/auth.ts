export type UserRole = "patient" | "admin" | "doctor";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hospitalId?: string;
};

export type SessionPayload = {
  userId: string;
  name?: string;
  email: string;
  role: UserRole;
  hospitalId?: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
