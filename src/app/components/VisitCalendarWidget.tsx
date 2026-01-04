import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, Filter, Check, ChevronRightIcon, X } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addDays,
  subDays,
  isSameMonth,
} from "date-fns";
import { TimeBlockedVisit } from "./TimeBlockedVisit";
import type { Visit } from "../types/visit";

type ViewType = "today" | "working-week" | "week" | "month";
type VisitStatus = "not-confirmed" | "waiting-for-confirmation" | "confirmed" | "complete" | "cancelled";

interface VisitCalendarWidgetProps {
  visits: Visit[];
  onVisitStatusChange?: (visitId: string, newStatus: Visit["status"]) => void;
  initialStatusFilter?: VisitStatus | "all";
}

const viewLabels: Record<ViewType, string> = {
  today: "Today",
  "working-week": "Working Week",
  week: "Week",
  month: "Month",
};

const statusLabels: Record<VisitStatus, string> = {
  "not-confirmed": "Not Confirmed",
  "waiting-for-confirmation": "Waiting for Confirmation",
  confirmed: "Confirmed",
  complete: "Complete",
  cancelled: "Cancelled",
};

export function VisitCalendarWidget({
  visits,
  onVisitStatusChange,
  initialStatusFilter = "all",
}: VisitCalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("working-week");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const [showSurveyorSubmenu, setShowSurveyorSubmenu] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<VisitStatus | "all">(initialStatusFilter);
  const [selectedSurveyorFilter, setSelectedSurveyorFilter] = useState<string>("all");
  const [showUnscheduledPane, setShowUnscheduledPane] = useState(false);

  // Update filter when initialStatusFilter changes (e.g., from banner click)
  useEffect(() => {
    setSelectedStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);

  // Separate scheduled and unscheduled visits
  const scheduledVisits = visits.filter((visit) => {
    return visit.status !== "allocated";
  });

  const unscheduledVisits = visits.filter((visit) => {
    return visit.status === "allocated";
  });

  // Get unique surveyors from scheduled visits only
  const uniqueSurveyors = Array.from(
    new Set(scheduledVisits.map((visit) => visit.surveyor.name))
  ).sort();

  const getDaysToDisplay = (): Date[] => {
    switch (viewType) {
      case "today":
        return [currentDate];
      case "working-week": {
        const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday = 0
        return Array.from({ length: 5 }, (_, i) => addDays(start, i + 1)); // Mon-Fri
      }
      case "week": {
        const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday = 0
        const end = endOfWeek(currentDate, { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
      }
      case "month": {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const start = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday = 0
        const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
      }
      default:
        return [];
    }
  };

  const navigatePrevious = () => {
    switch (viewType) {
      case "today":
        setCurrentDate(subDays(currentDate, 1));
        break;
      case "working-week":
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewType) {
      case "today":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "working-week":
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    setCurrentDate(today);
  };

  const goToDayView = (day: Date) => {
    setCurrentDate(day);
    setViewType("today");
  };

  const getHeaderTitle = () => {
    switch (viewType) {
      case "today":
        return format(currentDate, "EEEE, dd MMMM yyyy");
      case "working-week":
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(weekStart, "dd MMM")} - ${format(weekEnd, "dd MMM yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
      default:
        return "";
    }
  };

  const days = getDaysToDisplay();

  const getVisitsForDay = (day: Date): Visit[] => {
    return scheduledVisits
      .filter((visit) => {
        const matchesDay = isSameDay(visit.date, day);
        const matchesStatus = selectedStatusFilter === "all" || visit.status === selectedStatusFilter;
        const matchesSurveyor = selectedSurveyorFilter === "all" || visit.surveyor.name === selectedSurveyorFilter;
        return matchesDay && matchesStatus && matchesSurveyor;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const isMonthView = viewType === "month";

  // Sort unscheduled visits by date (ascending) - using date as "due date"
  const sortedUnscheduledVisits = [...unscheduledVisits].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="flex flex-col lg:flex-row bg-white border border-[#E8EBED] rounded-lg shadow-sm relative max-h-[700px]">
      {/* Main Calendar Section */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-[#E8EBED] flex-shrink-0">
        <div className="flex items-center justify-between gap-2 md:gap-3">
          {/* Left side: Today button + Navigation + Date */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 overflow-hidden">
            <button
              onClick={goToToday}
              className="px-2 md:px-3 py-1.5 text-xs md:text-sm bg-[#003781] text-white rounded hover:bg-[#0055B8] transition-colors whitespace-nowrap flex-shrink-0"
            >
              Today
            </button>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={navigatePrevious}
                className="p-1.5 md:p-2 hover:bg-[#F5F7FA] rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#003781]" />
              </button>
              <button
                onClick={navigateNext}
                className="p-1.5 md:p-2 hover:bg-[#F5F7FA] rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#003781]" />
              </button>
            </div>

            <h3 className="text-[#003781] text-sm md:text-base truncate hidden sm:block">{getHeaderTitle()}</h3>
          </div>

          {/* Right side: Filter + View Selector Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm bg-white border border-[#E8EBED] rounded hover:bg-[#F5F7FA] transition-colors"
              >
                <Filter className="w-3 h-3 md:w-4 md:h-4 text-[#003781]" />
                <span className="text-[#003781] hidden md:inline">
                  {selectedStatusFilter !== "all" || selectedSurveyorFilter !== "all" ? "Filter applied" : "Filter"}
                </span>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-[#5A6872]" />
              </button>

              {showFilterDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                      setShowFilterDropdown(false);
                      setShowStatusSubmenu(false);
                      setShowSurveyorSubmenu(false);
                    }}
                  />
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#E8EBED] rounded shadow-lg z-20 min-w-[180px]">
                    {/* All option */}
                    <button
                      onClick={() => {
                        setSelectedStatusFilter("all");
                        setSelectedSurveyorFilter("all");
                        setShowFilterDropdown(false);
                        setShowStatusSubmenu(false);
                        setShowSurveyorSubmenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors flex items-center justify-between ${
                        selectedStatusFilter === "all" && selectedSurveyorFilter === "all"
                          ? "text-[#003781]"
                          : "text-[#5A6872]"
                      }`}
                    >
                      <span>All</span>
                      {(selectedStatusFilter === "all" && selectedSurveyorFilter === "all") && (
                        <Check className="w-4 h-4 text-[#003781]" />
                      )}
                    </button>

                    {/* Status submenu */}
                    <div
                      className="relative"
                      onMouseEnter={() => setShowStatusSubmenu(true)}
                      onMouseLeave={() => setShowStatusSubmenu(false)}
                    >
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors text-[#5A6872] flex items-center justify-between"
                      >
                        <span>Status</span>
                        <ChevronRightIcon className="w-4 h-4 text-[#5A6872]" />
                      </button>

                      {/* Status submenu dropdown */}
                      {showStatusSubmenu && (
                        <div className="absolute top-0 left-full ml-1 bg-white border border-[#E8EBED] rounded shadow-lg z-30 min-w-[180px]">
                          {/* All statuses option */}
                          <button
                            onClick={() => {
                              setSelectedStatusFilter("all");
                              setShowFilterDropdown(false);
                              setShowStatusSubmenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors flex items-center justify-between ${
                              selectedStatusFilter === "all"
                                ? "text-[#003781]"
                                : "text-[#5A6872]"
                            }`}
                          >
                            <span>All</span>
                            {selectedStatusFilter === "all" && (
                              <Check className="w-4 h-4 text-[#003781]" />
                            )}
                          </button>

                          {/* Individual status options */}
                          {(["not-confirmed", "waiting-for-confirmation", "confirmed", "complete", "cancelled"] as VisitStatus[]).map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  setSelectedStatusFilter(status);
                                  setShowFilterDropdown(false);
                                  setShowStatusSubmenu(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors flex items-center justify-between ${
                                  selectedStatusFilter === status
                                    ? "text-[#003781]"
                                    : "text-[#5A6872]"
                                }`}
                              >
                                <span>{statusLabels[status]}</span>
                                {selectedStatusFilter === status && (
                                  <Check className="w-4 h-4 text-[#003781]" />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Surveyor submenu */}
                    <div
                      className="relative"
                      onMouseEnter={() => setShowSurveyorSubmenu(true)}
                      onMouseLeave={() => setShowSurveyorSubmenu(false)}
                    >
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors text-[#5A6872] flex items-center justify-between"
                      >
                        <span>Surveyor</span>
                        <ChevronRightIcon className="w-4 h-4 text-[#5A6872]" />
                      </button>

                      {/* Surveyor submenu dropdown */}
                      {showSurveyorSubmenu && (
                        <div className="absolute top-0 left-full ml-1 bg-white border border-[#E8EBED] rounded shadow-lg z-30 min-w-[180px]">
                          {/* All surveyors option */}
                          <button
                            onClick={() => {
                              setSelectedSurveyorFilter("all");
                              setShowFilterDropdown(false);
                              setShowSurveyorSubmenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors flex items-center justify-between ${
                              selectedSurveyorFilter === "all"
                                ? "text-[#003781]"
                                : "text-[#5A6872]"
                            }`}
                          >
                            <span>All</span>
                            {selectedSurveyorFilter === "all" && (
                              <Check className="w-4 h-4 text-[#003781]" />
                            )}
                          </button>

                          {/* Individual surveyor options */}
                          {uniqueSurveyors.map(
                            (surveyor) => (
                              <button
                                key={surveyor}
                                onClick={() => {
                                  setSelectedSurveyorFilter(surveyor);
                                  setShowFilterDropdown(false);
                                  setShowSurveyorSubmenu(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors flex items-center justify-between ${
                                  selectedSurveyorFilter === surveyor
                                    ? "text-[#003781]"
                                    : "text-[#5A6872]"
                                }`}
                              >
                                <span>{surveyor}</span>
                                {selectedSurveyorFilter === surveyor && (
                                  <Check className="w-4 h-4 text-[#003781]" />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* View Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowViewDropdown(!showViewDropdown)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm bg-white border border-[#E8EBED] rounded hover:bg-[#F5F7FA] transition-colors"
              >
                <span className="text-[#003781] hidden sm:inline">{viewLabels[viewType]}</span>
                <span className="text-[#003781] sm:hidden">{viewLabels[viewType].split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-[#5A6872]" />
              </button>

              {showViewDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowViewDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#E8EBED] rounded shadow-lg z-20 min-w-[160px]">
                    {(["today", "working-week", "week", "month"] as ViewType[]).map(
                      (view) => (
                        <button
                          key={view}
                          onClick={() => {
                            setViewType(view);
                            setShowViewDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F7FA] transition-colors ${
                            viewType === view
                              ? "bg-[#E3F2FD] text-[#003781]"
                              : "text-[#5A6872]"
                          }`}
                        >
                          {viewLabels[view]}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Date title for mobile - shown below on small screens */}
        <div className="sm:hidden mt-2">
          <h3 className="text-[#003781] text-sm">{getHeaderTitle()}</h3>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 flex-1 overflow-y-auto min-h-0">
        <div
          className={`grid gap-2 md:gap-3 ${
            isMonthView
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
              : viewType === "today"
              ? "grid-cols-1"
              : viewType === "working-week"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
          }`}
        >
          {days.map((day, index) => {
            const dayVisits = getVisitsForDay(day);
            const isTodayDate = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={index}
                className={`border border-[#E8EBED] rounded p-2 ${
                  isMonthView ? "min-h-[120px]" : "min-h-[200px]"
                } ${
                  !isCurrentMonth && isMonthView
                    ? "bg-[#F5F7FA] opacity-50"
                    : "bg-white"
                } ${isTodayDate ? "ring-2 ring-[#003781]" : ""}`}
              >
                {/* Day Header - Clickable in month view to open day view */}
                <div className="mb-2 pb-2 border-b border-[#E8EBED]">
                  <button
                    onClick={() => {
                      if (isMonthView && dayVisits.length > 0) {
                        goToDayView(day);
                      }
                    }}
                    className={`w-full flex items-center justify-between ${
                      isMonthView && dayVisits.length > 0
                        ? "hover:bg-[#F5F7FA] cursor-pointer rounded px-1 transition-colors"
                        : ""
                    }`}
                    disabled={!isMonthView || dayVisits.length === 0}
                  >
                    <span className="text-xs text-[#5A6872]">
                      {format(day, "EEE")}
                    </span>
                    <span
                      className={`text-sm ${
                        isTodayDate
                          ? "bg-[#003781] text-white w-6 h-6 rounded-full flex items-center justify-center"
                          : "text-[#003781]"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                  </button>
                </div>

                {/* Visits */}
                <div
                  className={`space-y-2 ${
                    isMonthView ? "max-h-[80px]" : "max-h-[400px]"
                  } overflow-y-auto scrollbar-thin scrollbar-thumb-[#003781] scrollbar-track-gray-200 hover:scrollbar-thumb-[#0055B8] pr-1`}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#003781 #E8EBED'
                  }}
                >
                  {dayVisits.length === 0 ? (
                    <p className="text-xs text-[#5A6872] text-center py-2">
                      No visits
                    </p>
                  ) : isMonthView ? (
                    // In month view, show first visit only
                    <TimeBlockedVisit visit={dayVisits[0]} onVisitStatusChange={onVisitStatusChange} />
                  ) : (
                    // In other views, show all visits as time blocks
                    dayVisits.map((visit) => (
                      <TimeBlockedVisit key={visit.id} visit={visit} onVisitStatusChange={onVisitStatusChange} />
                    ))
                  )}
                </div>

                {/* Month view footer - shows visit count, clickable to open day view */}
                {isMonthView && dayVisits.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-[#E8EBED]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToDayView(day);
                      }}
                      className="w-full text-xs text-center text-[#0055B8] hover:text-[#003781] hover:bg-[#F5F7FA] py-1 rounded transition-colors font-medium"
                    >
                      +{dayVisits.length - 1} more visit{dayVisits.length - 1 > 1 ? "s" : ""}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* Unscheduled Visits Pane - Right side on desktop, overlay on mobile */}
      {showUnscheduledPane && (
        <>
          {/* Mobile overlay backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowUnscheduledPane(false)}
          />
          
          {/* Pane content */}
          <div className="fixed lg:absolute top-0 right-0 h-screen lg:h-full lg:top-0 lg:bottom-0 w-[85%] sm:w-[350px] lg:w-[320px] bg-white border-l border-[#E8EBED] shadow-lg lg:shadow-none z-50 lg:z-auto flex flex-col overflow-hidden">
            {/* Pane Header */}
            <div className="p-4 border-b border-[#E8EBED] bg-[#F5F7FA] flex items-center justify-between flex-shrink-0">
              <h3 className="text-[#003781] font-medium">Unscheduled Visits ({unscheduledVisits.length})</h3>
              <button
                onClick={() => setShowUnscheduledPane(false)}
                className="p-1.5 hover:bg-white rounded transition-colors"
                aria-label="Close unscheduled visits pane"
              >
                <X className="w-5 h-5 text-[#003781]" />
              </button>
            </div>

            {/* Pane Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
              {unscheduledVisits.length === 0 ? (
                <p className="text-sm text-[#5A6872] text-center py-8">No unscheduled visits</p>
              ) : (
                sortedUnscheduledVisits.map((visit) => (
                  <TimeBlockedVisit key={visit.id} visit={visit} onVisitStatusChange={onVisitStatusChange} />
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Toggle button for unscheduled pane - vertical tab on right edge */}
      {!showUnscheduledPane && unscheduledVisits.length > 0 && (
        <button
          onClick={() => setShowUnscheduledPane(true)}
          className="fixed lg:absolute top-1/3 lg:top-1/2 right-0 -translate-y-1/2 bg-[#003781] text-white px-1.5 py-3 rounded-l-md shadow-md hover:bg-[#0055B8] hover:shadow-lg transition-all z-20 text-[11px] font-medium"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Unscheduled ({unscheduledVisits.length})
        </button>
      )}
    </div>
  );
}