export type TUserRole = "admin" | "instructer" | "student" | "user"
export type TIdFor= "course"| "milestone"| "module"|"video"|"quiz"|"assignment";
export type PostTypeEnum = "Course Topics" | "Bugs" | "Guideline" | "Feature Request" | "Others";
export type PostPlatformEnum = "Website" | "Android APP" | "IOS APP" | "Desktop APP" | "IOS (Browser)";
export type accessCollection= "video" | "quiz" | "assignment"


export const userRole = {
    "user":"user",
    "student": "student",
    "instructer": "instructer",
    "admin": "admin"
} as const

export type TErrorSource = {
    path: string | number;
    message: string;
}[];


// work on it while 
export const idFor = {
    "course": "course",
    "milestone": "milestone",
    "module": "module",
    "video":"video",
    "quiz":"quiz",
    "assignment":"assignment",
    "Exam":"Exam"
} as const

export const accessRequest = {
    video: "video",
    quiz: "quiz",
    assignment: "assignment"
} as const;