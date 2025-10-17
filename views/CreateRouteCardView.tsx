"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useProductionStore } from "@/store/useProductionStore";

interface StepForm {
  departmentId?: number;
  sectionId?: number;
  operationType?: string;
  operationNumber?: string;
  technology?: string;
  requiredDurationMin?: number;
}

export function CreateRouteCardView() {
  const router = useRouter();
  const { departments, sections, operations, users, createRouteCard, setActiveTab } = useProductionStore();
  const [orderNumber, setOrderNumber] = useState("");
  const [routeCardNumber, setRouteCardNumber] = useState("");
  const [responsibleEngineer, setResponsibleEngineer] = useState<number | "">("");
  const [steps, setSteps] = useState<StepForm[]>([{}]);

  const engineers = users.filter((user) => user.role === "технолог");

  const handleAddStep = () => setSteps((prev) => [...prev, {}]);

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleStepChange = (index: number, partial: Partial<StepForm>) => {
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === index
          ? {
              ...step,
              ...partial
            }
          : step
      )
    );
  };

  const handleOperationSelect = (index: number, operationId: number) => {
    const operation = operations.find((op) => op.id === operationId);
    if (!operation) return;
    handleStepChange(index, {
      departmentId: operation.departmentId,
      sectionId: operation.sectionId,
      operationType: operation.operationType,
      operationNumber: operation.operationNumber,
      technology: operation.technology,
      requiredDurationMin: operation.defaultDurationMin
    });
  };

  const filteredSections = (departmentId?: number) =>
    sections.filter((section) => (departmentId ? section.departmentId === departmentId : true));

  const isValid =
    orderNumber &&
    routeCardNumber &&
    responsibleEngineer &&
    steps.every(
      (step) =>
        step.departmentId &&
        step.sectionId &&
        step.operationType &&
        step.operationNumber &&
        step.technology &&
        step.requiredDurationMin
    );

  const handleSubmit = async () => {
    if (!isValid) return;
    await createRouteCard({
      orderNumber,
      routeCardNumber,
      responsibleEngineer: Number(responsibleEngineer),
      status: "в разработке",
      steps: steps.map((step) => ({
        departmentId: step.departmentId!,
        sectionId: step.sectionId!,
        operationType: step.operationType!,
        operationNumber: step.operationNumber!,
        technology: step.technology!,
        requiredDurationMin: step.requiredDurationMin!
      }))
    });
    router.replace("/?view=routeCards");
    setActiveTab("routeCards");
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Новая маршрутная карта
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={() => router.replace("/?view=routeCards")}
              >
                К списку карт
              </Button>
              <Button variant="contained" disabled={!isValid} onClick={handleSubmit}>
                Сохранить карту
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Реквизиты карты
              </Typography>
              <Stack spacing={2}>
                <TextField label="Номер заказа" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
                <TextField
                  label="Номер маршрутной карты"
                  value={routeCardNumber}
                  onChange={(e) => setRouteCardNumber(e.target.value)}
                />
                <TextField
                  select
                  label="Ответственный технолог"
                  value={responsibleEngineer}
                  onChange={(e) => setResponsibleEngineer(Number(e.target.value))}
                >
                  {engineers.map((engineer) => (
                    <MenuItem key={engineer.id} value={engineer.id}>
                      {engineer.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Шаги маршрутной карты
                </Typography>
                <Button startIcon={<AddIcon />} onClick={handleAddStep}>
                  Добавить шаг
                </Button>
              </Stack>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Подразделение</TableCell>
                    <TableCell>Участок</TableCell>
                    <TableCell>Тип операции</TableCell>
                    <TableCell>Номер операции</TableCell>
                    <TableCell>Технология</TableCell>
                    <TableCell>Необходимое время (мин)</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {steps.map((step, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          select
                          value={step.departmentId ?? ""}
                          onChange={(e) => handleStepChange(index, { departmentId: Number(e.target.value), sectionId: undefined })}
                        >
                          {departments.map((department) => (
                            <MenuItem key={department.id} value={department.id}>
                              {department.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={step.sectionId ?? ""}
                          onChange={(e) => handleStepChange(index, { sectionId: Number(e.target.value) })}
                        >
                          {filteredSections(step.departmentId).map((section) => (
                            <MenuItem key={section.id} value={section.id}>
                              {section.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={step.operationType ?? ""}
                          onChange={(e) => handleStepChange(index, { operationType: e.target.value })}
                        >
                          {[...new Set(operations.map((operation) => operation.operationType))].map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={step.operationNumber ?? ""}
                          onChange={(e) => handleOperationSelect(index, Number(e.target.value))}
                        >
                          {operations
                            .filter((operation) =>
                              step.sectionId ? operation.sectionId === step.sectionId : true
                            )
                            .map((operation) => (
                              <MenuItem key={operation.id} value={operation.id}>
                                {operation.operationNumber}
                              </MenuItem>
                            ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={step.technology ?? ""}
                          onChange={(e) => handleStepChange(index, { technology: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={step.requiredDurationMin ?? ""}
                          onChange={(e) =>
                            handleStepChange(index, { requiredDurationMin: Number(e.target.value) })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveStep(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
