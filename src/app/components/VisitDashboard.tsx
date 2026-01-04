import { useState, useMemo } from "react";
import { VisitCalendarWidget } from "./VisitCalendarWidget";
import { SummaryBanner } from "./SummaryBanner";
import type { Visit } from "../types/visit";

// Mock data for demonstration - visits across different days and surveyors
const generateMockVisits = (): Visit[] => {
  const today = new Date();
  console.log("Today's date:", today);
  console.log("Total visits being generated");

  const visits: Visit[] = [
    // Today's visits - NBI visit
    {
      id: "1",
      locationName: "Westminster Office Building",
      postcode: "SW1A 1AA",
      address: "123 High Street, London",
      startTime: "09:00",
      endTime: "11:00",
      surveyor: {
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+44 20 7123 4567",
        discipline: "EL",
      },
      status: "confirmed",
      date: new Date(today),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Sarah Johnson",
          discipline: "Facilities Manager",
          phoneNumber: "020 7946 0958",
          mobileNumber: "07912 345 678",
          emailAddress: "sarah.johnson@westminster.co.uk",
          position: "Primary Contact",
        },
        {
          name: "David Brown",
          discipline: "Health & Safety",
          phoneNumber: "020 7946 0959",
          mobileNumber: "07823 456 789",
          emailAddress: "david.brown@westminster.co.uk",
          position: "Secondary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Passenger Lift (8 person)",
          estimatedQuantity: 3,
        },
        {
          plant: "Emergency Generator (100kVA)",
          estimatedQuantity: 1,
        },
        {
          plant: "Fire Alarm System",
          estimatedQuantity: 1,
        },
        {
          plant: "Emergency Lighting Units",
          estimatedQuantity: 45,
        },
      ],
      items: [
        {
          id: "item-1",
          currentReport: "..001466",
          serialNo: "JH63277/AA78",
          plantNo: "—",
          plantDescription: "Chain Sling",
          discipline: "Lift and Crane",
          lastInspected: "18-12-2025",
          defectCode: "N",
          nextDue: "18-06-2026",
        },
        {
          id: "item-2",
          currentReport: "..001466",
          serialNo: "JH73250.8",
          plantNo: "—",
          plantDescription: "Chain Sling",
          discipline: "Lift and Crane",
          lastInspected: "18-12-2025",
          defectCode: "N",
          nextDue: "18-06-2026",
        },
        {
          id: "item-3",
          currentReport: "..001466",
          serialNo: "JH73243.3",
          plantNo: "—",
          plantDescription: "Chain Sling",
          discipline: "Lift and Crane",
          lastInspected: "18-12-2025",
          defectCode: "N",
          nextDue: "18-06-2026",
        },
      ],
    },
    // WAITING FOR CONFIRMATION - Today's visit
    {
      id: "1a",
      locationName: "Birmingham Manufacturing Plant",
      postcode: "B1 1AA",
      address: "50 Industrial Estate, Birmingham",
      startTime: "10:00",
      endTime: "12:00",
      surveyor: {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+44 121 234 5678",
        discipline: "MH",
      },
      status: "waiting-for-confirmation",
      date: new Date(today),
      visitType: "territory",
      siteContacts: [
        {
          name: "Robert Anderson",
          discipline: "Plant Manager",
          phoneNumber: "0121 345 6789",
          mobileNumber: "07912 345 678",
          emailAddress: "r.anderson@birminghamplant.co.uk",
          position: "Primary Contact",
        },
      ],
      items: [
        {
          id: "item-1a-1",
          currentReport: "..001500",
          serialNo: "BP12345/C01",
          plantNo: "PLT-100",
          plantDescription: "Overhead Crane",
          discipline: "Lift and Crane",
          lastInspected: "10-12-2025",
          defectCode: "N",
          nextDue: "10-06-2026",
        },
      ],
    },
    // WAITING FOR CONFIRMATION - Tomorrow's visit
    {
      id: "1b",
      locationName: "Leeds Office Complex",
      postcode: "LS1 2AB",
      address: "25 Wellington Street, Leeds",
      startTime: "09:00",
      endTime: "11:00",
      surveyor: {
        name: "Sarah Parker",
        email: "sarah.parker@example.com",
        phone: "+44 113 234 5678",
        discipline: "EL",
      },
      status: "waiting-for-confirmation",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), // Tomorrow
      visitType: "nbi",
      siteContacts: [
        {
          name: "David Thompson",
          discipline: "Building Manager",
          phoneNumber: "0113 456 7890",
          mobileNumber: "07823 456 789",
          emailAddress: "d.thompson@leedsoffice.co.uk",
          position: "Primary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Emergency Lighting System",
          estimatedQuantity: 50,
        },
        {
          plant: "Fire Alarm Control Panel",
          estimatedQuantity: 2,
        },
      ],
      items: [],
    },
    // MAP visit - UNSCHEDULED (earliest due date)
    {
      id: "2",
      locationName: "Manchester Retail Centre",
      postcode: "M1 4BT",
      address: "45 Park Avenue, Manchester",
      startTime: "14:30",
      endTime: "16:30",
      surveyor: {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        phone: "+44 161 234 5678",
        discipline: "MH",
      },
      status: "allocated",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), // Due in 3 days
      visitType: "map",
      siteContacts: [
        {
          name: "Michael Thompson",
          discipline: "Operations Manager",
          phoneNumber: "0161 234 5670",
          mobileNumber: "07934 567 890",
          emailAddress: "m.thompson@manchesterretail.co.uk",
          position: "Primary Contact",
        },
      ],
      mapSiteContacts: [
        {
          name: "Peter Wilson",
          phoneNumber: "0161 789 4563",
          mobileNumber: "07845 123 456",
        },
        {
          name: "Jane Roberts",
          phoneNumber: "0161 789 4564",
          mobileNumber: "07856 234 567",
        },
      ],
      scheduledLocation: {
        name: "Manchester Equipment Depot",
        address: "Unit 5, Industrial Park, Trafford",
        postcode: "Manchester M16 5GH",
      },
      items: [
        {
          id: "item-4",
          currentReport: "..002134",
          serialNo: "MR45678/B12",
          plantNo: "PLT-001",
          plantDescription: "Forklift",
          discipline: "Material Handling",
          lastInspected: "15-12-2025",
          defectCode: "A",
          nextDue: "15-06-2026",
        },
        {
          id: "item-5",
          currentReport: "..002134",
          serialNo: "MR45679/B13",
          plantNo: "PLT-002",
          plantDescription: "Pallet Jack",
          discipline: "Material Handling",
          lastInspected: "15-12-2025",
          defectCode: "N",
          nextDue: "15-06-2026",
        },
      ],
    },
    // Same location, same time - TODAY - Visit 1 (Mike Davis - Electrical)
    {
      id: "20",
      locationName: "London Tech Campus",
      postcode: "EC1A 1BB",
      address: "200 City Road, London",
      startTime: "13:00",
      endTime: "15:00",
      surveyor: {
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+44 20 7123 4567",
        discipline: "EL",
      },
      status: "confirmed",
      date: new Date(today),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Jennifer Collins",
          discipline: "Facilities Director",
          phoneNumber: "020 7946 1234",
          mobileNumber: "07912 456 789",
          emailAddress: "j.collins@londontechcampus.co.uk",
          position: "Primary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Electrical Distribution Board",
          estimatedQuantity: 8,
        },
        {
          plant: "Emergency Generator (200kVA)",
          estimatedQuantity: 2,
        },
        {
          plant: "UPS System",
          estimatedQuantity: 3,
        },
      ],
      items: [],
    },
    // Same location, same time - TODAY - Visit 2 (Emma Wilson - Pressure Systems)
    {
      id: "21",
      locationName: "London Tech Campus",
      postcode: "EC1A 1BB",
      address: "200 City Road, London",
      startTime: "13:00",
      endTime: "15:00",
      surveyor: {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        phone: "+44 161 234 5678",
        discipline: "PS",
      },
      status: "confirmed",
      date: new Date(today),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Jennifer Collins",
          discipline: "Facilities Director",
          phoneNumber: "020 7946 1234",
          mobileNumber: "07912 456 789",
          emailAddress: "j.collins@londontechcampus.co.uk",
          position: "Primary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Pressure Vessel (750L)",
          estimatedQuantity: 4,
        },
        {
          plant: "Steam Boiler",
          estimatedQuantity: 2,
        },
        {
          plant: "Air Compressor (15 bar)",
          estimatedQuantity: 3,
        },
      ],
      items: [],
    },
    // Tomorrow - NBI visit
    {
      id: "3",
      locationName: "Birmingham Commercial Complex",
      postcode: "B5 4QW",
      address: "78 Queen's Road, Birmingham",
      startTime: "10:00",
      endTime: "12:30",
      surveyor: {
        name: "Tom Harris",
        email: "tom.harris@example.com",
        phone: "+44 121 345 6789",
        discipline: "FS",
      },
      status: "not-confirmed",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Robert Davies",
          discipline: "Building Manager",
          phoneNumber: "0121 496 0123",
          mobileNumber: "07789 123 456",
          emailAddress: "r.davies@bhamcommercial.co.uk",
          position: "Primary Contact",
        },
        {
          name: "Lisa Martinez",
          discipline: "Safety Officer",
          phoneNumber: "0121 496 0124",
          mobileNumber: "07890 234 567",
          emailAddress: "l.martinez@bhamcommercial.co.uk",
          position: "Secondary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Fire Extinguisher (CO2)",
          estimatedQuantity: 12,
        },
        {
          plant: "Fire Extinguisher (Foam)",
          estimatedQuantity: 8,
        },
        {
          plant: "Emergency Lighting",
          estimatedQuantity: 67,
        },
        {
          plant: "Fire Door (60min rated)",
          estimatedQuantity: 24,
        },
      ],
      items: [
        {
          id: "item-6",
          currentReport: "..003456",
          serialNo: "BC98765/X01",
          plantNo: "—",
          plantDescription: "Fire Extinguisher",
          discipline: "Fire Safety",
          lastInspected: "10-12-2025",
          defectCode: "N",
          nextDue: "10-12-2026",
        },
      ],
    },
    // Territory visit
    {
      id: "4",
      locationName: "Edinburgh Historic Property",
      postcode: "EH1 2PQ",
      address: "92 King Street, Edinburgh",
      startTime: "15:00",
      endTime: "17:00",
      surveyor: {
        name: "Sarah Thompson",
        email: "sarah.thompson@example.com",
        phone: "+44 131 456 7890",
        discipline: "PS",
      },
      status: "waiting-for-confirmation",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      visitType: "territory",
      siteContacts: [
        {
          name: "Andrew MacDonald",
          discipline: "Estate Manager",
          phoneNumber: "0131 225 9876",
          mobileNumber: "07701 234 567",
          emailAddress: "a.macdonald@edinburghestates.co.uk",
          position: "Primary Contact",
        },
      ],
      items: [
        {
          id: "item-7",
          currentReport: "..004567",
          serialNo: "EH12345/HP1",
          plantNo: "—",
          plantDescription: "Pressure Vessel",
          discipline: "Pressure Systems",
          lastInspected: "05-12-2025",
          defectCode: "B",
          nextDue: "05-06-2026",
        },
        {
          id: "item-8",
          currentReport: "..004567",
          serialNo: "EH12346/HP2",
          plantNo: "—",
          plantDescription: "Steam Boiler",
          discipline: "Pressure Systems",
          lastInspected: "05-12-2025",
          defectCode: "N",
          nextDue: "05-06-2026",
        },
      ],
    },
    // Day after tomorrow - Territory visit
    {
      id: "5",
      locationName: "Bristol Warehouse",
      postcode: "BS1 3XE",
      address: "56 Castle Lane, Bristol",
      startTime: "08:30",
      endTime: "10:00",
      surveyor: {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        phone: "+44 161 234 5678",
        discipline: "LC",
      },
      status: "confirmed",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      visitType: "territory",
      siteContacts: [
        {
          name: "Christopher Lee",
          discipline: "Warehouse Manager",
          phoneNumber: "0117 927 3456",
          mobileNumber: "07612 345 678",
          emailAddress: "c.lee@bristolwarehouse.co.uk",
          position: "Primary Contact",
        },
        {
          name: "Amanda White",
          discipline: "Logistics",
          phoneNumber: "0117 927 3457",
          mobileNumber: "07723 456 789",
          emailAddress: "a.white@bristolwarehouse.co.uk",
          position: "Secondary Contact",
        },
      ],
      items: [
        {
          id: "item-9",
          currentReport: "..005678",
          serialNo: "BW78901/C45",
          plantNo: "—",
          plantDescription: "Overhead Crane",
          discipline: "Lift and Crane",
          lastInspected: "01-12-2025",
          defectCode: "N",
          nextDue: "01-12-2026",
        },
      ],
    },
    // NBI visit
    {
      id: "11",
      locationName: "Oxford Research Centre",
      postcode: "OX1 2JD",
      address: "101 Science Park, Oxford",
      startTime: "10:30",
      endTime: "12:30",
      surveyor: {
        name: "James Anderson",
        email: "james.anderson@example.com",
        phone: "+44 1865 123 456",
        discipline: "PS",
      },
      status: "allocated",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Dr. Helen Foster",
          discipline: "Laboratory Director",
          phoneNumber: "01865 272 123",
          mobileNumber: "07834 567 890",
          emailAddress: "h.foster@oxfordresearch.ac.uk",
          position: "Primary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Laboratory Fume Hood",
          estimatedQuantity: 15,
        },
        {
          plant: "Autoclave (Class B)",
          estimatedQuantity: 3,
        },
        {
          plant: "Compressed Gas Cylinders",
          estimatedQuantity: 40,
        },
        {
          plant: "Pressure Relief Valves",
          estimatedQuantity: 25,
        },
      ],
      items: [],
    },
    // Territory visit
    {
      id: "12",
      locationName: "Reading Tech Hub",
      postcode: "RG1 1AB",
      address: "45 Thames Valley Park, Reading",
      startTime: "13:00",
      endTime: "15:00",
      surveyor: {
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+44 20 7123 4567",
        discipline: "ME",
      },
      status: "confirmed",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      visitType: "territory",
      siteContacts: [
        {
          name: "Raj Patel",
          discipline: "IT Manager",
          phoneNumber: "0118 957 2345",
          mobileNumber: "07945 678 901",
          emailAddress: "r.patel@readingtech.com",
          position: "Primary Contact",
        },
      ],
      items: [
        {
          id: "item-15",
          currentReport: "..011234",
          serialNo: "RD23456/TH1",
          plantNo: "PLT-005",
          plantDescription: "Air Conditioning Unit",
          discipline: "Mechanical",
          lastInspected: "22-12-2025",
          defectCode: "N",
          nextDue: "22-06-2026",
        },
      ],
    },
    // Territory visit
    {
      id: "13",
      locationName: "Southampton Distribution Centre",
      postcode: "SO14 3BG",
      address: "88 Logistics Park, Southampton",
      startTime: "15:30",
      endTime: "17:30",
      surveyor: {
        name: "Tom Harris",
        email: "tom.harris@example.com",
        phone: "+44 121 345 6789",
        discipline: "MH",
      },
      status: "waiting-for-confirmation",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      visitType: "territory",
      siteContacts: [
        {
          name: "Kevin Murphy",
          discipline: "Distribution Manager",
          phoneNumber: "023 8063 4567",
          mobileNumber: "07856 789 012",
          emailAddress: "k.murphy@southamptondist.co.uk",
          position: "Primary Contact",
        },
        {
          name: "Gemma Clarke",
          discipline: "Operations",
          phoneNumber: "023 8063 4568",
          mobileNumber: "07967 890 123",
          emailAddress: "g.clarke@southamptondist.co.uk",
          position: "Secondary Contact",
        },
      ],
      items: [
        {
          id: "item-16",
          currentReport: "..012345",
          serialNo: "SO34567/DC1",
          plantNo: "—",
          plantDescription: "Conveyor Belt",
          discipline: "Material Handling",
          lastInspected: "20-12-2025",
          defectCode: "A",
          nextDue: "20-06-2026",
        },
      ],
    },
    // Next week - MAP visit
    {
      id: "6",
      locationName: "Leeds Shopping Plaza",
      postcode: "LS1 6AB",
      address: "34 Church Road, Leeds",
      startTime: "09:30",
      endTime: "11:30",
      surveyor: {
        name: "Tom Harris",
        email: "tom.harris@example.com",
        phone: "+44 121 345 6789",
        discipline: "LC",
      },
      status: "allocated",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      visitType: "map",
      siteContacts: [
        {
          name: "Simon Baker",
          discipline: "Facilities Director",
          phoneNumber: "0113 245 6789",
          mobileNumber: "07678 901 234",
          emailAddress: "s.baker@leedsplaza.co.uk",
          position: "Primary Contact",
        },
      ],
      mapSiteContacts: [
        {
          name: "Mark Stevens",
          phoneNumber: "0113 287 9456",
          mobileNumber: "07789 012 345",
        },
        {
          name: "Claire Hughes",
          phoneNumber: "0113 287 9457",
          mobileNumber: "07890 123 456",
        },
      ],
      scheduledLocation: {
        name: "Leeds Service Centre",
        address: "45 Industrial Road, Holbeck",
        postcode: "Leeds LS10 2AB",
      },
      items: [
        {
          id: "item-10",
          currentReport: "..006789",
          serialNo: "LS23456/SP1",
          plantNo: "—",
          plantDescription: "Escalator",
          discipline: "Lift and Crane",
          lastInspected: "20-11-2025",
          defectCode: "N",
          nextDue: "20-05-2026",
        },
      ],
    },
    // Same location, same time, different surveyor - Visit 1
    {
      id: "14",
      locationName: "Nottingham Industrial Complex",
      postcode: "NG1 5FS",
      address: "120 Victoria Street, Nottingham",
      startTime: "10:00",
      endTime: "12:00",
      surveyor: {
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+44 20 7123 4567",
        discipline: "EL",
      },
      status: "confirmed",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Graham Wilson",
          discipline: "Operations Director",
          phoneNumber: "0115 948 1234",
          mobileNumber: "07845 678 901",
          emailAddress: "g.wilson@nottinghamind.co.uk",
          position: "Primary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Electrical Distribution Board",
          estimatedQuantity: 5,
        },
        {
          plant: "Emergency Generator (150kVA)",
          estimatedQuantity: 2,
        },
        {
          plant: "UPS System",
          estimatedQuantity: 1,
        },
      ],
      items: [],
    },
    // Same location, same time, different surveyor - Visit 2
    {
      id: "15",
      locationName: "Nottingham Industrial Complex",
      postcode: "NG1 5FS",
      address: "120 Victoria Street, Nottingham",
      startTime: "10:00",
      endTime: "12:00",
      surveyor: {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        phone: "+44 161 234 5678",
        discipline: "PS",
      },
      status: "confirmed",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Graham Wilson",
          discipline: "Operations Director",
          phoneNumber: "0115 948 1234",
          mobileNumber: "07845 678 901",
          emailAddress: "g.wilson@nottinghamind.co.uk",
          position: "Primary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Pressure Vessel (500L)",
          estimatedQuantity: 3,
        },
        {
          plant: "Steam Boiler",
          estimatedQuantity: 2,
        },
        {
          plant: "Air Compressor (10 bar)",
          estimatedQuantity: 4,
        },
      ],
      items: [],
    },
    // NBI visit - Next week
    {
      id: "16",
      locationName: "Sheffield Manufacturing Plant",
      postcode: "S1 2JE",
      address: "55 Industrial Way, Sheffield",
      startTime: "09:00",
      endTime: "11:30",
      surveyor: {
        name: "James Anderson",
        email: "james.anderson@example.com",
        phone: "+44 1865 123 456",
        discipline: "MH",
      },
      status: "allocated",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Richard Taylor",
          discipline: "Plant Manager",
          phoneNumber: "0114 272 5678",
          mobileNumber: "07956 789 012",
          emailAddress: "r.taylor@sheffieldmanuf.co.uk",
          position: "Primary Contact",
        },
        {
          name: "Susan Mitchell",
          discipline: "Safety Manager",
          phoneNumber: "0114 272 5679",
          mobileNumber: "07967 890 123",
          emailAddress: "s.mitchell@sheffieldmanuf.co.uk",
          position: "Secondary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Overhead Crane (5 ton)",
          estimatedQuantity: 6,
        },
        {
          plant: "Forklift (Electric)",
          estimatedQuantity: 8,
        },
        {
          plant: "Pallet Truck",
          estimatedQuantity: 12,
        },
        {
          plant: "Hoist (Chain)",
          estimatedQuantity: 4,
        },
      ],
      items: [],
    },
    // MAP visit - Next week
    {
      id: "17",
      locationName: "Brighton Hotel Complex",
      postcode: "BN1 2HE",
      address: "78 Marine Parade, Brighton",
      startTime: "13:30",
      endTime: "15:30",
      surveyor: {
        name: "Sarah Thompson",
        email: "sarah.thompson@example.com",
        phone: "+44 131 456 7890",
        discipline: "LC",
      },
      status: "waiting-for-confirmation",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9),
      visitType: "map",
      siteContacts: [
        {
          name: "Oliver Bennett",
          discipline: "Hotel Manager",
          phoneNumber: "01273 123 4567",
          mobileNumber: "07834 901 234",
          emailAddress: "o.bennett@brightonhotel.co.uk",
          position: "Primary Contact",
        },
      ],
      mapSiteContacts: [
        {
          name: "Thomas Green",
          phoneNumber: "01273 456 7890",
          mobileNumber: "07901 234 567",
        },
      ],
      scheduledLocation: {
        name: "Brighton Maintenance Depot",
        address: "12 Service Road, Hove",
        postcode: "Brighton BN3 4GH",
      },
      items: [
        {
          id: "item-17",
          currentReport: "..013456",
          serialNo: "BH23456/HC1",
          plantNo: "—",
          plantDescription: "Passenger Lift",
          discipline: "Lift and Crane",
          lastInspected: "28-12-2025",
          defectCode: "N",
          nextDue: "28-06-2026",
        },
      ],
    },
    // Territory visit - Next week
    {
      id: "18",
      locationName: "Plymouth Dockyard",
      postcode: "PL1 3RP",
      address: "99 Commercial Wharf, Plymouth",
      startTime: "11:00",
      endTime: "13:30",
      surveyor: {
        name: "Tom Harris",
        email: "tom.harris@example.com",
        phone: "+44 121 345 6789",
        discipline: "LC",
      },
      status: "confirmed",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      visitType: "territory",
      siteContacts: [
        {
          name: "William Morgan",
          discipline: "Dockyard Supervisor",
          phoneNumber: "01752 123 4567",
          mobileNumber: "07712 345 678",
          emailAddress: "w.morgan@plymouthdock.co.uk",
          position: "Primary Contact",
        },
      ],
      items: [
        {
          id: "item-18",
          currentReport: "..014567",
          serialNo: "PD34567/DY1",
          plantNo: "—",
          plantDescription: "Mobile Crane",
          discipline: "Lift and Crane",
          lastInspected: "30-12-2025",
          defectCode: "N",
          nextDue: "30-06-2026",
        },
        {
          id: "item-19",
          currentReport: "..014567",
          serialNo: "PD34568/DY2",
          plantNo: "—",
          plantDescription: "Gantry Crane",
          discipline: "Lift and Crane",
          lastInspected: "30-12-2025",
          defectCode: "B",
          nextDue: "30-06-2026",
        },
      ],
    },
    // NBI visit - Next week
    {
      id: "19",
      locationName: "Derby Corporate Centre",
      postcode: "DE1 2QR",
      address: "45 Business Park Drive, Derby",
      startTime: "08:00",
      endTime: "10:00",
      surveyor: {
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+44 20 7123 4567",
        discipline: "FS",
      },
      status: "allocated",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11),
      visitType: "nbi",
      siteContacts: [
        {
          name: "Patricia Hughes",
          discipline: "Facilities Coordinator",
          phoneNumber: "01332 123 4567",
          mobileNumber: "07823 456 789",
          emailAddress: "p.hughes@derbycorp.co.uk",
          position: "Primary Contact",
        },
      ],
      expectedPlants: [
        {
          plant: "Fire Alarm Panel",
          estimatedQuantity: 2,
        },
        {
          plant: "Fire Extinguisher (Various)",
          estimatedQuantity: 35,
        },
        {
          plant: "Emergency Exit Lights",
          estimatedQuantity: 58,
        },
        {
          plant: "Fire Hose Reel",
          estimatedQuantity: 8,
        },
      ],
      items: [],
    },
    // Territory visit
    {
      id: "7",
      locationName: "Glasgow Business Park",
      postcode: "G1 1PW",
      address: "88 Market Street, Glasgow",
      startTime: "13:00",
      endTime: "15:30",
      surveyor: {
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+44 20 7123 4567",
        discipline: "LC",
      },
      status: "confirmed",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      visitType: "territory",
      siteContacts: [
        {
          name: "Ian Campbell",
          discipline: "Property Manager",
          phoneNumber: "0141 204 5678",
          mobileNumber: "07901 234 567",
          emailAddress: "i.campbell@glasgowbusiness.co.uk",
          position: "Primary Contact",
        },
      ],
      items: [
        {
          id: "item-11",
          currentReport: "..007890",
          serialNo: "GB34567/BP1",
          plantNo: "—",
          plantDescription: "Lifting Equipment",
          discipline: "Lift and Crane",
          lastInspected: "25-11-2025",
          defectCode: "N",
          nextDue: "25-05-2026",
        },
      ],
    },
    // Yesterday - completed - Territory visit
    {
      id: "8",
      locationName: "Liverpool Industrial Unit",
      postcode: "L1 8JQ",
      address: "67 Victoria Road, Liverpool",
      startTime: "10:30",
      endTime: "13:00",
      surveyor: {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        phone: "+44 161 234 5678",
        discipline: "PS",
      },
      status: "complete",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      visitType: "territory",
      siteContacts: [
        {
          name: "Paul Harrison",
          discipline: "Plant Manager",
          phoneNumber: "0151 709 8765",
          mobileNumber: "07812 345 678",
          emailAddress: "p.harrison@liverpoolindustrial.co.uk",
          position: "Primary Contact",
        },
      ],
      items: [
        {
          id: "item-12",
          currentReport: "..008901",
          serialNo: "LI45678/IU1",
          plantNo: "—",
          plantDescription: "Compressor",
          discipline: "Pressure Systems",
          lastInspected: "24-12-2025",
          defectCode: "N",
          nextDue: "24-06-2026",
        },
      ],
    },
    // Territory visit
    {
      id: "9",
      locationName: "Cardiff Office Tower",
      postcode: "CF10 1AZ",
      address: "22 Oxford Street, Cardiff",
      startTime: "14:00",
      endTime: "16:00",
      surveyor: {
        name: "Sarah Thompson",
        email: "sarah.thompson@example.com",
        phone: "+44 131 456 7890",
        discipline: "LC",
      },
      status: "complete",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      visitType: "territory",
      siteContacts: [
        {
          name: "Daniel Evans",
          discipline: "Building Services",
          phoneNumber: "029 2022 3456",
          mobileNumber: "07723 456 789",
          emailAddress: "d.evans@cardifftower.co.uk",
          position: "Primary Contact",
        },
      ],
      items: [
        {
          id: "item-13",
          currentReport: "..009012",
          serialNo: "CF56789/OT1",
          plantNo: "—",
          plantDescription: "Lift",
          discipline: "Lift and Crane",
          lastInspected: "24-12-2025",
          defectCode: "N",
          nextDue: "24-06-2026",
        },
      ],
    },
    // Last week - MAP visit
    {
      id: "10",
      locationName: "Newcastle Storage Facility",
      postcode: "NE1 4ST",
      address: "90 Station Road, Newcastle",
      startTime: "11:30",
      endTime: "13:30",
      surveyor: {
        name: "James Anderson",
        email: "james.anderson@example.com",
        phone: "+44 1865 123 456",
        discipline: "MH",
      },
      status: "complete",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
      visitType: "map",
      siteContacts: [
        {
          name: "Stephen Wright",
          discipline: "Storage Manager",
          phoneNumber: "0191 232 4567",
          mobileNumber: "07634 567 890",
          emailAddress: "s.wright@newcastlestorage.co.uk",
          position: "Primary Contact",
        },
      ],
      mapSiteContacts: [
        {
          name: "Martin Cooper",
          phoneNumber: "0191 478 2345",
          mobileNumber: "07745 123 456",
        },
      ],
      scheduledLocation: {
        name: "Newcastle Equipment Centre",
        address: "67 Storage Lane, Team Valley",
        postcode: "Newcastle NE5 3ST",
      },
      items: [
        {
          id: "item-14",
          currentReport: "..010123",
          serialNo: "NE67890/SF1",
          plantNo: "—",
          plantDescription: "Racking System",
          discipline: "Material Handling",
          lastInspected: "21-12-2025",
          defectCode: "N",
          nextDue: "21-06-2026",
        },
      ],
    },
  ];

  return visits;
};

