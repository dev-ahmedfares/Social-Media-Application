
import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queries";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
  fullWidth?: boolean
};

export default function PostStats({ post, userId,fullWidth = false }: PostStatsProps) {
  const likedList = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likedList);

  const { likePost } = useLikePost();

  const { currentUser, isGettingUser } = useGetCurrentUser();
  
  const savedPostRecord =  currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === post.$id
  );
 
  const [isSaved, setIsSaved] = useState(savedPostRecord);

  const { savePost, isSavingPost } = useSavePost();
  const { deleteSavedPost, isDeletingSavedPost } = useDeleteSavePost();
  
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  function handleLikePost(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((id) => id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  }

  function handleSavePost(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();

    if (savedPostRecord) {
      deleteSavedPost(savedPostRecord.$id);
      setIsSaved(false);
    } else {
      savePost({ userId, postId: post.$id });
      setIsSaved(true);
    }
  }

  return (
    <div className={`flex-between  gap-5 ${fullWidth && "w-full"}`}>
      <div className="flex items-center gap-2">
        <img
          src={
            checkIsLiked(likes, userId)
              ? `/public/assets/icons/liked.svg`
              : `/public/assets/icons/like.svg`
          }
          width={20}
          height={20}
          alt="like image"
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base:medium">{likes.length}</p>
      </div>
      {isGettingUser || isSavingPost || isDeletingSavedPost ? (
        <div className="w-[20px] h-[20px]">
          <Loader without={true} />
        </div>
      ) : (
        <div className="flex gap-2">
          <img
            src={
              isSaved
                ? `/public/assets/icons/saved.svg`
                : `/public/assets/icons/save.svg`
            }
            width={20}
            height={20}
            alt="save"
            onClick={handleSavePost}
            className={`cursor-pointer`}
          />
        </div>
      )}
    </div>
  );
}
