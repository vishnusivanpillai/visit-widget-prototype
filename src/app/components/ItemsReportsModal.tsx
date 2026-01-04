import { X, FileText, Download, Search } from "lucide-react";
import type { Visit } from "../types/visit";

interface ItemsReportsModalProps {
  visit: Visit;
  onClose: () => void;
}

export function ItemsReportsModal({ visit, onClose }: ItemsReportsModalProps) {
  const items = visit.items || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-[#E8EBED] flex-shrink-0">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-[#003781] mb-1 md:mb-2 text-base md:text-lg">Items & Reports</h2>
              <p className="text-xs sm:text-sm text-[#5A6872] truncate">
                {visit.locationName}, {visit.postcode}
              </p>
              <p className="text-xs text-[#5A6872] mt-1 hidden sm:block">
                Select an item to view item details and previous inspection reports
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-[#F5F7FA] rounded transition-colors ml-2 sm:ml-4 flex-shrink-0"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A6872]" />
            </button>
          </div>

          {/* Info bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs sm:text-sm text-[#5A6872]">
              Matching items: <span className="font-semibold">{items.length}</span>
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs text-[#003781] hover:bg-[#F5F7FA] rounded transition-colors">
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Download (zip)</span>
              </button>
              <button className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs text-[#003781] hover:bg-[#F5F7FA] rounded transition-colors">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#E8EBED]">
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Current report
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Serial no.
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Plant no.
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Plant description
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Discipline
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Last inspected
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Defect code
                  </th>
                  <th className="text-left p-3 text-xs text-[#5A6872] font-normal whitespace-nowrap">
                    Next due
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[#5A6872]">
                      No items found for this visit
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-[#E8EBED] hover:bg-[#F5F7FA] transition-colors ${
                        index % 2 === 1 ? "bg-[#FAFBFC]" : ""
                      }`}
                    >
                      <td className="p-3">
                        <input type="checkbox" className="w-4 h-4" />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0055B8]" />
                          <span className="text-sm text-[#003781]">
                            {item.currentReport}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-[#5A6872]">
                        {item.serialNo}
                      </td>
                      <td className="p-3 text-sm text-[#5A6872]">
                        {item.plantNo}
                      </td>
                      <td className="p-3 text-sm text-[#5A6872]">
                        {item.plantDescription}
                      </td>
                      <td className="p-3 text-sm text-[#5A6872]">
                        {item.discipline}
                      </td>
                      <td className="p-3 text-sm text-[#5A6872]">
                        {item.lastInspected}
                      </td>
                      <td className="p-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                          style={{
                            backgroundColor:
                              item.defectCode === "N" ? "#008A00" : "#0055B8",
                          }}
                        >
                          {item.defectCode}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-[#5A6872]">
                        {item.nextDue}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-[#E8EBED] flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003781] text-white rounded hover:bg-[#0055B8] transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}