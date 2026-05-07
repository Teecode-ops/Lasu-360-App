import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  orderBy,
  Timestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  NewsItem, 
  TimetableEntry, 
  Result, 
  Payment, 
  CampusLocation, 
  RegistrationRequest,
  User
} from '../types';

// Subscriptions
export const subscribeToNews = (callback: (news: NewsItem[]) => void) => {
  const q = query(collection(db, 'news'), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
    callback(news);
  });
};

export const subscribeToTimetable = (callback: (entries: TimetableEntry[]) => void) => {
  const q = collection(db, 'timetable');
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry));
    callback(entries);
  });
};

export const subscribeToResults = (userId: string, callback: (results: Result[]) => void) => {
  const q = query(collection(db, 'results'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result));
    callback(results);
  });
};

export const subscribeToPayments = (userId: string, callback: (payments: Payment[]) => void) => {
  const q = query(collection(db, 'payments'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
    callback(payments);
  });
};

export const getCampusLocations = async (): Promise<CampusLocation[]> => {
  const snapshot = await getDocs(collection(db, 'locations'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CampusLocation));
};

export const subscribeToRegistrationRequests = (callback: (requests: RegistrationRequest[]) => void) => {
  const q = query(collection(db, 'registration_requests'), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegistrationRequest));
    callback(requests);
  });
};

// Actions
export const updateRegistrationStatus = async (id: string, status: 'approved' | 'rejected') => {
  const ref = doc(db, 'registration_requests', id);
  await updateDoc(ref, { status });
};

export const submitRegistrationRequest = async (request: Omit<RegistrationRequest, 'id'>) => {
  await addDoc(collection(db, 'registration_requests'), request);
};

export const updateTimetableEntry = async (id: string, updates: Partial<TimetableEntry>) => {
  const ref = doc(db, 'timetable', id);
  await updateDoc(ref, updates);
};

export const addTimetableEntry = async (entry: Omit<TimetableEntry, 'id'>) => {
  await addDoc(collection(db, 'timetable'), entry);
};

export const deleteTimetableEntry = async (id: string) => {
  await setDoc(doc(db, 'timetable', id), { isCancelled: true }, { merge: true });
};
