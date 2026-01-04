import {
  MapPin,
  User,
  ClipboardList,
  Building2,
  Truck,
  Search,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import type { Visit } from "../types/visit";
import { ItemsReportsModal } from "./ItemsReportsModal";
import { VisitDetailsModal } from "./VisitDetailsModal";

interface TimeBlockedVisitProps {
  visit: Visit;
  onVisitStatusChange?: (visitId: string, newStatus: Visit["status"]) => void;
}

const statusConfig: Record<
  Visit["status"],
  {
    label: string;
    color: string;
    bgColor: string;
    tooltip: string;
  }
> = {
  allocated: {
    label: "Allocated",
    color: "#FF8800",
    bgColor: "#FFF3E0",
    tooltip: "Assigned to a surveyor; visit date pending.",
  },
  "not-confirmed": {
    label: "Not Confirmed",
    color: "#FF8800",
    bgColor: "#FFF3E0",
    tooltip:
      "Visit scheduled; customer contact not yet initiated.",
  },
  "waiting-for-confirmation": {
    label: "Waiting for Confirmation",
    color: "#FF8800",
    bgColor: "#FFF3E0",
    tooltip: "Customer contacted; awaiting confirmation. Click to respond.",
  },
  confirmed: {
    label: "Confirmed",
    color: "#0055B8",
    bgColor: "#E3F2FD",
    tooltip: "Visit date confirmed with the customer.",
  },
  complete: {
    label: "Complete",
    color: "#008A00",
    bgColor: "#E8F5E9",
    tooltip: "Inspection completed.",
  },
  cancelled: {
    label: "Cancelled",
    color: "#D32F2F",
    bgColor: "#FFEBEE",
    tooltip: "Visit has been cancelled.",
  },
};

const visitTypeConfig: Record<
  Visit["visitType"],
  {
    label: string;
    tooltip: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  nbi: {
    label: "New Site",
    tooltip: "New Site - Visit",
    icon: Building2,
  },
  map: {
    label: "Moved Equipment",
    tooltip: "Moved About Plant - Visit",
    icon: Truck,
  },
  territory: {
    label: "Routine",
    tooltip: "Re-visit",
    icon: Search,
  },
};

export function TimeBlockedVisit({
  visit,
  onVisitStatusChange,
}: TimeBlockedVisitProps) {
  const [showVisitDetailsModal, setShowVisitDetailsModal] =
    useState(false);
  const [showItemsReportsModal, setShowItemsReportsModal] =
    useState(false);
  const [showVisitTypeTooltip, setShowVisitTypeTooltip] =
    useState(false);
  const [showStatusTooltip, setShowStatusTooltip] =
    useState(false);

  const currentStatus = statusConfig[visit.status];
  const visitTypeInfo = visitTypeConfig[visit.visitType];
  const VisitTypeIcon = visitTypeInfo.icon;

  // Check if this is an unscheduled visit (allocated status)
  const isUnscheduled = visit.status === "allocated";

  return (
    <>
      <div
        onClick={() => setShowVisitDetailsModal(true)}
        className={`border-l-4 rounded p-2 mb-1 transition-all relative cursor-pointer ${
          visit.status === 'waiting-for-confirmation'
            ? 'hover:shadow-lg hover:scale-[1.02]'
            : 'hover:shadow-md'
        }`}
        style={{
          borderLeftColor: currentStatus.color,
          backgroundColor: currentStatus.bgColor,
        }}
      >
        {/* Visit Type Badge - Top Right Corner */}
        <div className="absolute top-2 right-2 z-10">
          <div
            className="relative"
            onMouseEnter={() => setShowVisitTypeTooltip(true)}
            onMouseLeave={() => setShowVisitTypeTooltip(false)}
          >
            <div className="flex items-center justify-center w-6 h-6 bg-white/90 backdrop-blur-sm border border-[#E8EBED] rounded cursor-help shadow-sm">
              <VisitTypeIcon className="w-3.5 h-3.5 text-[#003781]" />
            </div>

            {/* Tooltip */}
            {showVisitTypeTooltip && (
              <div className="absolute top-full right-0 mt-1 px-2 py-1 bg-[#003781] text-white text-[10px] rounded shadow-lg whitespace-nowrap z-50">
                {visitTypeInfo.tooltip}
                <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#003781]" />
              </div>
            )}
          </div>
        </div>

        {/* Time or Due Date */}
        {isUnscheduled ? (
          <p className="text-xs text-[#003781] font-medium mb-1 pr-8">
            Due: {new Date(visit.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        ) : (
          <p className="text-xs text-[#003781] font-medium mb-1 pr-8">
            {visit.startTime} - {visit.endTime}
          </p>
        )}

        {/* Location Details */}
        <p
          className="text-sm font-medium truncate"
          style={{ color: currentStatus.color }}
        >
          {visit.locationName}
        </p>
        <p className="text-xs text-[#5A6872] mt-0.5">
          {visit.postcode}
        </p>

        {/* Address */}
        <div className="flex items-center gap-1 text-xs text-[#5A6872] mb-1 mt-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{visit.address}</span>
        </div>

        {/* Surveyor */}
        <div className="flex items-center gap-1 text-xs text-[#5A6872] mb-2">
          <User className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {visit.surveyor.name}
          </span>
        </div>

        {/* Status Badge - Centered, button-like appearance */}
        <div className="relative">
          <div
            className={`w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded mb-2 md:cursor-help transition-all ${
              visit.status === 'waiting-for-confirmation'
                ? 'font-semibold animate-pulse'
                : 'font-medium'
            }`}
            style={{
              backgroundColor: currentStatus.color,
              color: "#FFFFFF",
            }}
            onMouseEnter={() => setShowStatusTooltip(true)}
            onMouseLeave={() => setShowStatusTooltip(false)}
          >
            {visit.status === 'waiting-for-confirmation' && (
              <AlertCircle className="w-3 h-3" />
            )}
            {currentStatus.label}
          </div>

          {/* Tooltip - Hidden on mobile, shown on desktop only */}
          {showStatusTooltip && (
            <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-[#003781] text-white text-[10px] leading-tight rounded shadow-lg z-[60] pointer-events-none max-w-[160px] text-center">
              {currentStatus.tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#003781]" />
            </div>
          )}
        </div>

        {/* View Items Button - Only for non-NBI visits */}
        {visit.visitType !== "nbi" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowItemsReportsModal(true);
            }}
            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-white border border-[#003781] text-[#003781] rounded hover:bg-[#F5F7FA] transition-colors cursor-pointer"
          >
            <ClipboardList className="w-3 h-3" />
            <span>View Items ({visit.items?.length || 0})</span>
          </button>
        )}
      </div>

      {/* Items Reports Modal */}
      {showItemsReportsModal && (
        <ItemsReportsModal
          visit={visit}
          onClose={() => setShowItemsReportsModal(false)}
        />
      )}

      {/* Visit Details Modal */}
      {showVisitDetailsModal && (
        <VisitDetailsModal
          visit={visit}
          onClose={() => setShowVisitDetailsModal(false)}
          onVisitStatusChange={onVisitStatusChange}
        />
      )}
    </>
  );
}