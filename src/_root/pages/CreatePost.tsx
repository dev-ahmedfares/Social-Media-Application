import PostForm from "@/components/forms/PostForm";

export default function CreatePost() {
  return (
    <div className="flex flex-1">
      <div className="common-container max-md:pt-24">
        <div className="flex w-full max-w-5xl items-center justify-start gap-3">
          <img
            src="/assets/icons/add-post.svg"
            alt="add-post icon"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold">Create Post</h2>
        </div>
        <PostForm action="Create"/>
      </div>
    </div>
  );
}
