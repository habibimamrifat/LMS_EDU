import { Types } from "mongoose"

export type TUserRole = "admin" | "instructer" | "student" | "user" 

export type TProgress={
    courseId:Types.ObjectId,
    milestoneNo:string | number |null,
    moduleNo:string | number |null,
    vedioNo:string | number |null,
    lastQuizNo:string | number |null,
    lastAssignmentNo:string | number |null,
}

export type TUser={
    name:string,
    img:string,
    mobileNo:string,
    email:string,
    role?:TUserRole,
    password:string,
    isDeleted?:string,
    isBlocked?:boolean,
    isLoggedIn?:boolean,
    loggedOutTime?:Date
}


export type TStudent ={
    user:Types.ObjectId | TUser,
    paymentStatus:boolean,
    progress:[TProgress],
    courseAccess:[Types.ObjectId],
    attentedQuiz:[Types.ObjectId],
    attentedAssignment:[Types.ObjectId],
    isDeleted:boolean,
    isBlocked:boolean
}


export type TInstructer ={
    user:Types.ObjectId | TUser,
    courseAccess:[Types.ObjectId],
    isDeleted:string,
    isBlocked:boolean

}