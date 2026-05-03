import { Student } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'edugrade_students',
};

export const storageService = {
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },
  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }
};
