import { User, NewsItem, Course, TimetableEntry, Result, Payment, CampusLocation } from './types';

export const MOCK_USER: User = {
  id: 'student-1',
  name: 'Mof\'olunwaso',
  surname: 'Adekoya',
  matricNumber: 'LASU/2020/001',
  department: 'Computer Science',
  level: '400L',
  cgpa: 4.20,
  role: 'student',
  feesDue: 25000,
};

export const MOCK_STAFF: User = {
  id: 'hod-1',
  name: 'Dr. Johnson',
  surname: 'Science',
  matricNumber: 'HOD/LASU/001',
  department: 'Computer Science',
  level: 'Staff',
  cgpa: 5.0,
  role: 'hod',
  feesDue: 0,
};

export const MOCK_HOC: User = {
  id: 'hoc-1',
  name: 'James',
  surname: 'Rep',
  matricNumber: 'HOC/LASU/001',
  department: 'Computer Science',
  level: '400L',
  cgpa: 3.85,
  role: 'hoc',
  feesDue: 0,
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Rain Semester Resumption Announced',
    content: 'The university senate has approved the resumption date for the 2nd semester. All students are expected to complete their registration within the first two weeks.',
    date: '2 hrs ago',
    category: 'Academic',
    authorId: 'hod-1'
  },
  {
    id: '2',
    title: 'LASU Games 2024 Registration',
    content: 'Inter-faculty sports competition registration begins this week at the sports center. Join your faculty team today!',
    date: '1 day ago',
    category: 'Sports',
    authorId: 'hod-1'
  },
  {
    id: '3',
    title: 'Important: Convocation List Update',
    content: 'Final year students should check their names on the cleared list at the Senate building.',
    date: '3 days ago',
    category: 'Important',
    authorId: 'hod-1'
  },
];

export const MOCK_COURSES: Course[] = [
  { id: '1', code: 'CSC 401', title: 'Software Engineering II', units: 3, type: 'Core' },
  { id: '2', code: 'CSC 405', title: 'Artificial Intelligence', units: 3, type: 'Core' },
  { id: '3', code: 'CSC 411', title: 'Human Computer Interaction', units: 2, type: 'Elective' },
];

export const MOCK_TIMETABLE: TimetableEntry[] = [
  { id: '1', courseCode: 'CSC 401', time: '08:00 AM - 10:00 AM', venue: '3-in-1 Hall A', day: 'Monday', color: 'bg-blue-100', isCancelled: false },
  { id: '2', courseCode: 'CSC 405', time: '11:00 AM - 01:00 PM', venue: 'Science Lab 2', day: 'Monday', color: 'bg-green-100', isCancelled: false },
  { id: '3', courseCode: 'ENT 402', time: '02:00 PM - 04:00 PM', venue: 'MBA Hall', day: 'Monday', color: 'bg-orange-100', isCancelled: false },
  { id: '4', courseCode: 'GNS 401', time: '09:00 AM - 11:00 AM', venue: 'Maka Hall', day: 'Tuesday', color: 'bg-purple-100', isCancelled: false },
  { id: '5', courseCode: 'CSC 499', time: '12:00 PM - 02:00 PM', venue: 'Library Annex', day: 'Wednesday', color: 'bg-red-100', isCancelled: false },
];

export const MOCK_RESULTS: Result[] = [
  { id: '1', courseCode: 'CSC 301', score: 72, grade: 'A', units: 3, semester: 'Harmattan', year: '2023' },
  { id: '2', courseCode: 'CSC 302', score: 65, grade: 'B', units: 3, semester: 'Harmattan', year: '2023' },
  { id: '3', courseCode: 'GNS 301', score: 85, grade: 'A', units: 2, semester: 'Rain', year: '2023' },
  { id: '4', courseCode: 'MTH 301', score: 55, grade: 'C', units: 3, semester: 'Rain', year: '2023' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay-1', userId: 'student-1', amount: 45000, description: 'Medical Fees', status: 'completed', date: 'Oct 12, 2023', reference: 'REF-82192' },
  { id: 'pay-2', userId: 'student-1', amount: 15000, description: 'Faculty Dues', status: 'pending', date: 'Jan 05, 2024', reference: 'REF-99210' },
  { id: 'pay-3', userId: 'student-1', amount: 10000, description: 'Library Maintenance', status: 'completed', date: 'Mar 15, 2024', reference: 'REF-33102' },
];

export const MOCK_LOCATIONS: CampusLocation[] = [
  { id: 'loc-1', name: 'Senate Building', category: 'Admin', description: 'Administrative Hub and VC Office', lat: 6.460, lng: 3.200 },
  { id: 'loc-2', name: '3-in-1 Hall', category: 'Academic', description: 'Lecture Hall Complex', lat: 6.462, lng: 3.205 },
  { id: 'loc-3', name: 'Science Lab 2', category: 'Academic', description: 'Computer Science & ICT Lab', lat: 6.461, lng: 3.202 },
  { id: 'loc-4', name: 'Sports Complex', category: 'Recreation', description: 'Main stadium and gymnasium', lat: 6.458, lng: 3.198 },
  { id: 'loc-5', name: 'Fetus Hostel', category: 'Hostel', description: 'Male Student Accommodation', lat: 6.465, lng: 3.210 },
];
