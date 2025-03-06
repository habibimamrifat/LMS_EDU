import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt"
import { TProgress, TStudent } from "./user.interface";

const ProgressSchema = new Schema<TProgress>({
    courseId: { type: Schema.Types.ObjectId, required: true, ref: "Course" },
    milestoneNo: { type: Schema.Types.Mixed, required: true },
    moduleNo: { type: Schema.Types.Mixed, required: true },
    vedioNo: { type: Schema.Types.Mixed, required: true },
    lastQuizNo: { type: Schema.Types.Mixed, required: true },
    lastAssignmentNo: { type: Schema.Types.Mixed, required: true },
});

const UserSchema = new Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "instructer", "student", "user"], required: true, default: "user" },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    loggedOutTime: { type: Date, default: null },
});

const StudentSchema = new Schema<TStudent>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "UserCollection" },
    paymentStatus: { type: Boolean, required: true },
    progress: { type: [ProgressSchema], default: [] },
    courseAccess: { type: [Schema.Types.ObjectId], ref: "Course", default: [] },

    attentedQuiz: { type: [Schema.Types.ObjectId], default: [] },
    attentedAssignment: { type: [Schema.Types.ObjectId], default: [] },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
});

const InstructorSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "UserCollection" },
    courseAccess: { type: [Schema.Types.ObjectId], ref: "Course", default: [] },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Hash only if password is modified

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        return next(error);
    }
});


export const UserModel = mongoose.model("UserCollection", UserSchema);
export const StudentModel = mongoose.model("StudentCollection", StudentSchema);
export const InstructorModel = mongoose.model("InstructorCollection", InstructorSchema);



