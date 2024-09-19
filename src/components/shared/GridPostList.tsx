
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
  fullWidth?:boolean
};

export default function GridPostList({
  posts,
  showUser = false,
  showStats = false,
  fullWidth = false,
}: GridPostListProps) {
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li
          key={post.$id}
          className="relative  h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="image"
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center gap-3">
                <img
                  src={
                    post.creator.imageUrl ||
                    "/public/assets/icons/profile-placeholder.svg"
                  }
                  alt="image Profile"
                  className="h-8 w-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats fullWidth={fullWidth} post={post} userId={post.creator.$id}/>}
          </div>
        </li>
      ))}
    </ul>
  );
}
