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

import ImageUploader from "@/components/shared/ImageUploader";

import { useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Models } from "appwrite";
import { ProfileValidation } from "@/lib/validation";
import { useUpdateUserProfile } from "@/lib/react-query/queries";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/AuthContext";

export default function FormProfile({
  userData,
}: {
  userData: Models.Document;
}) {
    const {user,setUser}= useAuthContext()
  const navigate = useNavigate();
  const { updateUser, isUpdatingProfile } = useUpdateUserProfile();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: userData.name,
      username: userData.username,
      email: userData.email,
      bio: userData.bio || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    const updatedUser = await updateUser({
      ...values,
      userId: userData.$id,
      imageId: userData.imageId,
      imageUrl: userData.imageUrl,
    });

    if (!updatedUser) {
      return toast({
        title: `Update user failed. Please try again.`,
      });
    }

    setUser({
        ...user,
        name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    })

    return navigate(`/profile/${userData.$id}`);
  }

  if (!userData) {
    return (
      <div className="flex-center w-full">
        <Loader without={true} />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-5xl space-y-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploader
                  fieldChanged={field.onChange}
                  mediaUrl={userData.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} disabled />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} disabled />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea resize-none" {...field} />
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
            disabled={isUpdatingProfile}>
            {isUpdatingProfile ? (
              <div className="flex-center w-16">
                <Loader without={true} />
              </div>
            ) : (
              `Update Profile`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
