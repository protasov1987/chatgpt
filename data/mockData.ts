import { addHours } from "date-fns";
import {
  CalendarFilter,
  Department,
  Operation,
  RouteCard,
  RouteCardStep,
  ScheduleItem,
  Section,
  User
} from "@/types";

const now = new Date();
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);

let departmentSeq = 3;
let sectionSeq = 6;
let operationSeq = 6;
let routeCardSeq = 3;
let routeCardStepSeq = 7;
let scheduleSeq = 4;

export const departments: Department[] = [
  { id: 1, name: "Механический цех" },
  { id: 2, name: "Сборочный цех" },
  { id: 3, name: "Испытательный центр" }
];

export const sections: Section[] = [
  { id: 1, departmentId: 1, name: "Токарный участок" },
  { id: 2, departmentId: 1, name: "Фрезерный участок" },
  { id: 3, departmentId: 2, name: "Сборка корпуса" },
  { id: 4, departmentId: 2, name: "Электромонтаж" },
  { id: 5, departmentId: 3, name: "Испытания" }
];

export const users: User[] = [
  { id: 1, name: "Анна Технолог", role: "технолог", email: "anna@example.com" },
  { id: 2, name: "Игорь Планировщик", role: "планировщик", email: "igor@example.com" },
  { id: 3, name: "Мария Мастер", role: "мастер", email: "maria@example.com" },
  { id: 4, name: "Админ", role: "администратор", email: "admin@example.com" }
];

export const operations: Operation[] = [
  {
    id: 1,
    departmentId: 1,
    sectionId: 1,
    operationType: "Токарная",
    operationNumber: "TOK-101",
    technology: "Обработка поверхности",
    defaultDurationMin: 90,
    colorHex: "#93C5FD",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 2,
    departmentId: 1,
    sectionId: 2,
    operationType: "Фрезерная",
    operationNumber: "FRZ-205",
    technology: "Фрезерование пазов",
    defaultDurationMin: 120,
    colorHex: "#FBBF24",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 3,
    departmentId: 2,
    sectionId: 3,
    operationType: "Сборка",
    operationNumber: "SB-310",
    technology: "Комплексная сборка",
    defaultDurationMin: 180,
    colorHex: "#34D399",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 4,
    departmentId: 2,
    sectionId: 4,
    operationType: "Монтаж",
    operationNumber: "EL-120",
    technology: "Подключение проводки",
    defaultDurationMin: 150,
    colorHex: "#F472B6",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 5,
    departmentId: 3,
    sectionId: 5,
    operationType: "Испытания",
    operationNumber: "TEST-005",
    technology: "Герметичность",
    defaultDurationMin: 200,
    colorHex: "#F87171",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }
];

export const routeCardSteps: RouteCardStep[] = [
  {
    id: 1,
    routeCardId: 1,
    departmentId: 1,
    sectionId: 1,
    operationType: "Токарная",
    operationNumber: "TOK-101",
    technology: "Обработка поверхности",
    requiredDurationMin: 90
  },
  {
    id: 2,
    routeCardId: 1,
    departmentId: 1,
    sectionId: 2,
    operationType: "Фрезерная",
    operationNumber: "FRZ-205",
    technology: "Фрезерование пазов",
    requiredDurationMin: 120
  },
  {
    id: 3,
    routeCardId: 1,
    departmentId: 2,
    sectionId: 3,
    operationType: "Сборка",
    operationNumber: "SB-310",
    technology: "Комплексная сборка",
    requiredDurationMin: 180
  },
  {
    id: 4,
    routeCardId: 2,
    departmentId: 1,
    sectionId: 1,
    operationType: "Токарная",
    operationNumber: "TOK-101",
    technology: "Обработка поверхности",
    requiredDurationMin: 60
  },
  {
    id: 5,
    routeCardId: 2,
    departmentId: 2,
    sectionId: 4,
    operationType: "Монтаж",
    operationNumber: "EL-120",
    technology: "Подключение проводки",
    requiredDurationMin: 150
  },
  {
    id: 6,
    routeCardId: 2,
    departmentId: 3,
    sectionId: 5,
    operationType: "Испытания",
    operationNumber: "TEST-005",
    technology: "Герметичность",
    requiredDurationMin: 210
  }
];

export const routeCards: RouteCard[] = [
  {
    id: 1,
    orderNumber: "ORD-1001",
    routeCardNumber: "RC-5001",
    responsibleEngineer: 1,
    status: "утверждена",
    scheduled: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    steps: routeCardSteps.filter((s) => s.routeCardId === 1)
  },
  {
    id: 2,
    orderNumber: "ORD-1002",
    routeCardNumber: "RC-5002",
    responsibleEngineer: 1,
    status: "в разработке",
    scheduled: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    steps: routeCardSteps.filter((s) => s.routeCardId === 2)
  }
];

