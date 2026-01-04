# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based visit management dashboard with timeline visualization. This project visualizes surveyor visits across different time periods (today, working week, week, month) with status tracking, filtering, and detailed visit information modals.

**Original Design**: https://www.figma.com/design/ekcKo4aqYDNWT7QpTGsHCe/Timeline-Status-Widget

## Development Commands

### Setup
```bash
npm i  # Install dependencies (uses npm, not pnpm despite pnpm overrides in package.json)
```

### Development
```bash
npm run dev  # Start Vite dev server (typically http://localhost:5173)
```

### Build
```bash
npm run build  # Production build using Vite
```

## Architecture

### Entry Points
- `index.html` → `src/main.tsx` → `src/app/App.tsx` → `VisitDashboard`
- Single-page application with React 18 and createRoot

### Directory Structure
```
src/
├── app/
│   ├── App.tsx                      # Root app component
│   ├── types/
│   │   └── visit.ts                 # Core type definitions for Visit, Status, etc.
│   └── components/
│       ├── VisitDashboard.tsx       # Main dashboard with mock data
│       ├── VisitCalendarWidget.tsx  # Timeline view with date navigation
│       ├── TimeBlockedVisit.tsx     # Individual visit time blocks
│       ├── VisitCard.tsx            # Visit card in calendar
│       ├── VisitDetailsModal.tsx    # Detailed visit information modal
│       ├── DayDetailModal.tsx       # Day-level visit details
│       ├── ItemsReportsModal.tsx    # Inspection items modal
│       ├── ui/                      # Radix UI + shadcn/ui components (48+ components)
│       └── figma/
│           └── ImageWithFallback.tsx # Image handling utility
└── styles/
    ├── index.css      # Main stylesheet (imports fonts, tailwind, theme)
    ├── fonts.css      # Custom font definitions
    ├── tailwind.css   # Tailwind base/utilities
    └── theme.css      # CSS custom properties for theming
```

### Core Domain Model

**Visit Types** (`src/app/types/visit.ts`):
- `nbi` - NBI inspections (have expectedPlants)
- `map` - MAP visits (have mapSiteContacts and scheduledLocation)
- `territory` - Territory visits

**Visit Statuses** (in priority order):
- `allocated` - Unscheduled visits (appear in sidebar pane)
- `not-confirmed` - Scheduled but not confirmed
- `waiting-for-confirmation` - Awaiting confirmation
- `confirmed` - Confirmed visits
- `complete` - Completed visits
- `cancelled` - Cancelled visits

**Visit Interface**: See `src/app/types/visit.ts` for complete type definitions including:
- Core fields: locationName, postcode, address, startTime, endTime, surveyor
- Related types: Surveyor, SiteContact, MapSiteContact, ScheduledLocation, ExpectedPlant, InspectionItem

### State Management

Uses React useState for all state (no Redux/Context):
- Current date/view selection in VisitCalendarWidget
- Filter states (status, surveyor)
- Modal visibility states
- Dropdown/submenu states

### Data Flow

1. Mock data generated in `VisitDashboard.tsx` (`generateMockVisits()`)
2. Visits passed as props to `VisitCalendarWidget`
3. Calendar widget filters/groups visits by:
   - Date range (based on viewType)
   - Status (scheduled vs unscheduled/allocated)
   - Selected filters (status, surveyor)
4. TimeBlockedVisit components render individual visit blocks
5. Modals triggered by visit card clicks show detailed information

### Key Libraries

**UI Framework**:
- React 18.3.1 with TypeScript
- Vite 6.3.5 for build tooling
- Tailwind CSS 4.1.12 (v4 with Vite plugin)

**Component Libraries**:
- Radix UI primitives (@radix-ui/react-*)
- Material UI icons (@mui/icons-material)
- Lucide React icons
- shadcn/ui patterns (in src/app/components/ui/)

**Date Handling**:
- date-fns (format, startOfWeek, endOfWeek, isSameDay, etc.)
- All date manipulation uses date-fns functions

**Utilities**:
- clsx + tailwind-merge for className management
- class-variance-authority for component variants
- motion (Framer Motion) for animations

## Path Alias

`@` resolves to `./src` (configured in vite.config.ts)

Example: `import { Visit } from "@/app/types/visit"`

## Styling Approach

- Tailwind CSS 4.x with utility classes
- Custom CSS properties in theme.css for theming
- Responsive design with flexbox/grid layouts
- shadcn/ui component patterns with cva for variants

## Important Notes

- **React and Tailwind plugins required**: Do not remove from vite.config.ts even if Tailwind appears unused
- **No testing framework**: No test commands or test files in project
- **No git**: This is not a git repository
- **Mock data**: All visits are generated in VisitDashboard.tsx - no backend integration
- **Time format**: Uses "HH:mm" format (e.g., "09:00", "17:30")
- **Date handling**: Always use date-fns functions, never native Date methods for manipulation
