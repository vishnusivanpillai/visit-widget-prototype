export type VisitStatus =
  | "allocated"
  | "not-confirmed"
  | "waiting-for-confirmation"
  | "confirmed"
  | "complete"
  | "cancelled";

export type VisitType = "nbi" | "map" | "territory";

export interface Surveyor {
  name: string;
  email: string;
  phone: string;
  discipline: string;
}

export interface EngineerSurveyor {
  name: string;
  discipline: string;
  contactNumber: string;
  emailAddress: string;
}

export interface SiteContact {
  name: string;
  discipline: string;
  phoneNumber: string;
  mobileNumber: string;
  emailAddress: string;
  position: string;
}

export interface MapSiteContact {
  name: string;
  phoneNumber: string;
  mobileNumber: string;
}

export interface ScheduledLocation {
  name: string;
  address: string;
  postcode: string;
}

export interface ExpectedPlant {
  plant: string;
  estimatedQuantity: number;
}

export interface InspectionItem {
  id: string;
  currentReport: string; // Report number
  serialNo: string;
  plantNo: string;
  plantDescription: string;
  discipline: string;
  lastInspected: string; // Date string
  defectCode: string;
  nextDue: string; // Date string
}

export interface Visit {
  id: string;
  locationName: string;
  postcode: string;
  address: string;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "11:00"
  surveyor: Surveyor;
  status: VisitStatus;
  date: Date;
  visitType: VisitType;
  items?: InspectionItem[]; // Items/assets to be inspected at this location
  
  // New fields for visit details
  siteContacts: SiteContact[];
  mapSiteContacts?: MapSiteContact[]; // Only for MAP visits
  scheduledLocation?: ScheduledLocation; // Only for MAP visits
  expectedPlants?: ExpectedPlant[]; // Only for NBI visits
}