import { X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { VisitCard } from "./VisitCard";
import type { Visit } from "../types/visit";

interface DayDetailModalProps {
  date: Date;
  visits: Visit[];
  onClose: () => void;
}

export function DayDetailModal({ date, visits, onClose }: DayDetailModalProps) {
  // Sort visits by start time
  const sortedVisits = [...visits].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8EBED]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003781] rounded flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[#003781]">{format(date, "EEEE, dd MMMM yyyy")}</h3>
              <p className="text-sm text-[#5A6872]">
                {sortedVisits.length} visit{sortedVisits.length !== 1 ? "s" : ""} scheduled
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5F7FA] rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#5A6872]" />
          </button>
        </div>

        {/* Visits List */}
        <div className="flex-1 overflow-y-auto p-4">
          {sortedVisits.length === 0 ? (
            <div className="text-center py-8 text-[#5A6872]">
              <p>No visits scheduled for this day</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedVisits.map((visit) => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8EBED]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#003781] text-white rounded hover:bg-[#0055B8] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
