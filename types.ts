
export type Theme = 'day' | 'night';

export enum TeachingMethod {
  STEAM = 'STEAM (العلوم، التكنولوجيا، الهندسة، الفن، الرياضيات)',
  MONTESSORI = 'Montessori (مونتيسوري)',
  PBL = 'PBL (التعلم القائم على المشاريع)',
  INCLUSIVE = 'Inclusive Education (التعليم الجامع)'
}

export enum StudentGroup {
  GENERAL = 'طلاب بتركيز عام',
  LEARNING_DIFFICULTIES = 'صعوبات تعلم (نطق، فهم، تركيز)',
  SPECIAL_NEEDS = 'ذوي احتياجات خاصة (حركي، سمعي)',
  GIFTED = 'طلاب موهوبين (إثراء معرفي)'
}

export enum LearningStyle {
  VISUAL = 'بصري (صور، خرائط ذهنية)',
  AUDITORY = 'سمعي (نقاش، قصص)',
  KINESTHETIC = 'حركي (تجارب، حركة)',
  VERBAL = 'كلامي (قراءة، كتابة)'
}

export interface LessonPlan {
  id: string;
  title: string;
  grade: string;
  subject: string;
  objectives: string[];
  activities: string[];
  funActivities: string[];
  materials: string[];
  assessment: string;
  teacherInsight: string;
  method: TeachingMethod;
  style: LearningStyle;
}