type VisitStatus = "not-confirmed" | "waiting-for-confirmation" | "confirmed" | "complete" | "cancelled";

export function VisitDashboard() {
  const [visits, setVisits] = useState<Visit[]>(generateMockVisits());
  const [statusFilter, setStatusFilter] = useState<VisitStatus | "all">("all");
  const [showBanner, setShowBanner] = useState(true);

  // Count visits awaiting confirmation
  const waitingCount = useMemo(
    () => visits.filter((v) => v.status === "waiting-for-confirmation").length,
    [visits]
  );

  // Handler to update visit status
  const handleVisitStatusChange = (visitId: string, newStatus: Visit["status"]) => {
    setVisits((prevVisits) =>
      prevVisits.map((visit) =>
        visit.id === visitId ? { ...visit, status: newStatus } : visit
      )
    );
  };

  // Handler for banner click - set filter to waiting-for-confirmation
  const handleBannerClick = () => {
    setStatusFilter("waiting-for-confirmation");
  };

  // Handler for banner dismiss
  const handleBannerDismiss = () => {
    setShowBanner(false);
  };

  // Re-show banner when new visits need confirmation
  useMemo(() => {
    if (waitingCount > 0) {
      setShowBanner(true);
    }
  }, [waitingCount]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[#003781] mb-2">Dashboard</h1>
        <p className="text-sm text-[#5A6872]">
          Manage your property inspection visits
        </p>
      </div>

      {/* Summary Banner + Calendar Widget Container */}
      <div className="max-w-7xl">
        {/* Summary Banner */}
        {showBanner && waitingCount > 0 && (
          <SummaryBanner
            count={waitingCount}
            onClick={handleBannerClick}
            onDismiss={handleBannerDismiss}
            autoHideDuration={15000}
          />
        )}

        {/* Embedded Widget - This is what would go into your existing dashboard */}
        <VisitCalendarWidget
          visits={visits}
          initialStatusFilter={statusFilter}
          onVisitStatusChange={handleVisitStatusChange}
        />
      </div>

      {/* Optional: Other dashboard widgets would go here */}
      <div className="mt-6 p-4 bg-white border border-[#E8EBED] rounded-lg">
        <p className="text-sm text-[#5A6872]">
          ℹ️ This calendar widget can be embedded into your existing
          application. The widget is self-contained and manages visit schedules.
          Status is read-only and updated from your third-party application.
        </p>
      </div>
    </div>
  );
}