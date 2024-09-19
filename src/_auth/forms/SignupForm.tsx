import Loader from "@/components/shared/Loader";
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
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate()
  const {checkAuthUser}= useAuthContext()
  
  // Queries
  const { signInAccount } = useSignInAccount()
  const {createUserAccount,isCreatingAccount} = useCreateUserAccount()

  // 1. Define form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(user: z.infer<typeof SignupValidation>) {
    try {
      const newUser = await createUserAccount(user);
    if (!newUser) return toast({title:"Sign up failed. Please try again."});

    const session = await signInAccount({email:user.email,password:user.password})

    if (!session){
      toast({title:"Something went wrong. Please login your new account"})
      navigate("/sign-in")
      return;
    }
    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()
      navigate("/")
    } else {
      toast({title:"Login failed. Please try again."})
      return
    }
    } catch (error) {
      console.log(error)
    }

  }
  
  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-420">
        <img
          src="/assets/images/logo.svg"
          alt="logo"
          className="mb-5 md:mb-12"
        />
        <h2 className="h3-bold md:h2-bold mb-1">Create a new account</h2>
        <p className="small-regular md:base-regular mb-5 text-light-3">
          To use snapgram, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                  <Input type="text" className="shad-input" {...field} />
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
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <Button
            disabled={isCreatingAccount}
            type="submit"
            className="shad-button_primary">
            {isCreatingAccount ? <Loader /> : "Sign Up"}
          </Button>
          <p className="small-regular mt-3 text-center text-light-2">
            Already have an account?{" "}
            <Link
              className="small-semibold text-primary-500 hover:text-primary-600"
              to="/sign-in">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