export const scheduleItems: ScheduleItem[] = [
  {
    id: 1,
    routeCardId: 1,
    routeCardStepId: 1,
    sectionId: 1,
    startDateTime: startOfDay.toISOString(),
    endDateTime: addHours(startOfDay, 2).toISOString()
  },
  {
    id: 2,
    routeCardId: 1,
    routeCardStepId: 2,
    sectionId: 2,
    startDateTime: addHours(startOfDay, 2).toISOString(),
    endDateTime: addHours(startOfDay, 5).toISOString()
  },
  {
    id: 3,
    routeCardId: 1,
    routeCardStepId: 3,
    sectionId: 3,
    startDateTime: addHours(startOfDay, 5).toISOString(),
    endDateTime: addHours(startOfDay, 9).toISOString()
  }
];

export function addOperation(operation: Omit<Operation, "id" | "createdAt" | "updatedAt">) {
  const newOperation: Operation = {
    ...operation,
    id: ++operationSeq,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  operations.push(newOperation);
  return newOperation;
}

export function addRouteCard(card: Omit<RouteCard, "id" | "createdAt" | "updatedAt" | "steps"> & {
  steps: Omit<RouteCardStep, "id" | "routeCardId">[];
}) {
  const newCardId = ++routeCardSeq;
  const nowIso = new Date().toISOString();
  const newSteps: RouteCardStep[] = card.steps.map((step) => ({
    ...step,
    id: ++routeCardStepSeq,
    routeCardId: newCardId
  }));
  const newCard: RouteCard = {
    id: newCardId,
    orderNumber: card.orderNumber,
    routeCardNumber: card.routeCardNumber,
    responsibleEngineer: card.responsibleEngineer,
    status: card.status,
    scheduled: card.scheduled,
    createdAt: nowIso,
    updatedAt: nowIso,
    steps: newSteps
  };
  routeCards.push(newCard);
  routeCardSteps.push(...newSteps);
  return newCard;
}

export function updateRouteCardStatus(id: number, status: RouteCard["status"], scheduled?: boolean) {
  const card = routeCards.find((c) => c.id === id);
  if (!card) return undefined;
  card.status = status;
  if (scheduled !== undefined) {
    card.scheduled = scheduled;
  }
  card.updatedAt = new Date().toISOString();
  return card;
}

export function addScheduleItem(item: Omit<ScheduleItem, "id">) {
  const newItem: ScheduleItem = { ...item, id: ++scheduleSeq };
  scheduleItems.push(newItem);
  return newItem;
}

export function filterSchedule(filter: CalendarFilter) {
  return scheduleItems.filter((item) => {
    if (filter.sectionId && item.sectionId !== filter.sectionId) {
      return false;
    }
    if (filter.range) {
      const start = new Date(item.startDateTime).getTime();
      const end = new Date(item.endDateTime).getTime();
      const from = new Date(filter.range.start).getTime();
      const to = new Date(filter.range.end).getTime();
      if (end < from || start > to) {
        return false;
      }
    }
    return true;
  });
}

export function planRouteCard(
  id: number,
  items: { stepId: number; sectionId: number; start: Date; end: Date }[]
) {
  for (let i = scheduleItems.length - 1; i >= 0; i -= 1) {
    if (scheduleItems[i].routeCardId === id) {
      scheduleItems.splice(i, 1);
    }
  }
  items.forEach((item) => {
    addScheduleItem({
      routeCardId: id,
      routeCardStepId: item.stepId,
      sectionId: item.sectionId,
      startDateTime: item.start.toISOString(),
      endDateTime: item.end.toISOString()
    });
  });
  updateRouteCardStatus(id, "утверждена", true);
}

export function getAnalytics() {
  const totalCards = routeCards.length;
  const draftCards = routeCards.filter((c) => c.status === "в разработке").length;
  const approvedCards = routeCards.filter((c) => c.status === "утверждена").length;
  const scheduledCards = routeCards.filter((c) => c.scheduled).length;

  const averageDuration =
    operations.reduce((acc, op) => acc + op.defaultDurationMin, 0) / operations.length;

  const sectionsLoad = sections.map((section) => {
    const items = scheduleItems.filter((item) => item.sectionId === section.id);
    const totalMinutes = items.reduce((acc, item) => {
      return acc + (new Date(item.endDateTime).getTime() - new Date(item.startDateTime).getTime());
    }, 0);
    const hours = totalMinutes / (1000 * 60 * 8);
    return {
      sectionId: section.id,
      sectionName: section.name,
      loadPercent: Math.min(100, Math.round(hours * 100))
    };
  });

  return {
    totalCards,
    draftCards,
    approvedCards,
    scheduledCards,
    averageDuration: Math.round(averageDuration),
    sectionsLoad
  };
}

export function resetSequences() {
  departmentSeq = departments.length;
  sectionSeq = sections.length;
  operationSeq = operations.length;
  routeCardSeq = routeCards.length;
  routeCardStepSeq = routeCardSteps.length;
  scheduleSeq = scheduleItems.length;
}
