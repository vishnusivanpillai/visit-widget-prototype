import { MapPin, User, Clock, Phone } from "lucide-react";
import { useState } from "react";
import type { Visit } from "../types/visit";

interface VisitCardProps {
  visit: Visit;
}

const statusConfig: Record<
  Visit["status"],
  { label: string; color: string; bgColor: string }
> = {
  awaiting_confirmation: {
    label: "Awaiting Confirmation",
    color: "#FF8800",
    bgColor: "#FFF3E0",
  },
  confirmed: {
    label: "Confirmed",
    color: "#0055B8",
    bgColor: "#E3F2FD",
  },
  surveyor_on_way: {
    label: "On the Way",
    color: "#0055B8",
    bgColor: "#E3F2FD",
  },
  surveyor_on_site: {
    label: "On Site",
    color: "#003781",
    bgColor: "#E3F2FD",
  },
  inspection_complete: {
    label: "Complete",
    color: "#008A00",
    bgColor: "#E8F5E9",
  },
  inspection_incomplete: {
    label: "Incomplete",
    color: "#FF8800",
    bgColor: "#FFF3E0",
  },
  report_issued: {
    label: "Report Issued",
    color: "#008A00",
    bgColor: "#E8F5E9",
  },
};

export function VisitCard({ visit }: VisitCardProps) {
  const [showSurveyorModal, setShowSurveyorModal] = useState(false);
  const currentStatus = statusConfig[visit.status];

  return (
    <>
      <div className="bg-white border border-[#E8EBED] rounded p-3 mb-2 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate text-[#003781]">
              {visit.locationName}
            </p>
            <p className="text-xs text-[#5A6872] mt-0.5">{visit.postcode}</p>
            <div className="flex items-center gap-1 text-xs text-[#5A6872] mt-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{visit.startTime} - {visit.endTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#5A6872] mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{visit.address}</span>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-[#5A6872] mb-3">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{visit.surveyor.name}</span>
          </div>
          <button
            onClick={() => setShowSurveyorModal(true)}
            className="p-1.5 rounded-full hover:bg-[#E3F2FD] transition-colors flex-shrink-0"
            title="Contact surveyor"
          >
            <Phone className="w-3.5 h-3.5 text-[#003781]" />
          </button>
        </div>

        {/* Status Display (Read-only) */}
        <div
          className="px-2 py-1.5 rounded text-xs text-center"
          style={{
            backgroundColor: currentStatus.bgColor,
            color: currentStatus.color,
          }}
        >
          {currentStatus.label}
        </div>
      </div>

      {/* Surveyor Details Modal */}
      {showSurveyorModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSurveyorModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E8EBED]">
              <div className="w-12 h-12 bg-[#003781] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-[#003781]">Surveyor Details</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#5A6872] mb-1">Name</p>
                <p className="text-sm text-[#003781]">{visit.surveyor.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6872] mb-1">Email</p>
                <a
                  href={`mailto:${visit.surveyor.email}`}
                  className="text-sm text-[#0055B8] hover:underline"
                >
                  {visit.surveyor.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-[#5A6872] mb-1">Phone</p>
                <a
                  href={`tel:${visit.surveyor.phone}`}
                  className="text-sm text-[#0055B8] hover:underline"
                >
                  {visit.surveyor.phone}
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowSurveyorModal(false)}
              className="mt-6 w-full px-4 py-2 bg-[#003781] text-white rounded hover:bg-[#0055B8] transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
}