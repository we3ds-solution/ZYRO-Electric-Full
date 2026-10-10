// User Models
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: UserRole;
  status: UserStatus;
}

export interface UserProfile extends User {
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences: UserPreferences;
  addresses: Address[];
}

export interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  twoFactorEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export type UserRole = 'customer' | 'vendor' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned';

// Auth Models
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export type LoginResponse = AuthResponse;

export type RegisterResponse = AuthResponse;

// Password Models
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Email Verification
export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirm {
  email: string;
  code: string;
}

// Two-Factor Authentication
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
}

export interface TwoFactorVerify {
  code: string;
}

export interface TwoFactorLogin {
  email: string;
  tempToken: string;
  code: string;
}

// Session Models
export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent: string;
  ipAddress: string;
  isActive: boolean;
}

// Token Models
export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken?: string | null;
}

// API Error Response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp: Date;
}
