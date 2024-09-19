import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queries";
import { useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const { currentPost, isGettingCurrentPost } = useGetPostById(id);
  
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex w-full max-w-5xl items-center justify-start gap-3">
          <img
            src="/public/assets/icons/add-post.svg"
            alt="add-post icon"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold">Edit Post</h2>
        </div>
        {isGettingCurrentPost ? (
          <div className="flex-center w-full h-full">
            <Loader without={true} />
          </div>
        ) : (
          <PostForm post={currentPost} action={"Update"}/>
        )}
      </div>
    </div>
  );
}
