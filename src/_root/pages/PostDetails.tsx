import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetCurrentUser,
  useGetPostById,
  useGetUserPosts,
} from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { Models } from "appwrite";
import { deleteSavedPost } from "@/lib/appwrite/api";

export default function PostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { deletePost, isDeletingPost } = useDeletePost();
  const { user } = useAuthContext();
  const { currentPost: post, isGettingCurrentPost, error } = useGetPostById(id);
  const { userPosts, isGettingUserPosts } = useGetUserPosts(post?.creator.$id);

  const relatedPosts = userPosts?.documents.filter(
    (post: Models.Document) => post.$id !== id
  );

  const { currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === id
  );

  if (isGettingCurrentPost) {
    return (
      <div className="flex-center flex-1">
        <Loader without={true} />
      </div>
    );
  }

  if (error || !post) {
    return <PageNotFound />;
  }

  function handleDeletePost() {
    if (savedPostRecord) {
      deleteSavedPost(savedPostRecord.$id);
    }
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  }

  return (
    <div className="post_details-container max-md:mt-20 max-sm:my-16">
      <div className="hidden w-full max-w-5xl md:flex">
        <Button
          onClick={() => navigate(-1)}
          variant={"ghost"}
          className="flex items-center gap-2 hover:bg-transparent hover:text-light-1">
          <img
            src="/public/assets/icons/back.svg"
            alt="back"
            className="h-6 w-6"
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      <div className="post_details-card">
        <img
          src={post.imageUrl}
          alt="current image"
          className="post_details-img"
        />

        <div className="flex flex-1 flex-col px-7 py-8">
          <div className="flex-between mb-5">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post.creator.$id}`}>
                <img
                  src={
                    post.creator?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="user image"
                  className="h-8 w-8 rounded-full object-top md:h-12 md:w-12"
                />
              </Link>
              <div className="flex flex-col gap-1">
                <p className="base-medium lg:body-bold test-light-1">
                  {post.creator.name}
                </p>
                <p className="subtle-semibold lg:small-regular text-light-3">
                  {multiFormatDateString(post.$createdAt)} &#x2022;{" "}
                  {post.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              {user.id === post.creator.$id && (
                <Link to={`/update-post/${post.$id}`}>
                  <img
                    src="/public/assets/icons/edit.svg"
                    alt="Edit post"
                    className="h-6 w-6 md:h-7 md:w-7"
                  />
                </Link>
              )}
              <Button
                disabled={isDeletingPost}
                onClick={handleDeletePost}
                type="button"
                variant={"ghost"}
                className="p-0 hover:bg-transparent">
                <img
                  src="/public/assets/icons/delete.svg"
                  alt="delete"
                  className="h-6 w-6 md:h-7 md:w-7"
                />
              </Button>
            </div>
          </div>

          <hr className="my-2 border border-dark-4/80" />

          <div className="small-medium lg:base-medium pt-5">
            <p>{post.caption}</p>
            <ul className="mt-2 flex gap-1">
              {post.tags.map((tag: string, index: string) => (
                <li
                  className="small-regular text-light-3"
                  key={`${tag}${index}`}>
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 xl:mt-auto">
            <PostStats post={post} userId={user.id} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <hr className="w-full border border-dark-4/80" />
        <h3 className="body-bold lg:h3-bold my-6 w-full text-start text-light-1">
          More Related Posts
        </h3>
        {isGettingUserPosts || !relatedPosts ? (
          <div className="flex-center">
            <Loader without={true} />
          </div>
        ) : (
          <GridPostList showUser={true} showStats={true} posts={relatedPosts} />
        )}
      </div>
    </div>
  );
}
