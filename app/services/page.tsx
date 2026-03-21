"use client";

import AppShell from "../components/AppShell";
import {
  ServicesHeader,
  ActiveServicesSection,
  SuggestedServicesSection,
  HelpBanner,
} from "../components/services";
import {
  CURRENT_SERVICES,
  SUGGESTED_SERVICES,
  type CurrentService,
  type SuggestedService,
} from "@/data/services";
import { ServicesSkeleton } from "../components/skeletons";
import { useSimulatedLoading } from "@/hooks";
import { showToast } from "@/lib/toast";

export default function ServicesPage() {
  const { data, isLoading } = useSimulatedLoading(() => ({
    current: CURRENT_SERVICES,
    suggested: SUGGESTED_SERVICES,
  }));

  const handleAddService = () => {
    showToast.info("Opening service catalog...");
  };

  const handleManageService = (service: CurrentService) => {
    showToast.info(`Managing ${service.name}...`);
  };

  const handleUpgradeService = (service: CurrentService) => {
    showToast.info(`Upgrading ${service.name}...`);
  };

  const handleAddSuggestedService = (service: SuggestedService) => {
    showToast.success(`${service.name} added successfully`);
  };

  const handleViewAllServices = () => {
    showToast.info("Loading all services...");
  };

  const handleContactSales = () => {
    showToast.info("Opening sales contact form...");
  };

  return (
    <AppShell>
      <ServicesHeader onAddService={handleAddService} />

      {isLoading ? (
        <ServicesSkeleton />
      ) : (
        <>
          <ActiveServicesSection
            services={data!.current}
            onManage={handleManageService}
            onUpgrade={handleUpgradeService}
          />

          <SuggestedServicesSection
            services={data!.suggested}
            onAdd={handleAddSuggestedService}
            onViewAll={handleViewAllServices}
          />

          <HelpBanner onContactSales={handleContactSales} />
        </>
      )}
    </AppShell>
  );
}
