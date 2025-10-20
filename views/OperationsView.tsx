"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useProductionStore } from "@/store/useProductionStore";

export function OperationsView() {
  const router = useRouter();
  const { departments, sections, operations, createOperation } = useProductionStore();
  const [form, setForm] = useState({
    departmentId: 0,
    sectionId: 0,
    operationType: "",
    operationNumber: "",
    colorHex: "#60A5FA",
    technology: "",
    defaultDurationMin: 60
  });

  useEffect(() => {
    if (!form.departmentId && departments.length) {
      setForm((prev) => ({ ...prev, departmentId: departments[0]!.id }));
    }
  }, [departments, form.departmentId]);

  useEffect(() => {
    const sectionCandidates = sections.filter((section) => section.departmentId === form.departmentId);
    if (sectionCandidates.length && !sectionCandidates.find((section) => section.id === form.sectionId)) {
      setForm((prev) => ({ ...prev, sectionId: sectionCandidates[0]!.id }));
    }
  }, [sections, form.departmentId, form.sectionId]);

  const handleSubmit = async () => {
    await createOperation({
      departmentId: form.departmentId,
      sectionId: form.sectionId,
      operationType: form.operationType,
      operationNumber: form.operationNumber,
      technology: form.technology,
      colorHex: form.colorHex,
      defaultDurationMin: form.defaultDurationMin
    });
    setForm({ ...form, operationType: "", operationNumber: "", technology: "" });
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              Справочник операций
            </Typography>
            <Button variant="outlined" onClick={() => router.replace("/?view=createRouteCard")}>Назад</Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Существующие операции
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Подразделение</TableCell>
                      <TableCell>Участок</TableCell>
                      <TableCell>Тип операции</TableCell>
                      <TableCell>Номер операции</TableCell>
                      <TableCell>Технология</TableCell>
                      <TableCell>Время (мин)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {operations.map((operation) => {
                      const department = departments.find((d) => d.id === operation.departmentId);
                      const section = sections.find((s) => s.id === operation.sectionId);
                      return (
                        <TableRow key={operation.id}>
                          <TableCell>{department?.name}</TableCell>
                          <TableCell>{section?.name}</TableCell>
                          <TableCell>{operation.operationType}</TableCell>
                          <TableCell>{operation.operationNumber}</TableCell>
                          <TableCell>{operation.technology}</TableCell>
                          <TableCell>{operation.defaultDurationMin}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Новая операция
              </Typography>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Подразделение"
                  value={form.departmentId}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      departmentId: Number(event.target.value)
                    }))
                  }
                >
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Участок"
                  value={form.sectionId}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      sectionId: Number(event.target.value)
                    }))
                  }
                >
                  {sections
                    .filter((section) => section.departmentId === form.departmentId)
                    .map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.name}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  label="Тип операции"
                  value={form.operationType}
                  onChange={(event) => setForm((prev) => ({ ...prev, operationType: event.target.value }))}
                />
                <TextField
                  label="Номер операции"
                  value={form.operationNumber}
                  onChange={(event) => setForm((prev) => ({ ...prev, operationNumber: event.target.value }))}
                />
                <TextField
                  label="Цвет"
                  type="color"
                  value={form.colorHex}
                  onChange={(event) => setForm((prev) => ({ ...prev, colorHex: event.target.value }))}
                />
                <TextField
                  label="Технология"
                  value={form.technology}
                  onChange={(event) => setForm((prev) => ({ ...prev, technology: event.target.value }))}
                  multiline
                  minRows={2}
                />
                <TextField
                  label="Необходимое время (мин)"
                  type="number"
                  value={form.defaultDurationMin}
                  onChange={(event) => setForm((prev) => ({ ...prev, defaultDurationMin: Number(event.target.value) }))}
                />
                <Button variant="contained" onClick={handleSubmit}>
                  Сохранить
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
