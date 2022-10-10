import React from "react";
import { Service } from "../commons/types";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectServices } from "../slices/service-slice";

export function getServiceDetails() {
  const { collection: services } = useAppSelector(selectServices);
  const groupedServiceDetails: { [key: string]: Service } =
    React.useMemo(() => {
      const map: { [key: string]: Service } = {};
      for (const _service of services) {
        map[_service.serviceId] = _service;
      }
      return map;
    }, [services]);
  return { groupedServiceDetails };
}
