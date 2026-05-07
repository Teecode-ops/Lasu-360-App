import { doc, setDoc, getDocs, collection, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  MOCK_USER, 
  MOCK_NEWS, 
  MOCK_TIMETABLE, 
  MOCK_RESULTS, 
  MOCK_PAYMENTS, 
  MOCK_COURSES, 
  MOCK_LOCATIONS 
} from '../constants';

export const seedDatabase = async () => {
  try {
    const newsSnap = await getDocs(collection(db, 'news'));
    if (!newsSnap.empty) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database with mock data...');
    const batch = writeBatch(db);

    // Seed News
    MOCK_NEWS.forEach(item => {
      const ref = doc(collection(db, 'news'), item.id);
      batch.set(ref, item);
    });

    // Seed Timetable
    MOCK_TIMETABLE.forEach(item => {
      const ref = doc(collection(db, 'timetable'), item.id);
      batch.set(ref, item);
    });

    // Seed Results
    MOCK_RESULTS.forEach(item => {
      // For demo, we assign mock results to the sample student
      const ref = doc(collection(db, 'results'), item.id);
      batch.set(ref, { ...item, userId: MOCK_USER.id });
    });

    // Seed Payments
    MOCK_PAYMENTS.forEach(item => {
      const ref = doc(collection(db, 'payments'), item.id);
      batch.set(ref, item);
    });

    // Seed Locations
    MOCK_LOCATIONS.forEach(item => {
      const ref = doc(collection(db, 'locations'), item.id);
      batch.set(ref, item);
    });

    // Seed Courses
    MOCK_COURSES.forEach(item => {
      const ref = doc(collection(db, 'courses'), item.id);
      batch.set(ref, item);
    });

    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
