export type UserRole = 'student' | 'hoc' | 'hod' | 'admin';

export interface User {
  id: string;
  name: string;
  surname: string;
  matricNumber: string;
  department: string;
  level: string;
  cgpa: number;
  role: UserRole;
  feesDue: number;
  profilePic?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Academic' | 'Sports' | 'General' | 'Important';
  authorId: string;
  isRead?: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  type: 'Core' | 'Elective';
  department: string;
  isRegistered?: boolean;
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  time: string;
  venue: string;
  day: string;
  color: string;
  isCancelled?: boolean;
  isPostponed?: boolean;
  updatedAt?: any;
  updatedBy?: string;
}

export interface Result {
  id: string;
  courseCode: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  units: number;
  semester: 'Harmattan' | 'Rain';
  year: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  reference: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: 'Admin' | 'Academic' | 'Recreation' | 'Hostel' | 'Gate';
  description: string;
  lat: number;
  lng: number;
}

export type Tab = 'home' | 'courses' | 'timetable' | 'results' | 'map' | 'payments' | 'admin' | 'approvals' | 'idcard' | 'schedule_manager';

export interface RegistrationRequest {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  courses: string[]; // array of course codes
  totalUnits: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  level: string;
}
