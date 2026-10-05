// Specialized ECOWAS agencies, sourced from the ECOWAS Special Agencies brief.
// Centralized so the Institutions Hub and any other views share one record.
export type SpecialAgency = { name: string; description: string };

export const SPECIAL_AGENCIES: SpecialAgency[] = [
  { name: "Regional Centre for Surveillance & Disease Control (RCSDC)", description: "Supports regional surveillance, preparedness and response to public-health threats and disease outbreaks." },
  { name: "West African Power Pool (WAPP)", description: "Promotes regional electricity integration by facilitating cooperation, interconnection and electricity trading among West African countries." },
  { name: "ECOWAS Regional Competition Authority (ERCA)", description: "Supports the development and enforcement of regional competition policy and helps promote fair competition within the ECOWAS market." },
  { name: "Regional Animal Health Centre (RAHC)", description: "Supports regional cooperation and capacity in animal health, disease prevention, surveillance and control." },
  { name: "Water Resources Coordination Centre (WRCC)", description: "Coordinates regional cooperation and integrated management of water resources across West Africa." },
  { name: "West African Monetary Agency (WAMA)", description: "Coordinates and monitors the ECOWAS Monetary Cooperation Programme and supports monetary and financial integration, including the objective of a single currency." },
  { name: "West African Monetary Institute (WAMI)", description: "Supports the technical and institutional preparation for monetary integration and the eventual establishment of a single monetary zone in West Africa." },
  { name: "ECOWAS Youth & Sports Development Centre (EYSDC)", description: "Focuses on youth development, empowerment, participation and sports development at the regional level." },
  { name: "ECOWAS Gender Development Centre (EGDC)", description: "Promotes gender equality and the integration of gender considerations into ECOWAS policies, programmes and regional development initiatives." },
  { name: "ECOWAS Brown Card", description: "Provides a regional motor-vehicle insurance mechanism intended to facilitate movement across member states and provide third-party liability protection." },
  { name: "ECOWAS Centre for Renewable Energy & Energy Efficiency (ECREEE)", description: "Promotes renewable energy, energy efficiency and sustainable energy development across West Africa." },
  { name: "ECOWAS Regional Electricity Regulatory Authority (ERERA)", description: "Provides regional regulatory oversight for cross-border electricity trade and the regional electricity market." },
  { name: "Regional Agency for Agriculture & Food (RAAF)", description: "Implements regional agricultural programmes and supports the operationalization of ECOWAS agricultural policy, including food and agricultural development." },
  { name: "Project Preparation & Development Unit (PPDU)", description: "Supports the preparation and development of regional infrastructure projects, helping move priority projects toward implementation." },
];
