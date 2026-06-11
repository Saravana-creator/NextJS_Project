export type UserRole = "patient" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
