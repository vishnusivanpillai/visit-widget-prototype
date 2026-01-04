# Timeline Status Widget

A React-based visit management dashboard with timeline visualization for surveyor scheduling and visit tracking. This application provides an interactive calendar view to manage and monitor surveyor visits across different time periods with comprehensive filtering and status tracking capabilities.

**Original Design**: [Figma - Timeline Status Widget](https://www.figma.com/design/ekcKo4aqYDNWT7QpTGsHCe/Timeline-Status-Widget)

## Features

- **Multiple View Modes**: Switch between Today, Working Week, Week, and Month views
- **Visit Status Tracking**: Track visits through multiple states (allocated, not-confirmed, waiting-for-confirmation, confirmed, complete, cancelled)
- **Visit Type Management**: Support for different visit types (NBI, MAP, Territory)
- **Smart Filtering**: Filter visits by status and surveyor
- **Unscheduled Visits Pane**: Dedicated sidebar for unallocated visits
- **Detailed Visit Modals**: View comprehensive visit information including site contacts, expected plants, and inspection items
- **Time Block Visualization**: Visual representation of visits in time slots
- **Date Navigation**: Easy navigation through different time periods
- **Responsive Design**: Built with Tailwind CSS for responsive layouts

## Tech Stack

### Core
- **React** 18.3.1 - UI framework
- **TypeScript** - Type safety
- **Vite** 6.3.5 - Build tool and dev server
- **Tailwind CSS** 4.1.12 - Utility-first CSS framework

### UI Libraries
- **Radix UI** - Accessible component primitives (accordion, dialog, dropdown, etc.)
- **Material UI Icons** - Icon library
- **Lucide React** - Additional icon set
- **shadcn/ui** - Pre-built component patterns

### Utilities
- **date-fns** - Date manipulation and formatting
- **clsx + tailwind-merge** - Conditional className handling
- **class-variance-authority** - Component variant management
- **motion** (Framer Motion) - Animations

## Prerequisites

- **Node.js** - Version 16.x or higher recommended
- **npm** - Comes with Node.js

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "Timeline Status Widget"
   ```

2. **Install dependencies**:
   ```bash
   npm i
   ```
   This will install all required packages (347 packages total).

## Running Locally

### Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173/
- The server typically starts in under 1 second

The dev server includes:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- TypeScript type checking

### Production Build

Build the application for production:

```bash
npm run build
```

This creates an optimized build in the `dist` directory.

## Project Structure

```
Timeline Status Widget/
├── src/
│   ├── main.tsx                     # Application entry point
│   ├── app/
│   │   ├── App.tsx                  # Root component
│   │   ├── types/
│   │   │   └── visit.ts             # TypeScript type definitions
│   │   └── components/
│   │       ├── VisitDashboard.tsx           # Main dashboard with mock data
│   │       ├── VisitCalendarWidget.tsx      # Calendar view component
│   │       ├── TimeBlockedVisit.tsx         # Time block visualization
│   │       ├── VisitCard.tsx                # Individual visit cards
│   │       ├── VisitDetailsModal.tsx        # Detailed visit information
│   │       ├── DayDetailModal.tsx           # Day-level details
│   │       ├── ItemsReportsModal.tsx        # Inspection items view
│   │       ├── ui/                          # shadcn/ui components (48+ components)
│   │       └── figma/
│   │           └── ImageWithFallback.tsx    # Image utilities
│   └── styles/
│       ├── index.css                # Main stylesheet
│       ├── fonts.css                # Custom fonts
│       ├── tailwind.css             # Tailwind configuration
│       └── theme.css                # CSS custom properties
├── index.html                       # HTML entry point
├── vite.config.ts                   # Vite configuration
├── postcss.config.mjs               # PostCSS configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Key Concepts

### Visit Types

The application supports three types of visits:

- **NBI** - NBI inspections with expected plants tracking
- **MAP** - MAP visits with scheduled locations and map-specific contacts
- **Territory** - General territory visits

### Visit Status Flow

Visits progress through the following statuses:

1. **Allocated** - Unscheduled visits (appear in sidebar)
2. **Not Confirmed** - Scheduled but awaiting confirmation
3. **Waiting for Confirmation** - Confirmation in progress
4. **Confirmed** - Visit confirmed
5. **Complete** - Visit completed
6. **Cancelled** - Visit cancelled

### Data Model

The core `Visit` interface includes:
- Location details (name, address, postcode)
- Time slots (startTime, endTime)
- Surveyor information
- Status and type
- Site contacts
- Expected plants (for NBI)
- Inspection items

See `src/app/types/visit.ts` for complete type definitions.

## Development Notes

### Mock Data

Currently uses mock data generated in `src/app/components/VisitDashboard.tsx`. The `generateMockVisits()` function creates sample visits across multiple days and surveyors for demonstration purposes.

### Path Alias

The `@` alias resolves to the `./src` directory:

```typescript
import { Visit } from "@/app/types/visit"
```

### Styling

- Uses Tailwind CSS 4.x with utility classes
- Custom theme defined in `src/styles/theme.css`
- Component variants managed with `class-variance-authority`
- Responsive design with mobile-first approach

### Date Handling

All date operations use `date-fns` library functions:
- `format()` - Date formatting
- `startOfWeek()`, `endOfWeek()` - Week boundaries
- `isSameDay()`, `isToday()` - Date comparisons
- `addDays()`, `subDays()` - Date arithmetic

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

See ATTRIBUTIONS.md for third-party licenses and attributions.

## Additional Resources

- [Original Figma Design](https://www.figma.com/design/ekcKo4aqYDNWT7QpTGsHCe/Timeline-Status-Widget)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
