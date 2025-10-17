"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import { useProductionStore } from "@/store/useProductionStore";
import { RouteCard, RouteCardStep } from "@/types";

const timeSlots = [
  { id: "slot-8", label: "08:00-10:00", startHour: 8, endHour: 10 },
  { id: "slot-10", label: "10:00-12:00", startHour: 10, endHour: 12 },
  { id: "slot-13", label: "13:00-15:00", startHour: 13, endHour: 15 },
  { id: "slot-15", label: "15:00-17:00", startHour: 15, endHour: 17 }
];

interface PlanningItem {
  stepId: number;
  sectionId: number;
  slotId?: string;
}

export function PlanningView() {
  const searchParams = useSearchParams();
  const cardId = Number(searchParams.get("card"));
  const { routeCards, sections, schedule, planRouteCard } = useProductionStore();
  const [plan, setPlan] = useState<PlanningItem[]>([]);

  const card = useMemo<RouteCard | undefined>(() => routeCards.find((c) => c.id === cardId) ?? routeCards[0], [
    cardId,
    routeCards
  ]);

  useEffect(() => {
    if (!card) return;
    const existing = schedule.filter((item) => item.routeCardId === card.id);
    setPlan(
      card.steps.map((step) => {
        const entry = existing.find((item) => item.routeCardStepId === step.id);
        if (!entry) {
          return { stepId: step.id, sectionId: step.sectionId };
        }
        const slot = timeSlots.find((slot) => {
          const start = new Date(entry.startDateTime);
          return start.getHours() === slot.startHour;
        });
        return { stepId: step.id, sectionId: step.sectionId, slotId: slot?.id };
      })
    );
  }, [card, schedule]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const [stepIdStr] = draggableId.split(":");
    const [sectionIdStr, slotId] = destination.droppableId.split(":");
    const stepId = Number(stepIdStr.replace("step-", ""));
    const sectionId = Number(sectionIdStr);
    setPlan((prev) => {
      const next = prev.map((item) =>
        item.stepId === stepId
          ? {
              ...item,
              sectionId,
              slotId
            }
          : item
      );
      return next.map((item) => {
        if (item.stepId !== stepId && item.sectionId === sectionId && item.slotId === slotId) {
          return { ...item, slotId: undefined };
        }
        return item;
      });
    });
  };

  const handleSave = async () => {
    if (!card) return;
    const startDate = new Date();
    await planRouteCard(
      card.id,
      plan
        .filter((item) => item.slotId)
        .map((item) => {
          const slot = timeSlots.find((s) => s.id === item.slotId);
          const step = card.steps.find((step) => step.id === item.stepId)!;
          const day = new Date(startDate);
          day.setHours(slot?.startHour ?? 8, 0, 0, 0);
          const end = new Date(day);
          end.setHours(slot?.endHour ?? 10, 0, 0, 0);
          return {
            stepId: item.stepId,
            sectionId: item.sectionId,
            startDateTime: day.toISOString(),
            endDateTime: end.toISOString()
          };
        })
    );
  };

  if (!card) {
    return (
      <Card>
        <CardContent>
          <Typography>Маршрутная карта не выбрана.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Планирование работ: {card.routeCardNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Заказ {card.orderNumber}. Ответственный — {card.responsibleEngineer}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => window.history.back()}>
                Выход
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Сохранить
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Этапы карты
                </Typography>
                <Stack spacing={2}>
                  {card.steps.map((step, index) => (
                    <Draggable key={`step-${step.id}:${step.sectionId}`} draggableId={`step-${step.id}:${step.sectionId}`} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            borderRadius: 2,
                            border: "1px solid rgba(15,23,42,0.1)",
                            p: 2,
                            background: "#fff",
                            boxShadow: "0 8px 16px rgba(15,23,42,0.08)"
                          }}
                        >
                          <Typography fontWeight={600}>{step.operationNumber}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {step.technology}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            {step.requiredDurationMin} мин
                          </Typography>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Календарь участков
                </Typography>
                <Grid container spacing={2}>
                  {sections.map((section) => (
                    <Grid item xs={12} key={section.id}>
                      <Typography variant="subtitle2" mb={1}>
                        {section.name}
                      </Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {timeSlots.map((slot) => (
                          <Droppable droppableId={`${section.id}:${slot.id}`} key={`${section.id}-${slot.id}`}>
                            {(provided, snapshot) => {
                              const assignment = plan.find(
                                (item) => item.sectionId === section.id && item.slotId === slot.id
                              );
                              const step = card.steps.find((s) => s.id === assignment?.stepId);
                              return (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  sx={{
                                    border: "1px dashed rgba(15,23,42,0.15)",
                                    borderRadius: 2,
                                    minHeight: 120,
                                    flex: 1,
                                    background: snapshot.isDraggingOver ? "#DBEAFE" : "#F8FAFC",
                                    transition: "background 0.2s",
                                    position: "relative"
                                  }}
                                >
                                  <Box sx={{ p: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {slot.label}
                                    </Typography>
                                    {step && (
                                      <Box
                                        sx={{
                                          mt: 1,
                                          borderRadius: 2,
                                          p: 1.5,
                                          background: "#3B82F6",
                                          color: "#fff",
                                          minHeight: 60
                                        }}
                                      >
                                        <Typography fontWeight={600}>{step.operationNumber}</Typography>
                                        <Typography variant="caption">
                                          {format(new Date(), "dd MMM", { locale: ru })}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                  {provided.placeholder}
                                </Box>
                              );
                            }}
                          </Droppable>
                        ))}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DragDropContext>
    </Stack>
  );
}
