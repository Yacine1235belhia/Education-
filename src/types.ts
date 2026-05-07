export interface Student {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  className?: string;
  studentNumber?: string;
  grades: {
    [subject: string]: {
      evaluation?: number;
      practical?: number;
      quiz?: number;
      exam?: number;
      average?: number;
    };
  };
  overallAverage?: number;
  rank?: number;
  observations?: string;
  deficiencies?: string[];
  recommendations?: string;
}

export interface TeacherConfig {
  name: string;
  institution: string;
  subject: string;
  level: string;
  province: string;
  hasPractical: boolean;
  academicYear: string;
}
