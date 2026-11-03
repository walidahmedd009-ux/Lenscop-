import { Course } from '../types/course';
import { buildAuthenticCourse } from './courseCurriculumBuilder';

export function createClientCourse(topic: string, level: string = 'Beginner'): Course {
  return buildAuthenticCourse(topic, level);
}
