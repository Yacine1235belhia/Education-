import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  getDoc,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Student } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// For now, we use a single global institution ID for simplicity in this turn, 
// or derive it from the user.
const getInstitutionPath = () => {
  if (!auth.currentUser) return null;
  // Use a predictable ID for the default institution for the user
  return `institutions/${auth.currentUser.uid}`;
};

export const storageService = {
  // Test connection on boot
  testConnection: async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
       // Silent fail or log
    }
  },

  getStudents: async (institutionId: string): Promise<Student[]> => {
    try {
      const q = collection(db, `institutions/${institutionId}/students`);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'students');
      return [];
    }
  },

  saveStudent: async (institutionId: string, student: Student) => {
    try {
      await setDoc(doc(db, `institutions/${institutionId}/students`, student.id), student);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${student.id}`);
    }
  },

  saveStudentsBatch: async (institutionId: string, students: Student[]) => {
    try {
      const { writeBatch } = await import('firebase/firestore');
      
      const CHUNK_SIZE = 400; // Reduced slightly to be safer
      for (let i = 0; i < students.length; i += CHUNK_SIZE) {
        const batch = writeBatch(db);
        const chunk = students.slice(i, i + CHUNK_SIZE);
        
        chunk.forEach(student => {
          if (!student.id) {
            student.id = Math.random().toString(36).substr(2, 9);
          }
          const studentRef = doc(db, `institutions/${institutionId}/students`, student.id);
          batch.set(studentRef, student);
        });
        
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `institutions/${institutionId}/students/batch`);
    }
  },

  ensureInstitution: async (uid: string, name: string) => {
    try {
      const instRef = doc(db, 'institutions', uid);
      const snap = await getDoc(instRef);
      if (!snap.exists()) {
        await setDoc(instRef, {
          name: name,
          adminId: uid,
          collaborators: []
        });
      }
    } catch (error: any) {
      if (error?.message?.includes('client is offline')) {
        console.warn("Client is offline, skipping ensureInstitution.");
        return;
      }
      // If we can't create/get institution, we might have permission issues
      console.error("Error ensuring institution:", error);
    }
  },

  saveTeacherConfig: async (institutionId: string, config: any) => {
    try {
      await setDoc(doc(db, `institutions/${institutionId}/config`, 'teacher'), config);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `config/teacher`);
    }
  },

  getTeacherConfig: async (institutionId: string): Promise<any | null> => {
    try {
      const snap = await getDoc(doc(db, `institutions/${institutionId}/config`, 'teacher'));
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      return null;
    }
  }
};
