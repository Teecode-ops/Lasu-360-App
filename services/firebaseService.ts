import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  getDocFromServer
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { User, NewsItem, TimetableEntry, Result, Payment, CampusLocation, RegistrationRequest } from '../types';
import { MOCK_USER, MOCK_STAFF, MOCK_HOC, MOCK_NEWS, MOCK_TIMETABLE, MOCK_RESULTS, MOCK_PAYMENTS, MOCK_LOCATIONS } from '../constants';

// Error handling helper as per instructions
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL CONSTRAINT: Establish session and test connection
async function initializeFirebase() {
  try {
    // Ensure we have a valid anonymous session so rules are satisfied
    await signInAnonymously(auth);
    console.log("Firebase anonymous session established");
    
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection verified");
  } catch (error) {
    console.warn("Initial Firebase connection check failed (expected if rules are strict)", error);
  }
}
initializeFirebase();

// Custom Auth: In this app, we are using Matric Number as a unique identifier.
export async function loginWithMatric(matricNumber: string, surname: string): Promise<User | null> {
  const path = 'users';
  try {
    const q = query(
      collection(db, path), 
      where('matricNumber', '==', matricNumber)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // If empty first time, let's try to self-seed from mocks for demo purposes
      const allMocks = [MOCK_USER, MOCK_STAFF, MOCK_HOC];
      const foundMock = allMocks.find(u => u.matricNumber === matricNumber && u.surname.toLowerCase() === surname.toLowerCase());
      if (foundMock) {
        await setDoc(doc(db, 'users', foundMock.id), foundMock);
        return foundMock;
      }
      return null;
    }

    const userData = querySnapshot.docs[0].data() as User;
    if (userData.surname.toLowerCase() === surname.toLowerCase()) {
      return userData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export function subscribeToNews(callback: (news: NewsItem[]) => void) {
  const path = 'news';
  const q = collection(db, path);
  
  return onSnapshot(q, (snapshot) => {
    const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
    // If empty, seed from mocks
    if (news.length === 0) {
      MOCK_NEWS.forEach(item => setDoc(doc(db, 'news', item.id), item));
    }
    callback(news);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function subscribeToTimetable(callback: (timetable: TimetableEntry[]) => void) {
  const path = 'timetable';
  const q = collection(db, path);
  
  return onSnapshot(q, (snapshot) => {
    const timetable = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry));
    if (timetable.length === 0) {
      MOCK_TIMETABLE.forEach(item => setDoc(doc(db, 'timetable', item.id), item));
    }
    callback(timetable);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function subscribeToResults(userId: string, callback: (results: Result[]) => void) {
  const path = 'results';
  const q = query(collection(db, path), where('userId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result));
    if (results.length === 0 && userId === MOCK_USER.id) {
       MOCK_RESULTS.forEach(item => setDoc(doc(db, 'results', item.id), { ...item, userId }));
    }
    callback(results);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function subscribeToPayments(userId: string, callback: (payments: Payment[]) => void) {
  const path = 'payments';
  const q = query(collection(db, path), where('userId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
    if (payments.length === 0 && userId === MOCK_USER.id) {
      MOCK_PAYMENTS.forEach(item => setDoc(doc(db, 'payments', item.id), { ...item, userId }));
    }
    callback(payments);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function subscribeToRegistrationRequests(callback: (requests: RegistrationRequest[]) => void) {
  const path = 'registration_requests';
  const q = collection(db, path);
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegistrationRequest));
    callback(requests);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function submitRegistrationRequest(request: Omit<RegistrationRequest, 'id'>) {
  const path = 'registration_requests';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...request,
      submittedAt: Timestamp.now().toDate().toISOString()
    });
    return { id: docRef.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateRegistrationStatus(id: string, status: 'approved' | 'rejected') {
  const path = `registration_requests/${id}`;
  try {
    await updateDoc(doc(db, 'registration_requests', id), {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function getCampusLocations(): Promise<CampusLocation[]> {
  const path = 'locations';
  try {
    const snapshot = await getDocs(collection(db, path));
    const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CampusLocation));
    if (locations.length === 0) {
      for (const loc of MOCK_LOCATIONS) {
        await setDoc(doc(db, 'locations', loc.id), loc);
      }
      return MOCK_LOCATIONS;
    }
    return locations;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function postNews(news: Omit<NewsItem, 'id'>) {
  const path = 'news';
  try {
    const docRef = await addDoc(collection(db, path), news);
    return { id: docRef.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function addTimetableEntry(entry: Omit<TimetableEntry, 'id'>) {
  const path = 'timetable';
  try {
    const docRef = await addDoc(collection(db, path), entry);
    return { id: docRef.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteTimetableEntry(id: string) {
  const path = `timetable/${id}`;
  try {
    await deleteDoc(doc(db, 'timetable', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateTimetableEntry(id: string, updates: Partial<TimetableEntry>) {
  const path = `timetable/${id}`;
  try {
    await updateDoc(doc(db, 'timetable', id), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateTimetableStatus(id: string, isCancelled: boolean, userId: string) {
  const path = `timetable/${id}`;
  try {
    await updateDoc(doc(db, 'timetable', id), {
      isCancelled,
      updatedBy: userId,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
