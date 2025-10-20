"use client";

import { useEffect, useMemo } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { TopNavigation } from "@/components/TopNavigation";
import { useProductionStore } from "@/store/useProductionStore";
import { TabKey } from "@/types";
import { CalendarView } from "@/views/CalendarView";
import { RouteCardsView } from "@/views/RouteCardsView";
import { CreateRouteCardView } from "@/views/CreateRouteCardView";
import { OperationsView } from "@/views/OperationsView";
import { PlanningView } from "@/views/PlanningView";
import { AnalyticsView } from "@/views/AnalyticsView";

export default function Page() {
  const fetchAll = useProductionStore((state) => state.fetchAll);
  const loading = useProductionStore((state) => state.loading);
  const activeTab = useProductionStore((state) => state.activeTab);
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("view") ?? activeTab) as TabKey;

  useEffect(() => {
    fetchAll().catch(console.error);
  }, [fetchAll]);

  const view = useMemo(() => {
    switch (currentTab) {
      case "routeCards":
        return <RouteCardsView />;
      case "createRouteCard":
        return <CreateRouteCardView />;
      case "operations":
        return <OperationsView />;
      case "planning":
        return <PlanningView />;
      case "analytics":
        return <AnalyticsView />;
      case "calendar":
      default:
        return <CalendarView />;
    }
  }, [currentTab]);

  return (
    <Box component="main" sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight={700} mb={3} color="primary">
          Производство ТСЗП — цифровая маршрутная система
        </Typography>
        <TopNavigation />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
          view
        )}
      </Container>
    </Box>
  );
}
