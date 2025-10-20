"use client";

import { create } from "zustand";
import axios from "axios";
import {
  CalendarFilter,
  Department,
  Operation,
  RouteCard,
  ScheduleItem,
  Section,
  TabKey,
  User
} from "@/types";

interface ProductionState {
  departments: Department[];
  sections: Section[];
  operations: Operation[];
  routeCards: RouteCard[];
  schedule: ScheduleItem[];
  users: User[];
  activeTab: TabKey;
  filters: CalendarFilter;
  loading: boolean;
  analytics?: {
    totalCards: number;
    draftCards: number;
    approvedCards: number;
    scheduledCards: number;
    averageDuration: number;
    sectionsLoad: { sectionId: number; sectionName: string; loadPercent: number }[];
  };
  fetchAll: () => Promise<void>;
  setActiveTab: (tab: TabKey) => void;
  setFilters: (filters: CalendarFilter) => void;
  createOperation: (operation: {
    departmentId: number;
    sectionId: number;
    operationType: string;
    operationNumber: string;
    technology: string;
    defaultDurationMin: number;
    colorHex: string;
  }) => Promise<void>;
  createRouteCard: (payload: {
    orderNumber: string;
    routeCardNumber: string;
    responsibleEngineer: number;
    status: RouteCard["status"];
    steps: {
      departmentId: number;
      sectionId: number;
      operationType: string;
      operationNumber: string;
      technology: string;
      requiredDurationMin: number;
    }[];
  }) => Promise<void>;
  updateRouteCardStatus: (id: number, status: RouteCard["status"], scheduled?: boolean) => Promise<void>;
  planRouteCard: (
    id: number,
    items: { stepId: number; sectionId: number; startDateTime: string; endDateTime: string }[]
  ) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
}

export const useProductionStore = create<ProductionState>((set) => ({
  departments: [],
  sections: [],
  operations: [],
  routeCards: [],
  schedule: [],
  users: [],
  activeTab: "calendar",
  filters: {},
  loading: false,
  fetchAll: async () => {
    set({ loading: true });
    try {
      const [departments, sections, operations, routeCards, schedule, users] = await Promise.all([
        axios.get<Department[]>("/api/departments"),
        axios.get<Section[]>("/api/sections"),
        axios.get<Operation[]>("/api/operations"),
        axios.get<RouteCard[]>("/api/route-cards"),
        axios.get<ScheduleItem[]>("/api/schedule"),
        axios.get<User[]>("/api/users")
      ]);

      set({
        departments: departments.data,
        sections: sections.data,
        operations: operations.data,
        routeCards: routeCards.data,
        schedule: schedule.data,
        users: users.data,
        loading: false
      });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFilters: (filters) => set({ filters }),
  createOperation: async (operation) => {
    await axios.post("/api/operations", operation);
    await useProductionStore.getState().fetchAll();
  },
  createRouteCard: async (payload) => {
    await axios.post("/api/route-cards", payload);
    await useProductionStore.getState().fetchAll();
  },
  updateRouteCardStatus: async (id, status, scheduled) => {
    await axios.patch(`/api/route-cards/${id}`, { status, scheduled });
    await useProductionStore.getState().fetchAll();
  },
  planRouteCard: async (id, items) => {
    await axios.post(`/api/schedule`, { id, items });
    await useProductionStore.getState().fetchAll();
  },
  fetchAnalytics: async () => {
    const { data } = await axios.get(`/api/route-cards/analytics`);
    set({ analytics: data });
  }
}));
