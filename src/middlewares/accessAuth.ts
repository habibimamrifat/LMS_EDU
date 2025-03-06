import { NextFunction, Request, Response } from 'express';
import { StudentModel } from '../modules/user/user.model';
import { VideoModel } from '../modules/video/video.model';
import idConverter from '../util/idConvirter';
import { accessRequest, userRole } from '../constents';
import { QuestionPaperModel } from '../modules/questionPaper/questionPaper.model';
import { MilestoneModel } from '../modules/milestone/milestone.model';
import { ModuleModel } from '../modules/module/module.model';
import { Types } from 'mongoose';
import { AssignmentModel } from '../modules/assignment/assignment.model';


//incrrement progress as sttring..........
const incrementProgress = (progressStr: string) => {
  if (!progressStr) {
    throw new Error("Progress string is empty or invalid.");
  }

  const match = progressStr.match(/(\D+)(\d{4})$/); // Match the last 4 digits
  if (!match) throw new Error("Invalid progress format.");

  const prefix = match[1]; // Extract the non-numeric prefix (e.g., "QUI")
  const number = parseInt(match[2], 10) + 1; // Increment the last 4-digit number

  // Ensure the number stays 4 digits by padding with leading zeros if necessary
  return `${prefix}${number.toString().padStart(4, "0")}`;
};


// calculateProgressDifference ...........
const calculateProgressDifference = (
  current: string,
  incomingGId: string
): number => {
  const extractedNumberIncomingGId = parseInt(
    incomingGId.match(/\d{4}$/)?.[0] || "",
    10
  );
  const extractedNumberCurrent = parseInt(
    current.match(/\d{4}$/)?.[0] || "",
    10
  );

  console.log("watch it", extractedNumberIncomingGId, extractedNumberCurrent, current)

  if (isNaN(extractedNumberIncomingGId) || isNaN(extractedNumberCurrent)) {
    throw new Error("Invalid GId format or incoming progress");
  }

  return extractedNumberIncomingGId - extractedNumberCurrent;
};


// modifyProgress....................
const modifyProgress = async (
  alreadyProgress: any,
  incomingProgressDetail: any,
  userId: Types.ObjectId,
  accessCollection: "video" | "quiz" | "assignment"
) => {
  const incomingMilestone = await MilestoneModel.findById(
    incomingProgressDetail.milestoneId
  ).select("GId");

  const incomingModule =
    accessCollection !== accessRequest.assignment
      ? await ModuleModel.findById(incomingProgressDetail.moduleId).select(
          "GId"
        )
      : null;

  const milestoneCheck = calculateProgressDifference(
    alreadyProgress.milestoneNo,
    incomingMilestone!.GId
  );
  const moduleCheck = incomingModule
    ? calculateProgressDifference(alreadyProgress.moduleNo, incomingModule.GId)
    : null;

  let updateFields: any = {};


  // vedio access check.................
  if (accessCollection === accessRequest.video) {

    const upcomingQuiz = await QuestionPaperModel.findOne({
      moduleId: incomingProgressDetail.moduleId,
    }).select("GId");

    if (!upcomingQuiz) {
      throw new Error(
        "Perhaps quiz is not added to this module or quiz not found"
      );
    }

    const difference = calculateProgressDifference(
      alreadyProgress.lastQuizNo,
      upcomingQuiz?.GId
    );

    console.log(alreadyProgress.lastQuizNo,upcomingQuiz.GId,  difference)


    if (difference > 0) {
      throw new Error("Finish the previous quiz");
    }

    const videoCheck = calculateProgressDifference(
      alreadyProgress.vedioNo,
      incomingProgressDetail.GId
    );

    console.log("Video Check:", videoCheck, moduleCheck, milestoneCheck);

    if (milestoneCheck <= 0 && moduleCheck! <= 0 && videoCheck <= 0) {
      if (videoCheck === 0) {
        updateFields = {
          "progress.$.vedioNo": incrementProgress(alreadyProgress.vedioNo),
        };
      }
      console.log("You can watch this video.");
    } else {
      throw new Error(
        "Complete the previous milestone, module, or video first."
      );
    }
  }



  // for quizz.................................... 
  else if (accessCollection === accessRequest.quiz) {
    console.log("Getting into quiz");

    const quizCheck = calculateProgressDifference(
      alreadyProgress.lastQuizNo,
      incomingProgressDetail.GId
    );

    if (milestoneCheck <= 0 && moduleCheck! <= 0 && quizCheck === 0) {
      const lastVideo = await VideoModel.findOne({
        moduleId: incomingProgressDetail.moduleId,
      })
        .sort({ createdAt: -1 })
        .limit(1)
        .select("GId");

      if (!lastVideo) {
        throw new Error("Last video of the module is not found");
      }

      const progressDifference = calculateProgressDifference(
        alreadyProgress.vedioNo,
        lastVideo?.GId
      );

      if ((progressDifference + 1) > 0) {
        throw new Error("Please complete videos of this module");
      }
    } 
    else {
      throw new Error(
        "Complete the previous milestone, module, or quiz first."
      );
    }
  } 



  // for assignment....................................
  else if (accessCollection === accessRequest.assignment) {
    const assignmentCheck = calculateProgressDifference(
      alreadyProgress.lastAssignmentNo,
      incomingProgressDetail.GId
    );

    if (milestoneCheck === 0 && assignmentCheck === 0) {
      const lastModule = await ModuleModel.findOne({
        milestoneId: incomingProgressDetail.milestoneId,
      })
        .sort({ createdAt: -1 })
        .limit(1)
        .select("GId");

      if (!lastModule) {
        throw new Error("Last module of the milestone is not found");
      }

      const progressDifference = calculateProgressDifference(
        alreadyProgress.moduleNo,
        lastModule?.GId
      );

      if (progressDifference > 0) {
        throw new Error("Please complete modules of this milestone");
      }
    } else {
      throw new Error(
        "Complete the previous milestone, module, or assignment first."
      );
    }
  }

  // Update the student's progress
  const updatedStudent = await StudentModel.findOneAndUpdate(
    { user: userId, "progress.courseId": alreadyProgress.courseId },
    { $set: updateFields },
    { new: true }
  );

  if (!updatedStudent) {
    throw new Error("Failed to update student progress.");
  }
};


// Middleware for checking access.................
const accessAuth = (accessCollection: "video" | "quiz" | "assignment") => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.user.role === userRole.instructer) {
      return next();
    }

    try {
      const userId = idConverter(req.user.id);
      if (!userId) throw Error("User ID is not found");

      let incomingProgressDetail;
      if (accessCollection === accessRequest.video) {
        incomingProgressDetail = await VideoModel.findById(
          idConverter(req.params.videoId)
        );
      } else if (accessCollection === accessRequest.quiz) {
        incomingProgressDetail = await QuestionPaperModel.findById(
          idConverter(req.body.questionPaperId)
        );
      } else if (accessCollection === accessRequest.assignment) {
        incomingProgressDetail = await AssignmentModel.findById(
          idConverter(req.query.assignment_id as string)
        );
      }

      if (!incomingProgressDetail) {
        throw new Error("Resource not found.");
      }

      const alreadyProgressed = await StudentModel.aggregate([
        { $match: { user: userId } },
        { $unwind: "$progress" },
        { $match: { "progress.courseId": incomingProgressDetail.course_id } },
        { $project: { _id: 0, progress: 1 } },
      ]);

      if (!alreadyProgressed.length) {
        throw new Error("Access denied: No progress found.");
      }

      await modifyProgress(
        alreadyProgressed[0].progress,
        incomingProgressDetail,
        userId,
        accessCollection
      );

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default accessAuth;
