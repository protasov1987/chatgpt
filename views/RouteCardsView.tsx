"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useRouter } from "next/navigation";
import { useProductionStore } from "@/store/useProductionStore";

export function RouteCardsView() {
  const router = useRouter();
  const { routeCards, sections, users, updateRouteCardStatus } = useProductionStore();
  const [statusFilter, setStatusFilter] = useState<string>("все");
  const [query, setQuery] = useState<string>("");

  const filteredCards = useMemo(() => {
    return routeCards.filter((card) => {
      const engineer = users.find((u) => u.id === card.responsibleEngineer);
      const matchesQuery =
        !query ||
        card.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        card.routeCardNumber.toLowerCase().includes(query.toLowerCase()) ||
        engineer?.name.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "все" || card.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, routeCards, users]);

  const sectionsColumns = sections.map((section) => ({ id: section.id, name: section.name }));

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
              <TextField
                placeholder="Поиск по заказу, карте или технологу"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <TextField
                select
                label="Статус"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="все">Все</MenuItem>
                <MenuItem value="в разработке">В разработке</MenuItem>
                <MenuItem value="утверждена">Утверждена</MenuItem>
              </TextField>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Button variant="outlined" onClick={() => router.replace("/?view=calendar")}>Назад</Button>
              <Button variant="contained" onClick={() => router.replace("/?view=createRouteCard")}
                startIcon={<PlaylistAddIcon />}
              >
                Создать маршрутную карту
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Номер заказа</TableCell>
                  <TableCell>Маршрутная карта</TableCell>
                  <TableCell>Ответственный</TableCell>
                  {sectionsColumns.map((section) => (
                    <TableCell key={section.id}>{section.name}</TableCell>
                  ))}
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCards.map((card) => {
                  const engineer = users.find((user) => user.id === card.responsibleEngineer);
                  return (
                    <TableRow key={card.id} hover>
                      <TableCell>{card.orderNumber}</TableCell>
                      <TableCell>{card.routeCardNumber}</TableCell>
                      <TableCell>{engineer?.name ?? "—"}</TableCell>
                      {sectionsColumns.map((section) => {
                        const steps = card.steps.filter((step) => step.sectionId === section.id);
                        const total = steps.reduce((acc, step) => acc + step.requiredDurationMin, 0);
                        return (
                          <TableCell key={section.id}>
                            {total > 0 ? `${total} мин` : "—"}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <Chip
                          label={card.status === "утверждена" ? "Утверждена" : "В разработке"}
                          color={card.status === "утверждена" ? "success" : "warning"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {card.scheduled ? (
                            <Tooltip title="Запланировано">
                              <span>
                                <CheckCircleIcon color="success" />
                              </span>
                            </Tooltip>
                          ) : card.status === "утверждена" ? (
                            <Button
                              variant="contained"
                              onClick={() => router.replace(`/?view=planning&card=${card.id}`)}
                            >
                              Запланировать
                            </Button>
                          ) : null}
                          <IconButton
                            color="primary"
                            onClick={() =>
                              updateRouteCardStatus(
                                card.id,
                                card.status === "утверждена" ? "в разработке" : "утверждена",
                                card.scheduled
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          {card.scheduled && (
                            <Button
                              variant="outlined"
                              onClick={() => router.replace(`/?view=planning&card=${card.id}`)}
                            >
                              Редактировать
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}
