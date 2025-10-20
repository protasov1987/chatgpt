export type Role = "технолог" | "планировщик" | "мастер" | "администратор";

export interface Department {
  id: number;
  name: string;
}

export interface Section {
  id: number;
  departmentId: number;
  name: string;
}

export interface Operation {
  id: number;
  departmentId: number;
  sectionId: number;
  operationType: string;
  operationNumber: string;
  technology: string;
  defaultDurationMin: number;
  colorHex: string;
  createdAt: string;
  updatedAt: string;
}

export interface RouteCardStep {
  id: number;
  routeCardId: number;
  departmentId: number;
  sectionId: number;
  operationType: string;
  operationNumber: string;
  technology: string;
  requiredDurationMin: number;
}

export interface RouteCard {
  id: number;
  orderNumber: string;
  routeCardNumber: string;
  responsibleEngineer: number;
  status: "в разработке" | "утверждена";
  scheduled: boolean;
  createdAt: string;
  updatedAt: string;
  steps: RouteCardStep[];
}

export interface ScheduleItem {
  id: number;
  routeCardId: number;
  routeCardStepId: number;
  sectionId: number;
  startDateTime: string;
  endDateTime: string;
}

export interface User {
  id: number;
  name: string;
  role: Role;
  email: string;
}

export interface CalendarFilter {
  departmentId?: number;
  sectionId?: number;
  responsibleEngineer?: number;
  status?: RouteCard["status"] | "все";
  range?: {
    start: string;
    end: string;
  };
}

export type TabKey =
  | "calendar"
  | "routeCards"
  | "createRouteCard"
  | "operations"
  | "planning"
  | "analytics";
