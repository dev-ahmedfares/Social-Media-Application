import GridPostList from "@/components/shared/GridPostList";
import LikedPosts from "@/components/shared/LikedPosts";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

interface StabBlockProps {
  value: string | number;
  label: string;
}

function StatBlock({ value, label }: StabBlockProps) {
  return (
    <div className="flex-center gap-2">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
  );
}

export default function Profile() {
  const { id } = useParams();
  const { user, isLoading: isLoadingUser } = useAuthContext();
  const { pathname } = useLocation();
  const { userData: currentUser, isLoading } = useGetUserById(id || "");

  if (!currentUser || isLoading || isLoadingUser) {
    return (
      <div className="flex-center w-full">
        <Loader without={true} />
      </div>
    );
  }

  const postsArr = currentUser.posts.map((post : Models.Document) => ({
    ...post,
    creator: {
      $id: currentUser.$id,
    },
  }));

  return (
    <div className="profile-container max-md:my-16">
      <div className="profile-inner_container">
        <div className="flex flex-1 flex-col gap-7 max-xl:items-center xl:flex-row">
          <div className="flex-center">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="h-28 w-28 rounded-full lg:h-36 lg:w-36  object-cover"
          />
          </div>
          <div className="flex flex-1 flex-col justify-between md:mt-2">
            <div className="flex w-full flex-col">
              <h1 className="h3-bold md:h1-semibold w-full text-center xl:text-left">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-center text-light-3 xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="z-20 mt-10 flex flex-wrap items-center justify-center gap-8 xl:justify-start">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>

            <p className="small-medium md:base-medium mt-7 max-w-screen-sm text-center xl:text-left">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`flex-center h-12 gap-2 rounded-lg bg-dark-4 px-5 text-light-1 ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="small-medium flex whitespace-nowrap">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex w-full max-w-5xl">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={postsArr} showStats={true} fullWidth={true}/>} />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
    </div>
  );
}
