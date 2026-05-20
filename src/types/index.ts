import 'express-session';

// Application Enums
export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';
export type ParcelStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export type RouteStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
export type VehicleType = 'MOTORCYCLE' | 'VAN' | 'TRUCK';

// Session Configuration
export interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  branchId: number | null;
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
    flash?: { type: string; message: string };
  }
}

// Data Transfer Objects (DTOs)
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  branchId?: number;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  branchId?: number | null;
}

export interface CreateBranchDto {
  branchCode: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contact: string;
  latitude?: number;
  longitude?: number;
}

export type UpdateBranchDto = Partial<CreateBranchDto>;

export interface CreateParcelDto {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  weight?: number;
  fromBranchId: number;
  toBranchId: number;
}

export interface UpdateParcelDto {
  status?: ParcelStatus;
  note?: string;
  location?: string;
}

export interface CreateRouteDto {
  vehicleType: VehicleType;
  startLocation: string;
  endLocation: string;
}

export interface DeliveryPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
}
