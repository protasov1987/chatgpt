"use client";

import { useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { TabKey } from "@/types";
import { useProductionStore } from "@/store/useProductionStore";

const tabs: { key: TabKey; label: string }[] = [
  { key: "calendar", label: "Главный экран" },
  { key: "routeCards", label: "Маршрутные карты" },
  { key: "createRouteCard", label: "Создание маршрутных карт" },
  { key: "operations", label: "Создание операций" },
  { key: "planning", label: "Планирование работ" },
  { key: "analytics", label: "Отчётность" }
];

export function TopNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = (searchParams.get("view") ?? "calendar") as TabKey;
  const setActiveTab = useProductionStore((state) => state.setActiveTab);

  useEffect(() => {
    setActiveTab(active);
  }, [active, setActiveTab]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      sx={{
        background: "#fff",
        padding: 2,
        borderRadius: 3,
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.12)",
        mb: 3
      }}
    >
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {tabs.map((tab) => {
          const activeTab = active === tab.key;
          return (
            <Button
              key={tab.key}
              variant={activeTab ? "contained" : "outlined"}
              color={activeTab ? "primary" : "inherit"}
              onClick={() => router.replace(`/?view=${tab.key}`)}
            >
              {tab.label}
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}
