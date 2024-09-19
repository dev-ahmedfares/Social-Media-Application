import { INewPost, INewUser, IUpdatedPost, IUpdateProfile } from "./../../types/index";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount as createUserAccountApi,
  deleteSavedPost as deleteSavedPostApi,
  getPostById as getPostByIdApi,
  getCurrentUser,
  getRecentPosts,
  likePost as likePostApi,
  savePost as savePostApi,
  signInAccount as signInAccountApi,
  signOutAccount,
  updatePost,
  deletePost as deletePostApi,
  getUserPosts,
  searchPosts,
  getInfinityPosts,
  getAllUsers,
  getUserById,
  updateUserProfile,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
import { Models } from "appwrite";

export function useCreateUserAccount() {
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useMutation({
      mutationFn: (user: INewUser) => createUserAccountApi(user),
    });

  return { isCreatingAccount, createUserAccount };
}

export function useGetCurrentUser() {
  const { data: currentUser, isLoading: isGettingUser } = useQuery({
    queryFn: getCurrentUser,
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
  });

  return { currentUser, isGettingUser };
}

export function useSignInAccount() {
  const { mutateAsync: signInAccount, isPending: isSignIn } = useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccountApi(user),
  });

  return { signInAccount, isSignIn };
}

export function useSignOutAccount() {
  const { mutate: signOut, isSuccess } = useMutation({
    mutationFn: signOutAccount,
  });

  return { signOut, isSuccess };
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { mutateAsync: createNewPost, isPending: isCreatingNewPost } =
    useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });

  return { createNewPost, isCreatingNewPost };
}

export function useGetRecentPosts() {
  const {
    data: posts,
    isLoading: isPostsLoading,
    isRefetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });

  return { posts, isPostsLoading, isRefetching };
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const { mutate: likePost } = useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePostApi(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });

  return { likePost };
}

export function useSavePost() {
  const queryClient = useQueryClient();
  const { mutate: savePost, isPending: isSavingPost } = useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePostApi(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });

  return { savePost, isSavingPost };
}

export function useDeleteSavePost() {
  const queryClient = useQueryClient();
  const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } =
    useMutation({
      mutationFn: (saveRecordId: string) => deleteSavedPostApi(saveRecordId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });

  return { deleteSavedPost, isDeletingSavedPost };
}

export function useGetPostById(postId?: string) {
  const {
    data: currentPost,
    isLoading: isGettingCurrentPost,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostByIdApi(postId),
    //to prevent refetching until the post Id is change
    enabled: !!postId,
  });

  return { currentPost, isGettingCurrentPost, isError, error };
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { mutateAsync: updatedPost, isPending: isUpdatingPost } = useMutation({
    mutationFn: (post: IUpdatedPost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });

  return { updatedPost, isUpdatingPost };
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePostApi(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });

  return { deletePost, isDeletingPost };
}

export function useGetUserPosts(userId: string) {
  const { data: userPosts, isLoading: isGettingUserPosts } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });

  return { userPosts, isGettingUserPosts };
}

export function useSearchPosts(searchParam: string) {
  const { data: searchedPosts, isFetching: isGettingSearchedPosts } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchParam],
    queryFn: () => searchPosts(searchParam),

    enabled: !!searchParam,
  });

  return { searchedPosts, isGettingSearchedPosts };
}



export function useGetInfinitePosts() {
  const {
    data: infinitePosts,
    isPending:isGettingIPosts,
    hasNextPage,
    isFetchingNextPage, 
    fetchNextPage,
    isFetching,
    error
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinityPosts ,
    initialPageParam:0,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;

      return lastId;
    },
  });

  return { infinitePosts,error,isFetching,fetchNextPage, isGettingIPosts, hasNextPage, isFetchingNextPage };
}

export function useGetUsers(limit?:number) {
  const {data:allUsers,isLoading,isError:isErrorCreators}= useQuery({
    queryKey:[QUERY_KEYS.GET_USERS],
    queryFn:()=> getAllUsers(limit)
  })

  return {allUsers,isLoading,isErrorCreators}
}

export function useGetUserById(userId:string) {
  const {data:userData,isLoading} = useQuery({
    queryKey:[QUERY_KEYS.GET_USER_BY_ID,userId],
    queryFn:()=> getUserById(userId),
    enabled: !!userId
  })


  return {userData,isLoading}
}


export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  const {mutateAsync:updateUser,isPending:isUpdatingProfile} = useMutation({
    mutationFn:(user:IUpdateProfile)=>updateUserProfile(user),
    onSuccess:(data)=> {
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID,data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })

  return {updateUser,isUpdatingProfile}
}