import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

export default function PostForm({ post, action }: PostFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { createNewPost, isCreatingNewPost } = useCreatePost();
  const { updatedPost, isUpdatingPost } = useUpdatePost();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action === "Update") {
      const newUpdatedPost = await updatedPost({
        ...values,
        imageUrl: post.imageUrl,
        imageId: post.imageId,
        postId: post.$id,
      });

      if (!newUpdatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }

      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createNewPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }

    navigate("/");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-5xl flex-col gap-9">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="shad-textarea custom-scrollbar resize-none"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChanged={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input {...field} className="shad-input" />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags ( separated by comma " , " )
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shad-input"
                  placeholder="Art, Expression, Learn"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary h-12 whitespace-nowrap"
            disabled={isCreatingNewPost || isUpdatingPost}>
            {isCreatingNewPost || isUpdatingPost ? (
              <div className="flex-center w-16">
                <Loader without={true} />
              </div>
            ) : (
              `${action} Post`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
