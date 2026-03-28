export type Gender = "Male" | "Female" | "Other";

export type CaseStatus = "Pending" | "Matched" | "Closed";

export interface PersonRecord {
  id: string;
  name: string;
  age?: number;
  gender?: Gender;
  location?: string;
  description: string;
  imageUrl: string;
  contact?: string;
}

export interface AlertRecord {
  id: string;
  personImage: string;
  confidence: number;
  location: string;
  contactInfo: string;
}

export interface AdminCaseRecord {
  id: string;
  title: string;
  status: CaseStatus;
  mediaType: "image" | "video";
}

export interface BackendMissingReport {
  _id: string;
  name?: string | null;
  age?: number | null;
  gender?: string | null;
  last_seen_location?: string | null;
  additional_info?: string | null;
  image_path: string;
  created_at: string;
}

export interface BackendFoundReport {
  _id: string;
  found_location?: string | null;
  contact_info?: string | null;
  additional_info?: string | null;
  image_path: string;
  created_at: string;
}

export interface BackendAlert {
  _id: string;
  missing_id: string;
  found_id: string;
  similarity: number;
  created_at: string;
}

export interface CreateMissingPayload {
  name: string;
  age: string;
  gender: string;
  description: string;
  lastSeenLocation: string;
  image: File;
}

export interface CreateFoundPayload {
  location: string;
  description: string;
  contact: string;
  image: File;
}
