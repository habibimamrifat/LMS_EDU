import { PostPlatformEnum, PostTypeEnum } from "../../constents";

export type TPost = {
    title: string;
    type: PostTypeEnum;
    platform: PostPlatformEnum;
    content: string;
    media: {
        photoUrl: string[],
        videoUrl: string[],
    },
    commentList: string[],
    isDeleted?: boolean
};
  