import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Visit } from "../types/visit";

interface VisitDetailsModalProps {
  visit: Visit;
  onClose: () => void;
  onVisitStatusChange?: (visitId: string, newStatus: Visit["status"]) => void;
}

export function VisitDetailsModal({ visit, onClose, onVisitStatusChange }: VisitDetailsModalProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "engineer-surveyors" // First section expanded by default
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'confirm' | 'decline' | 'reschedule' | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  // Get confirmation dialog details based on action
  const getConfirmationDetails = () => {
    const visitDateTime = `${format(visit.date, "dd MMM yyyy")} at ${visit.startTime}`;

    switch (pendingAction) {
      case 'confirm':
        return {
          title: "Confirm Visit",
          message: `Are you sure you want to confirm this visit for ${visitDateTime}?`,
          confirmLabel: "Yes, Confirm",
          confirmStyle: "bg-[#003781] hover:bg-[#0055B8]"
        };
      case 'decline':
        return {
          title: "Decline Visit",
          message: "Are you sure you want to decline this visit? The scheduling team will be notified.",
          confirmLabel: "Yes, Decline",
          confirmStyle: "bg-[#5A6872] hover:bg-[#003781]"
        };
      case 'reschedule':
        return {
          title: "Request Reschedule",
          message: "Are you sure you want to request a reschedule? The scheduling team will contact you to arrange a new time.",
          confirmLabel: "Yes, Request Reschedule",
          confirmStyle: "bg-[#003781] hover:bg-[#0055B8]"
        };
      default:
        return null;
    }
  };

  // Handle action button clicks
  const handleConfirm = () => {
    setPendingAction('confirm');
    setShowConfirmDialog(true);
  };

  const handleDecline = () => {
    setPendingAction('decline');
    setShowConfirmDialog(true);
  };

  const handleReschedule = () => {
    setPendingAction('reschedule');
    setShowConfirmDialog(true);
  };

  // Execute the pending action
  const executeAction = () => {
    if (!onVisitStatusChange || !pendingAction) return;

    let newStatus: Visit["status"];
    let toastMessage: string;

    switch (pendingAction) {
      case 'confirm':
        newStatus = 'confirmed';
        toastMessage = 'Visit confirmed successfully';
        break;
      case 'decline':
        newStatus = 'cancelled';
        toastMessage = 'Visit declined. The team will be notified.';
        break;
      case 'reschedule':
        newStatus = 'allocated';
        toastMessage = 'Reschedule request sent. The team will contact you.';
        break;
      default:
        return;
    }

    // Update the status
    onVisitStatusChange(visit.id, newStatus);

    // Show success toast
    toast.success(toastMessage);

    // Close confirmation dialog
    setShowConfirmDialog(false);
    setPendingAction(null);

    // Close the modal
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal - Full screen on mobile, centered on desktop */}
      <div className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white md:rounded-lg shadow-xl z-50 w-full md:max-w-4xl md:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8EBED] flex-shrink-0">
          <h2 className="text-[#003781]">Visit Details</h2>
          <button
            onClick={onClose}
            className="text-[#5A6872] hover:text-[#003781] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {/* Section 1: Engineer Surveyor Contacts - Always visible */}
            <div className="border border-[#E8EBED] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("engineer-surveyors")}
                className="w-full flex items-center justify-between p-4 bg-[#F5F7FA] hover:bg-[#E8EBED] transition-colors"
              >
                <span className="text-sm font-medium text-[#003781]">
                  Engineer surveyor contacts
                </span>
                {expandedSection === "engineer-surveyors" ? (
                  <ChevronUp className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                )}
              </button>
              {expandedSection === "engineer-surveyors" && (
                <div className="p-4 bg-white">
                  {/* Desktop: Table view */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E8EBED]">
                          <th className="text-left pb-2 font-medium text-[#003781]">Name</th>
                          <th className="text-left pb-2 font-medium text-[#003781]">Discipline</th>
                          <th className="text-left pb-2 font-medium text-[#003781]">Contact number</th>
                          <th className="text-left pb-2 font-medium text-[#003781]">Email address</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#E8EBED] last:border-0">
                          <td className="py-3 text-[#5A6872]">{visit.surveyor.name}</td>
                          <td className="py-3 text-[#5A6872]">{visit.surveyor.discipline}</td>
                          <td className="py-3 text-[#5A6872]">{visit.surveyor.phone}</td>
                          <td className="py-3 text-[#5A6872]">
                            <a
                              href={`mailto:${visit.surveyor.email}`}
                              className="text-[#0055B8] hover:underline break-all"
                            >
                              {visit.surveyor.email}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile: Card view */}
                  <div className="md:hidden space-y-3">
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs font-medium text-[#003781] mb-1">Name</div>
                        <div className="text-sm text-[#5A6872]">{visit.surveyor.name}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#003781] mb-1">Discipline</div>
                        <div className="text-sm text-[#5A6872]">{visit.surveyor.discipline}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#003781] mb-1">Contact number</div>
                        <div className="text-sm text-[#5A6872]">
                          <a href={`tel:${visit.surveyor.phone}`} className="text-[#0055B8] hover:underline">
                            {visit.surveyor.phone}
                          </a>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#003781] mb-1">Email address</div>
                        <div className="text-sm text-[#5A6872]">
                          <a
                            href={`mailto:${visit.surveyor.email}`}
                            className="text-[#0055B8] hover:underline break-all"
                          >
                            {visit.surveyor.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Site Contacts - Always visible */}
            <div className="border border-[#E8EBED] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("site-contacts")}
                className="w-full flex items-center justify-between p-4 bg-[#F5F7FA] hover:bg-[#E8EBED] transition-colors"
              >
                <span className="text-sm font-medium text-[#0055B8]">
                  Site contacts
                </span>
                {expandedSection === "site-contacts" ? (
                  <ChevronUp className="w-4 h-4 text-[#0055B8] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0055B8] flex-shrink-0" />
                )}
              </button>
              {expandedSection === "site-contacts" && (
                <div className="p-4 bg-white">
                  {/* Desktop: Table view */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E8EBED]">
                          <th className="text-left pb-2 pr-4 font-medium text-[#003781]">Name</th>
                          <th className="text-left pb-2 pr-4 font-medium text-[#003781]">Discipline</th>
                          <th className="text-left pb-2 pr-4 font-medium text-[#003781]">Phone number</th>
                          <th className="text-left pb-2 pr-4 font-medium text-[#003781]">Mobile number</th>
                          <th className="text-left pb-2 pr-4 font-medium text-[#003781]">Email address</th>
                          <th className="text-left pb-2 font-medium text-[#003781]">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visit.siteContacts.map((contact, index) => (
                          <tr key={index} className="border-b border-[#E8EBED] last:border-0">
                            <td className="py-3 pr-4 text-[#5A6872]">{contact.name}</td>
                            <td className="py-3 pr-4 text-[#5A6872]">{contact.discipline}</td>
                            <td className="py-3 pr-4 text-[#5A6872]">{contact.phoneNumber}</td>
                            <td className="py-3 pr-4 text-[#5A6872]">{contact.mobileNumber}</td>
                            <td className="py-3 pr-4 text-[#5A6872]">
                              {contact.emailAddress === "—" ? (
                                "—"
                              ) : (
                                <a
                                  href={`mailto:${contact.emailAddress}`}
                                  className="text-[#0055B8] hover:underline break-all"
                                >
                                  {contact.emailAddress}
                                </a>
                              )}
                            </td>
                            <td className="py-3 text-[#5A6872]">{contact.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile: Card view */}
                  <div className="md:hidden space-y-4">
                    {visit.siteContacts.map((contact, index) => (
                      <div key={index} className="pb-4 border-b border-[#E8EBED] last:border-0 space-y-2">
                        <div>
                          <div className="text-xs font-medium text-[#003781] mb-1">Name</div>
                          <div className="text-sm text-[#5A6872]">{contact.name}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#003781] mb-1">Discipline</div>
                          <div className="text-sm text-[#5A6872]">{contact.discipline}</div>
                        </div>
                        {contact.phoneNumber && (
                          <div>
                            <div className="text-xs font-medium text-[#003781] mb-1">Phone number</div>
                            <div className="text-sm text-[#5A6872]">
                              <a href={`tel:${contact.phoneNumber}`} className="text-[#0055B8] hover:underline">
                                {contact.phoneNumber}
                              </a>
                            </div>
                          </div>
                        )}
                        {contact.mobileNumber && (
                          <div>
                            <div className="text-xs font-medium text-[#003781] mb-1">Mobile number</div>
                            <div className="text-sm text-[#5A6872]">
                              <a href={`tel:${contact.mobileNumber}`} className="text-[#0055B8] hover:underline">
                                {contact.mobileNumber}
                              </a>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-medium text-[#003781] mb-1">Email address</div>
                          <div className="text-sm text-[#5A6872]">
                            {contact.emailAddress === "—" ? (
                              "—"
                            ) : (
                              <a
                                href={`mailto:${contact.emailAddress}`}
                                className="text-[#0055B8] hover:underline break-all"
                              >
                                {contact.emailAddress}
                              </a>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#003781] mb-1">Position</div>
                          <div className="text-sm text-[#5A6872]">{contact.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: MAP Site Contacts - Only for MAP visits */}
            {visit.visitType === "map" && visit.mapSiteContacts && (
              <div className="border border-[#E8EBED] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("map-site-contacts")}
                  className="w-full flex items-center justify-between p-4 bg-[#F5F7FA] hover:bg-[#E8EBED] transition-colors"
                >
                  <span className="text-sm font-medium text-[#003781]">
                    MAP Site contacts
                  </span>
                  {expandedSection === "map-site-contacts" ? (
                    <ChevronUp className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                  )}
                </button>
                {expandedSection === "map-site-contacts" && (
                  <div className="p-4 bg-white">
                    {/* Desktop: Table view */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#E8EBED]">
                            <th className="text-left pb-2 font-medium text-[#003781]">Name</th>
                            <th className="text-left pb-2 font-medium text-[#003781]">Phone number</th>
                            <th className="text-left pb-2 font-medium text-[#003781]">Mobile number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visit.mapSiteContacts.map((contact, index) => (
                            <tr key={index} className="border-b border-[#E8EBED] last:border-0">
                              <td className="py-3 text-[#5A6872]">{contact.name}</td>
                              <td className="py-3 text-[#5A6872]">{contact.phoneNumber}</td>
                              <td className="py-3 text-[#5A6872]">{contact.mobileNumber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile: Card view */}
                    <div className="md:hidden space-y-4">
                      {visit.mapSiteContacts.map((contact, index) => (
                        <div key={index} className="pb-4 border-b border-[#E8EBED] last:border-0 space-y-2">
                          <div>
                            <div className="text-xs font-medium text-[#003781] mb-1">Name</div>
                            <div className="text-sm text-[#5A6872]">{contact.name}</div>
                          </div>
                          {contact.phoneNumber && (
                            <div>
                              <div className="text-xs font-medium text-[#003781] mb-1">Phone number</div>
                              <div className="text-sm text-[#5A6872]">
                                <a href={`tel:${contact.phoneNumber}`} className="text-[#0055B8] hover:underline">
                                  {contact.phoneNumber}
                                </a>
                              </div>
                            </div>
                          )}
                          {contact.mobileNumber && (
                            <div>
                              <div className="text-xs font-medium text-[#003781] mb-1">Mobile number</div>
                              <div className="text-sm text-[#5A6872]">
                                <a href={`tel:${contact.mobileNumber}`} className="text-[#0055B8] hover:underline">
                                  {contact.mobileNumber}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 4: Visit Scheduled At - Only for MAP visits */}
            {visit.visitType === "map" && visit.scheduledLocation && (
              <div className="border border-[#E8EBED] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("scheduled-location")}
                  className="w-full flex items-center justify-between p-4 bg-[#F5F7FA] hover:bg-[#E8EBED] transition-colors"
                >
                  <span className="text-sm font-medium text-[#003781]">
                    Visit scheduled at
                  </span>
                  {expandedSection === "scheduled-location" ? (
                    <ChevronUp className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                  )}
                </button>
                {expandedSection === "scheduled-location" && (
                  <div className="p-4 bg-white">
                    <div className="text-sm text-[#5A6872] space-y-1">
                      <p>{visit.scheduledLocation.name}</p>
                      <p>{visit.scheduledLocation.address}</p>
                      <p>{visit.scheduledLocation.postcode}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 5: Expected Plants Items - Only for NBI visits */}
            {visit.visitType === "nbi" && visit.expectedPlants && (
              <div className="border border-[#E8EBED] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("expected-plants")}
                  className="w-full flex items-center justify-between p-4 bg-[#F5F7FA] hover:bg-[#E8EBED] transition-colors"
                >
                  <span className="text-sm font-medium text-[#003781]">
                    Expected Plants Items
                  </span>
                  {expandedSection === "expected-plants" ? (
                    <ChevronUp className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5A6872] flex-shrink-0" />
                  )}
                </button>
                {expandedSection === "expected-plants" && (
                  <div className="p-4 bg-white">
                    {/* Desktop: Table view */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#E8EBED]">
                            <th className="text-left pb-2 font-medium text-[#003781]">Plant</th>
                            <th className="text-left pb-2 font-medium text-[#003781]">Estimated Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visit.expectedPlants.map((plant, index) => (
                            <tr key={index} className="border-b border-[#E8EBED] last:border-0">
                              <td className="py-3 text-[#5A6872]">{plant.plant}</td>
                              <td className="py-3 text-[#5A6872]">{plant.estimatedQuantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile: Card view */}
                    <div className="md:hidden space-y-3">
                      {visit.expectedPlants.map((plant, index) => (
                        <div key={index} className="pb-3 border-b border-[#E8EBED] last:border-0 space-y-2">
                          <div>
                            <div className="text-xs font-medium text-[#003781] mb-1">Plant</div>
                            <div className="text-sm text-[#5A6872]">{plant.plant}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-[#003781] mb-1">Estimated Quantity</div>
                            <div className="text-sm text-[#5A6872]">{plant.estimatedQuantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8EBED] flex-shrink-0">
          {visit.status === 'waiting-for-confirmation' ? (
            // Customer action buttons
            <div className="flex flex-col md:flex-row gap-3 justify-end">
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-[#003781] text-white rounded hover:bg-[#0055B8] transition-colors text-sm font-medium"
              >
                Confirm
              </button>
              <button
                onClick={handleReschedule}
                className="px-6 py-2 border-2 border-[#003781] text-[#003781] rounded hover:bg-[#E3F2FD] transition-colors text-sm font-medium"
              >
                Request Reschedule
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-2 border border-[#5A6872] text-[#5A6872] rounded hover:bg-[#F5F7FA] transition-colors text-sm font-medium"
              >
                Decline
              </button>
            </div>
          ) : (
            // Default close button for other statuses
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#003781] text-white rounded hover:bg-[#0055B8] transition-colors text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <>
          {/* Dialog Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 z-[60]"
            onClick={() => {
              setShowConfirmDialog(false);
              setPendingAction(null);
            }}
          />

          {/* Dialog Content */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-[70] w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-[#003781] mb-3">
                {getConfirmationDetails()?.title}
              </h3>
              <p className="text-sm text-[#5A6872] mb-6">
                {getConfirmationDetails()?.message}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setPendingAction(null);
                  }}
                  className="px-6 py-2 border border-[#E8EBED] text-[#5A6872] rounded hover:bg-[#F5F7FA] transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  className={`px-6 py-2 text-white rounded transition-colors text-sm font-medium ${getConfirmationDetails()?.confirmStyle}`}
                >
                  {getConfirmationDetails()?.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}