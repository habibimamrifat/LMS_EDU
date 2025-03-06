import { TPost } from "./post.interface";
import Post from "./post.model";

const createPostIntoDb = async (postData: TPost) => {
  const result = await Post.create(postData);
  return result;
};


const getAllPostsFromDb = async (query: Record<string, unknown>) => {
  const postQuery = Post.find({...query, isDeleted: false});
  const result = await postQuery.exec();
  return result;
};

const getPostByIdFromDb = async (_id: string) => {
  const result = await Post.findById(_id).exec();
  return result;
};

const updatePostFromDb = async (
  _id: string,
  updateData: Partial<TPost>,
) => {
  const result = await Post.findByIdAndUpdate(_id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
  return result;
};

const deletePostFromDb = async (_id: string) => {
  const result = await Post.findByIdAndUpdate(
    { _id },
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return result;
};

export const postService = {
  createPostIntoDb,
  getAllPostsFromDb,
  getPostByIdFromDb,
  updatePostFromDb,
  deletePostFromDb,
};
