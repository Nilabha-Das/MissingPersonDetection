import type { AdminCaseRecord, AlertRecord, PersonRecord } from "@/types";

export const missingPersonsMock: PersonRecord[] = [
  {
    id: "m-101",
    name: "Aarav Sharma",
    age: 14,
    gender: "Male",
    location: "Connaught Place, Delhi",
    description: "Last seen wearing a navy hoodie and black sneakers.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    contact: "+91 98765 43210",
  },
  {
    id: "m-102",
    name: "Isha Roy",
    age: 19,
    gender: "Female",
    location: "Salt Lake, Kolkata",
    description: "Carried a red backpack and white jacket.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
    contact: "+91 99887 76655",
  },
  {
    id: "m-103",
    name: "Rohan Das",
    age: 26,
    gender: "Male",
    location: "MG Road, Bengaluru",
    description: "Seen near bus station at around 8:30 PM.",
    imageUrl:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=500&q=80",
    contact: "+91 90321 76543",
  },
];

export const foundPersonsMock: PersonRecord[] = [
  {
    id: "f-201",
    name: "Unknown Male",
    location: "Howrah Station, Kolkata",
    description: "Approx age 50+, disoriented, requested water.",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
    contact: "Officer Amit - +91 90123 45678",
  },
  {
    id: "f-202",
    name: "Unknown Female",
    location: "Bandra West, Mumbai",
    description: "Approx age 30, carrying hospital discharge papers.",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&q=80",
    contact: "NGO Helpline - +91 88888 01234",
  },
  {
    id: "f-203",
    name: "Unknown Teen",
    location: "Secunderabad Junction, Hyderabad",
    description: "Approx age 15, waiting alone near platform gate.",
    imageUrl:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&q=80",
    contact: "Constable Ravi - +91 70000 11223",
  },
];

export const alertsMock: AlertRecord[] = [
  {
    id: "a-301",
    personImage:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=500&q=80",
    confidence: 93.4,
    location: "Majestic Bus Stand, Bengaluru",
    contactInfo: "+91 90321 76543",
  },
  {
    id: "a-302",
    personImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
    confidence: 88.1,
    location: "Esplanade Metro, Kolkata",
    contactInfo: "+91 99887 76655",
  },
];

export const adminCasesMock: AdminCaseRecord[] = [
  {
    id: "c-401",
    title: "Case D-1192 Corridor Feed",
    status: "Matched",
    mediaType: "video",
  },
  {
    id: "c-402",
    title: "Case H-2204 Station Entry",
    status: "Pending",
    mediaType: "image",
  },
  {
    id: "c-403",
    title: "Case K-1120 Mall Parking",
    status: "Closed",
    mediaType: "video",
  },
  {
    id: "c-404",
    title: "Case V-9001 Bus Terminal",
    status: "Pending",
    mediaType: "image",
  },
];
