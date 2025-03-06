import { TVideo } from "./video.interface";
import { VideoModel } from "./video.model";


// Service for creating a video
const createVideoIntoDB = async (video: TVideo) => {
  const result = await VideoModel.create(video);
  return result;
};

// Service for getting all video or searching by a value
const getAllVideosFromDB = async (searchTerm: object): Promise<TVideo[] | null> => {
  const result = await VideoModel.find(searchTerm);
  return result;
};

// Service for retrieving a single video
const getSingleVideoFromDB = async (_id: string) => {
  const result = await VideoModel.findOne({ _id });
  return result;
};

// Service for deleting a video
const deleteVideoFromDB = async (_id: string) => {
  const result = await VideoModel.findByIdAndUpdate(
    { _id },
    { isDeleted: true },
    { new: true, runValidators: true }
);
  return result;
};

// Service for updating a video
const updateVideoFromDB = async (
  _id: string,
  updateData: Partial<TVideo>
) => {
  try {
    const result = await VideoModel.findOneAndUpdate(
      { _id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).exec();
    return result;
  } catch (error) {
    console.error(`Failed to update video with id ${_id}:`, error);
    throw error;
  }
};

// Exporting the main service for use in controllers
export const VideoServices = {
    createVideoIntoDB,
    getAllVideosFromDB,
    getSingleVideoFromDB,
    deleteVideoFromDB,
    updateVideoFromDB,
};
