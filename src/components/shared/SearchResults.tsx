import { Models } from "appwrite";
import GridPostList from "./GridPostList";
import Loader from "./Loader";

type searchedPostsProps = {
  searchedPosts: any;
  isGettingSearchedPosts: boolean;
};

export default function SearchResults({
  searchedPosts,
  isGettingSearchedPosts,
}: searchedPostsProps) {

    console.log(searchedPosts)
  return isGettingSearchedPosts ? (
    <div className="flex-center h-full w-full">
      <Loader without={true} />
    </div>
  ) : searchedPosts && searchedPosts.documents.length > 0 ? (
    <div className="w-full"><GridPostList posts={searchedPosts.documents} showStats={true} showUser={true}/></div>
  ) : (
    <p className="mt-10 w-full text-center text-light-4">No results found</p>
  );
}
