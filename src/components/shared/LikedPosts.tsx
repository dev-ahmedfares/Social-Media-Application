
import { useGetCurrentUser } from "@/lib/react-query/queries";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

const LikedPosts = () => {
  const {  currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader without={true}/>
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} />
    </>
  );
};

export default LikedPosts;
