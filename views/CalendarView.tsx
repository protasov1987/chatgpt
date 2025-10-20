"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { format, addHours, isWithinInterval } from "date-fns";
import { ru } from "date-fns/locale";
import { useProductionStore } from "@/store/useProductionStore";
import { CalendarFilter, Section } from "@/types";

const periods = [
  { label: "День", value: 8 },
  { label: "Неделя (5 дней)", value: 40 },
  { label: "2 недели", value: 80 }
];

export function CalendarView() {
  const { sections, schedule, routeCards, departments, filters, setFilters } = useProductionStore();
  const [hoursWindow, setHoursWindow] = useState<number>(8);

  const start = useMemo(() => new Date(), []);
  const end = useMemo(() => addHours(start, hoursWindow), [start, hoursWindow]);

  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      const section = sections.find((s) => s.id === item.sectionId);
      if (!section) return false;
      if (filters.sectionId && section.id !== filters.sectionId) return false;
      if (filters.departmentId && section.departmentId !== filters.departmentId) return false;
      const card = routeCards.find((card) => card.id === item.routeCardId);
      if (!card) return false;
      if (filters.responsibleEngineer && card.responsibleEngineer !== filters.responsibleEngineer)
        return false;
      if (filters.status && filters.status !== "все" && card.status !== filters.status)
        return false;
      const interval = { start, end };
      return isWithinInterval(new Date(item.startDateTime), interval);
    });
  }, [schedule, sections, filters, routeCards, start, end]);

  const sectionsByDepartment = useMemo(() => {
    return departments.map((department) => ({
      department,
      sections: sections.filter((s) => s.departmentId === department.id)
    }));
  }, [departments, sections]);

  const handleFilterChange = (partial: Partial<CalendarFilter>) => {
    setFilters({ ...filters, ...partial });
  };

  const renderCell = (section: Section) => {
    const items = filteredSchedule.filter((item) => item.sectionId === section.id);

    if (!items.length) {
      return (
        <Box
          key={section.id}
          sx={{
            borderRadius: 2,
            background: "#F1F5F9",
            minHeight: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Нет операций
          </Typography>
        </Box>
      );
    }

    return (
      <Stack key={section.id} spacing={1}>
        {items.map((item) => {
          const card = routeCards.find((c) => c.id === item.routeCardId);
          const step = card?.steps.find((s) => s.id === item.routeCardStepId);
          return (
            <Box
              key={item.id}
              sx={{
                borderRadius: 2,
                padding: 2,
                background: step?.technology ? `${getOperationColor(step.operationType)}33` : "#fff",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {step?.operationNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step?.technology}
              </Typography>
              <Typography variant="body2" mt={1} color="primary">
                {format(new Date(item.startDateTime), "dd MMM HH:mm", { locale: ru })} —
                {" "}
                {format(new Date(item.endDateTime), "HH:mm", { locale: ru })}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    );
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2} fontWeight={600}>
            Фильтры календаря
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={2.4}>
              <TextField
                select
                fullWidth
                label="Подразделение"
                value={filters.departmentId ?? ""}
                onChange={(event) =>
                  handleFilterChange({ departmentId: event.target.value ? Number(event.target.value) : undefined })
                }
              >
                <MenuItem value="">Все</MenuItem>
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                select
                fullWidth
                label="Участок"
                value={filters.sectionId ?? ""}
                onChange={(event) =>
                  handleFilterChange({ sectionId: event.target.value ? Number(event.target.value) : undefined })
                }
              >
                <MenuItem value="">Все</MenuItem>
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                select
                fullWidth
                label="Ответственный"
                value={filters.responsibleEngineer ?? ""}
                onChange={(event) =>
                  handleFilterChange({
                    responsibleEngineer: event.target.value ? Number(event.target.value) : undefined
                  })
                }
              >
                <MenuItem value="">Все</MenuItem>
                {routeCards
                  .map((card) => card.responsibleEngineer)
                  .filter((value, index, array) => array.indexOf(value) === index)
                  .map((userId) => {
                    const user = useProductionStore.getState().users.find((u) => u.id === userId);
                    if (!user) return null;
                    return (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                select
                fullWidth
                label="Статус"
                value={filters.status ?? "все"}
                onChange={(event) => handleFilterChange({ status: event.target.value as CalendarFilter["status"] })}
              >
                <MenuItem value="все">Все</MenuItem>
                <MenuItem value="в разработке">В разработке</MenuItem>
                <MenuItem value="утверждена">Утверждена</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                select
                fullWidth
                label="Диапазон"
                value={hoursWindow}
                onChange={(event) => setHoursWindow(Number(event.target.value))}
              >
                {periods.map((period) => (
                  <MenuItem key={period.value} value={period.value}>
                    {period.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2} fontWeight={600}>
            Производственный календарь
          </Typography>
          <Grid container spacing={2}>
            {sectionsByDepartment.map((entry) => (
              <Grid item xs={12} key={entry.department.id}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>
                  {entry.department.name}
                </Typography>
                <Grid container spacing={2}>
                  {entry.sections.map((section) => (
                    <Grid item xs={12} md={6} lg={4} key={section.id}>
                      <Typography variant="subtitle2" mb={1}>
                        {section.name}
                      </Typography>
                      {renderCell(section)}
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
              </Grid>
            ))}
          </Grid>
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Легенда операций
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {routeCards.flatMap((card) => card.steps).map((step) => (
                <Box key={step.id} display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", background: getOperationColor(step.operationType) }} />
                  <Typography variant="body2">{step.operationNumber}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}

function getOperationColor(operationType: string) {
  switch (operationType) {
    case "Токарная":
      return "#93C5FD";
    case "Фрезерная":
      return "#FBBF24";
    case "Сборка":
      return "#34D399";
    case "Монтаж":
      return "#F472B6";
    case "Испытания":
      return "#F87171";
    default:
      return "#CBD5F5";
  }
}
