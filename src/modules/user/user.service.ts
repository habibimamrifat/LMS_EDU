import mongoose from "mongoose";
import { TInstructer, TStudent, TUser} from "./user.interface"
import { InstructorModel, StudentModel, UserModel } from "./user.model"
import { userRole } from "../../constents";
import idConverter from "../../util/idConvirter";
import setProgress from "../../util/setProgress";


const createUser = async (payload: TUser) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    let student = null; // Declare student here for later use
    let user = null;

    try {
        user = new UserModel({ ...payload });
        await user.save({ session });

        if (payload.role === userRole.student) {
            student = new StudentModel({
                user: user._id,
                paymentStatus: false,
                progress: [],
                courseAccess: [],
            });
            await student.save({ session });
        } else if (payload.role === userRole.instructer) {
            const instructor = new InstructorModel({
                user: user._id,
                courseAccess: [],
            });
            await instructor.save({ session });
        }

        // Commit the transaction only after all operations are successful
        await session.commitTransaction();
    } catch (error: any) {
        await session.abortTransaction(); // Abort if an error occurs
        throw new Error(`User creation failed: ${error.message}`);
    } finally {
        // Ensure the session is always ended properly
        session.endSession();
    }

    // Call setProgress outside the transaction, after commit
    // if (student) {
    //     try {
    //         // Ensure progress is set only after committing the transaction
            
    //         await setProgress("67c91bc30f69d66efb7ce5cb", user._id.toHexString());
    //     } catch (error) {
    //         console.error("Error setting progress:", error);
    //     }
    // }



};


const assignCourseForInstructor = async (instructorId: string, courseId: string) => {
    const convertedInstructorId = idConverter(instructorId);
    const convertedCourseId = idConverter(courseId);
  
    const result = await InstructorModel.findOneAndUpdate(
        { _id: convertedInstructorId },
        { $push: { courseAccess: convertedCourseId } },
        { new: true } 
    );
    // console.log("converted result",result)

    return result;
}


const getAllStudents = async () => {
    try {
        const students = await StudentModel.find({ isDeleted: false }).populate('user');
        return students;
    } catch (error : any) {
        throw new Error(`Failed to get students: ${error.message}`);
    }
};


const updateStudent = async (id: string, updateData: Partial<TStudent>) => {
    try {
        const updatedStudent = await StudentModel.findByIdAndUpdate(id, updateData, { new: true }).populate('user');
        if (!updatedStudent) {
            throw new Error("Student not found");
        }
        return updatedStudent;
    } catch (error : any) {
        throw new Error(`Failed to update student: ${error.message}`);
    }
};


const deleteStudent = async (studentId: string) => {
    try {
        const deletedStudent = await StudentModel.findByIdAndUpdate(studentId, { isDeleted: true }, { new: true });
        if (!deletedStudent) {
            throw new Error("Student not found");
        }
        return deletedStudent;
    } catch (error) {
        throw new Error(`Failed to delete student:`);
    }
};


const getAllInstructors = async () => {
    try {
        const instructors = await InstructorModel.find({ isDeleted: false }).populate('user');
        return instructors;
    } catch (error) {
        throw new Error(`Failed to get instructors:`);
    }
};


const updateInstructor = async (instructorId: string, updateData: Partial<TInstructer>) => {
    try {
        const updatedInstructor = await InstructorModel.findByIdAndUpdate(instructorId, updateData, { new: true }).populate('user');
        if (!updatedInstructor) {
            throw new Error("Instructor not found");
        }
        return updatedInstructor;
    } catch (error : any) {
        throw new Error(`Failed to update instructor: ${error.message}`);
    }
};


const deleteInstructor = async (instructorId: string) => {
    try {
        const deletedInstructor = await InstructorModel.findByIdAndUpdate(instructorId, { isDeleted: true }, { new: true });
        if (!deletedInstructor) {
            throw new Error("Instructor not found");
        }
        return deletedInstructor;
    } catch (error) {
        throw new Error(`Failed to delete instructor:`);
    }
};

const getCurrentProgress= async(userId:string, course_id:string)=>{
const convertedUserId = idConverter(userId)
const convertedCourseId= idConverter(course_id)

const student =  await StudentModel.findOne({user:convertedUserId})
const progress = student?.progress.map((el)=>el.courseId.toHexString() === course_id)

// const result = await VideoModel.findOne({
//     course_id:convertedCourseId,
//     milestoneId:progress
// })


}

const userServices = {
    createUser, 
    assignCourseForInstructor,
    getAllStudents, 
    updateStudent,
    deleteStudent,
    getAllInstructors,
    updateInstructor,
    deleteInstructor,
    getCurrentProgress
}

export default userServices