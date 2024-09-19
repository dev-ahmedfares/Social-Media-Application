import { useAuthContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuthContext();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="user image"
              className="h-12 w-12 rounded-full object-cover object-top"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <p className="base-medium lg:body-bold test-light-1">
              {post.creator.name}
            </p>
            <p className="subtle-semibold lg:small-regular text-light-3">
              {multiFormatDateString(post.$createdAt)} &#x2022; {post.location}
            </p>
          </div>
        </div>
        {user.id === post.creator.$id && (
          <Link to={`/update-post/${post.$id}`}>
            <img
              src="/assets/icons/edit.svg"
              alt="Edit post"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="mt-2 flex gap-1">
            {post.tags.map((tag: string, index: string) => (
              <li className="small-regular text-light-3" key={`${tag}${index}`}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img object-cover "
      
        />
      </Link>

      <PostStats post={post} userId={user.id}/>
    </div>
  );
}
