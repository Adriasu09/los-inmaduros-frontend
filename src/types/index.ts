// User types
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Route types
export type RouteLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface Route {
  id: string;
  name: string;
  slug: string;
  image: string;
  approximateDistance: string;
  description: string;
  level: RouteLevel[];
  gpxFileUrl: string | null;
  mapEmbedUrl: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reviews: number;
    favorites: number;
    routeCalls: number;
    photos: number;
  };
}

// RouteCall types
export type RoutePace =
  | "ROCA"
  | "CARACOL"
  | "GUSANO"
  | "MARIPOSA"
  | "EXPERIMENTADO"
  | "LOCURA_TOTAL"
  | "MIAUCORNIA";

export type RouteCallStatus =
  | "SCHEDULED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export type MeetingPointType = "PRIMARY" | "SECONDARY";

export interface MeetingPoint {
  id: string;
  type: MeetingPointType;
  name: string;
  customName: string | null;
  location: string | null;
  time: string | null;
}

export interface RouteCall {
  id: string;
  routeId: string | null;
  organizerId: string;
  title: string;
  description: string | null;
  image: string | null;
  dateRoute: string;
  pace: RoutePace;
  status: RouteCallStatus;
  createdAt: string;
  updatedAt: string;
  route?: Route;
  organizer?: User;
  meetingPoints?: MeetingPoint[];
  _count?: {
    attendances: number;
  };
}

// Review types
export interface Review {
  id: string;
  routeId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    imageUrl: string | null;
  };
}

// Favorite types
export interface Favorite {
  id: string;
  routeId: string;
  userId: string;
  createdAt: string;
}

// Photo types
export type PhotoContext =
  | "ROUTE_CALL_COVER"
  | "ROUTE_GALLERY"
  | "ROUTE_CALL_GALLERY";
export type PhotoStatus = "ACTIVE" | "FLAGGED" | "REJECTED" | "DELETED";

export interface Photo {
  id: string;
  context: PhotoContext;
  routeId: string | null;
  routeCallId: string | null;
  userId: string;
  imageUrl: string;
  caption: string | null;
  status: PhotoStatus;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
}
