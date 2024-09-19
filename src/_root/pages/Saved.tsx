import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";

import { useGetCurrentUser } from "@/lib/react-query/queries";
import { Models } from "appwrite";

export default function Saved() {
  const { currentUser, isGettingUser } = useGetCurrentUser();

  const savedPosts = currentUser?.save.map((savePost: Models.Document) => ({
    ...savePost.post,
    creator: {
      imageUrl: currentUser.imageUrl,
    },
  })).reverse();

  return (
    <div className="saved-container max-md:my-16">
      <h2 className="h3-bold lg:h2-bold  flex w-full max-w-5xl items-center gap-3">
        <img
          src="/public/assets/icons/save.svg"
          alt="save icon"
          className="invert-white h-7 w-7 lg:h-8 lg:w-8"
        />
        <p>Saved Posts</p>
      </h2>
      {isGettingUser ? (
        <div className="flex-center h-full">
          <Loader without={true} />
        </div>
      ) : (
        <>
          {savedPosts.length === 0 ? (
            <div className="flex  flex-center h-full flex-col">
              <img src="/public/assets/icons/Empty-pana.svg" alt="no posts" className="lg:w-80 md:w-60" />
              <p className="h3-bold lg:h2-bold">No available posts</p>
            </div>
          ) : (
            <GridPostList posts={savedPosts} showUser={true} />
          )}
        </>
      )}
    </div>
  );
}
