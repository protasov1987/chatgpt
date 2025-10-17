"use client";

import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useProductionStore } from "@/store/useProductionStore";

export function AnalyticsView() {
  const { analytics, fetchAnalytics } = useProductionStore();

  useEffect(() => {
    fetchAnalytics().catch(console.error);
  }, [fetchAnalytics]);

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Всего карт" value={analytics?.totalCards ?? 0} />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="В разработке" value={analytics?.draftCards ?? 0} />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Утверждено" value={analytics?.approvedCards ?? 0} />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Запланировано" value={analytics?.scheduledCards ?? 0} />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Загрузка участков
          </Typography>
          <Box sx={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={analytics?.sectionsLoad ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sectionName" />
                <YAxis unit="%" domain={[0, 100]} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="loadPercent" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
