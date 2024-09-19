import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetInfinitePosts, useSearchPosts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Explore() {
  const { ref, inView } = useInView();
  const [searchValue, setSearch] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const { searchedPosts, isGettingSearchedPosts } =
    useSearchPosts(debouncedValue);

  const {
    infinitePosts,
    fetchNextPage,
    hasNextPage,
  } = useGetInfinitePosts();

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  const shouldShowSearchResults = searchValue !== "";

  if (!infinitePosts)
    return (
      <div className="flex-center h-full w-full">
        <Loader without={true}/>
      </div>
    );



  return (
    <div className="explore-container max-md:my-16">
      <div className="explore-inner_container">
        <h2 className="h3-bold lg:h2-bold w-full max-w-5xl gap-3">
          Search Posts
        </h2>
        <div className="flex w-full max-w-5xl items-center rounded-md bg-dark-4 px-5 focus-within:ring-1 focus-within:ring-primary-600/70">
          <img
            src="/public/assets/icons/search.svg"
            alt="search"
            className="h-6 w-6"
          />
          <Input
            placeholder="Search By Caption..."
            type="text"
            className="explore-search px-5"
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-between w-full">
          <h3 className="body-bold lg:h3-bold">Popular Today</h3>
          <div className="flex cursor-pointer items-center gap-3 rounded-md bg-dark-3 px-3 py-2">
            <p>All</p>
            <img
              src="/public/assets/icons/filter.svg"
              alt="filter icon"
              width={20}
              height={20}
            />
          </div>
        </div>
        {!infinitePosts ? (
          <div className="flex-center mt-20">
            <Loader without={true} />
          </div>
        ) : (
          <>
            {shouldShowSearchResults
              ? <SearchResults searchedPosts={searchedPosts} isGettingSearchedPosts={isGettingSearchedPosts}  />
              : infinitePosts.pages.map((item, index) => (item &&
                  <GridPostList
                    key={`page-${index}`}
                    posts={item.documents}
                    showUser={true}
                    showStats={true}
                  />
                ))}

            {hasNextPage && !searchValue && (
              <div ref={ref} className="flex-center">
                <Loader without={true} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
