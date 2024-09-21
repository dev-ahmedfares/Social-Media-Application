import GridUserList from "@/components/shared/GridUserList";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";

import { useGetInfinitePosts, useGetUsers } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";


export default function Home() {
  // const { posts, isPostsLoading } = useGetRecentPosts();
  const { ref, inView } = useInView();
  const {
    infinitePosts: posts,
    isGettingIPosts,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useGetInfinitePosts();

  useEffect(() => {
    if (inView && !isFetching) {
      fetchNextPage();
    }
  }, [inView, isFetching]);


  const { allUsers, isLoading, isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast( "Something went wrong.");

    return;
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts relative">
          <h2 className="h3-bold md:h2-bold w-full text-start text-light-1">
            Home Feed
          </h2>
          {isGettingIPosts ? (
            <div className="flex-center absolute inset-0 h-screen">
              <Loader without={true} />
            </div>
          ) : (
            <>
              <ul className="flex w-full flex-col gap-9">
                {posts?.pages.map((item) =>
                  item?.documents.map((post: Models.Document) => (
                    <li key={post.$id}>
                      <PostCard post={post} />
                    </li>
                  ))
                )}
              </ul>
              {hasNextPage && (
                <div ref={ref} className="flex-center">
                  <Loader without={true} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="custom-scrollbar flex flex-col gap-5 overflow-auto px-6 py-10 max-xl:hidden max-lg:px-10 lg:gap-7 lg:max-md:my-16 2xl:w-[512px]">
        <h2 className="h3-bold flex w-full items-center gap-3">Top Creators</h2>
        {isLoading || !allUsers ? (
          <div className="flex-center h-full">
            <Loader without={true} />
          </div>
        ) : (
          <GridUserList inHome={true} users={allUsers.documents} />
        )}
      </div>
    </div>
  );
}
