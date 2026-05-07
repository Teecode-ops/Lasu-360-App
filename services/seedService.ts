import { collection, doc, setDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebaseService';

export async function seedDatabase() {
  const usersRef = collection(db, 'users');
  const userCheck = await getDocs(query(usersRef, limit(1)));
  
  if (!userCheck.empty) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  // 1. Students
  const students = [
    {
      id: 'student-1',
      name: 'Mof\'olunwaso',
      surname: 'Adekoya',
      matricNumber: 'LASU/2020/001',
      department: 'Computer Science',
      level: '400L',
      cgpa: 4.20,
      role: 'student',
      feesDue: 25000,
    },
    {
      id: 'hoc-1',
      name: 'James',
      surname: 'Rep',
      matricNumber: 'HOC/LASU/001',
      department: 'Computer Science',
      level: '400L',
      cgpa: 3.85,
      role: 'hoc',
      feesDue: 0,
    },
    {
      id: 'hod-1',
      name: 'Dr. Johnson',
      surname: 'Science',
      matricNumber: 'HOD/LASU/001',
      department: 'Computer Science',
      level: 'Staff',
      cgpa: 5.0,
      role: 'hod',
      feesDue: 0,
    }
  ];

  for (const s of students) {
    await setDoc(doc(db, 'users', s.id), s);
  }

  // 2. News
  const news = [
    {
      id: 'news-1',
      title: 'Rain Semester Resumption',
      content: 'All students are expected back on campus by Monday for the new semester registration.',
      date: '2 hrs ago',
      category: 'Important',
      authorId: 'hod-1'
    },
    {
      id: 'news-2',
      title: 'LASU Games 2024',
      content: 'Registration for Inter-faculty sports is now open at the sports complex.',
      date: 'Yesterday',
      category: 'Sports',
      authorId: 'hod-1'
    }
  ];

  for (const n of news) {
    await setDoc(doc(db, 'news', n.id), n);
  }

  // 3. Timetable
  const timetable = [
    {
      id: 'time-1',
      courseCode: 'CSC 401',
      time: '08:00 AM - 10:00 AM',
      venue: '3-in-1 Hall A',
      day: 'Monday',
      color: 'bg-blue-100'
    },
    {
      id: 'time-2',
      courseCode: 'CSC 405',
      time: '11:00 AM - 01:00 PM',
      venue: 'Science Lab 2',
      day: 'Monday',
      color: 'bg-green-100'
    },
    {
      id: 'time-3',
      courseCode: 'ENT 402',
      time: '02:00 PM - 04:00 PM',
      venue: 'MBA Hall',
      day: 'Monday',
      color: 'bg-orange-100'
    }
  ];

  for (const t of timetable) {
    await setDoc(doc(db, 'timetable', t.id), t);
  }

  // 4. Results
  const results = [
    { id: 'res-1', userId: 'student-1', courseCode: 'CSC 301', score: 72, grade: 'A', units: 3, semester: 'Harmattan', year: '2023' },
    { id: 'res-2', userId: 'student-1', courseCode: 'CSC 302', score: 65, grade: 'B', units: 3, semester: 'Harmattan', year: '2023' },
    { id: 'res-3', userId: 'student-1', courseCode: 'GNS 301', score: 85, grade: 'A', units: 2, semester: 'Rain', year: '2024' }
  ];

  for (const r of results) {
    await setDoc(doc(db, 'results', r.id), r);
  }

  // 5. Payments
  const payments = [
    { id: 'pay-1', userId: 'student-1', amount: 45000, description: 'Medical Fees', status: 'completed', date: 'Oct 12, 2023', reference: 'REF-001' },
    { id: 'pay-2', userId: 'student-1', amount: 15000, description: 'Faculty Dues', status: 'pending', date: 'Jan 05, 2024', reference: 'REF-002' }
  ];

  for (const p of payments) {
    await setDoc(doc(db, 'payments', p.id), p);
  }

  // 6. Locations
  const locations = [
    { id: 'loc-1', name: 'Senate Building', category: 'Admin', description: 'Administrative Hub', lat: 6.46, lng: 3.20 },
    { id: 'loc-2', name: '3-in-1 Hall', category: 'Academic', description: 'Lecture Hall Complex', lat: 6.47, lng: 3.21 },
    { id: 'loc-3', name: 'Science Lab 2', category: 'Academic', description: 'Computer Science Lab', lat: 6.465, lng: 3.205 }
  ];

  for (const l of locations) {
    await setDoc(doc(db, 'locations', l.id), l);
  }

  console.log('Seeding complete!');
}
