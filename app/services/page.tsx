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

export default function ServicesPage() {
  const handleAddService = () => {
    console.log("Adding new service...");
  };

  const handleManageService = (service: CurrentService) => {
    console.log("Managing service:", service.name);
  };

  const handleUpgradeService = (service: CurrentService) => {
    console.log("Upgrading service:", service.name);
  };

  const handleAddSuggestedService = (service: SuggestedService) => {
    console.log("Adding service:", service.name);
  };

  const handleViewAllServices = () => {
    console.log("Viewing all services...");
  };

  const handleContactSales = () => {
    console.log("Contacting sales...");
  };

  return (
    <AppShell>
      <ServicesHeader onAddService={handleAddService} />

      <ActiveServicesSection
        services={CURRENT_SERVICES}
        onManage={handleManageService}
        onUpgrade={handleUpgradeService}
      />

      <SuggestedServicesSection
        services={SUGGESTED_SERVICES}
        onAdd={handleAddSuggestedService}
        onViewAll={handleViewAllServices}
      />

      <HelpBanner onContactSales={handleContactSales} />
    </AppShell>
  );
}
