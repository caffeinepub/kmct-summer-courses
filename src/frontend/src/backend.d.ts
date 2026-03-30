import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudentRegistration {
    studentId: string;
    name: string;
    email: string;
    courseSet1Id: bigint;
    courseSet2Id: bigint;
}
export interface Course {
    id: bigint;
    maxSeats: bigint;
    registeredCount: bigint;
    name: string;
    description: string;
    setId: bigint;
    faculty: string;
    dateRange: string;
}
export interface backendInterface {
    changeAdminPassword(oldPassword: string, newPassword: string): Promise<boolean>;
    clearAllRegistrations(password: string): Promise<boolean>;
    getAllCourses(): Promise<Array<Course>>;
    getAllRegistrations(password: string): Promise<Array<StudentRegistration>>;
    getCoursesBySet(setId: bigint): Promise<Array<Course>>;
    registerStudent(studentId: string, name: string, email: string, courseSet1Id: bigint, courseSet2Id: bigint): Promise<string>;
    updateCourse(password: string, courseId: bigint, name: string, faculty: string, description: string, dateRange: string): Promise<boolean>;
    verifyAdminPassword(password: string): Promise<boolean>;
}
