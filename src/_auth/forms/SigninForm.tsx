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
import {  useSignInAccount } from "@/lib/react-query/queries";
import { SigninValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate()
  const {checkAuthUser, isLoading:isUserLoading}= useAuthContext()
  
  // Queries
  const { signInAccount, isSignIn } = useSignInAccount()
   // 1. Define form.
   const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function handleSignin(user: z.infer<typeof SigninValidation>) {
    const session = await signInAccount(user)

    if (!session) {
      toast({title:"Login failed. Please try again."})
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
    
  }
  
  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-420">
        <img
          src="/assets/images/logo.svg"
          alt="logo"
          className="mb-5 md:mb-12"
        />
        <h2 className="h3-bold md:h2-bold mb-1">Log in to your account</h2>
        <p className="small-regular md:base-regular mb-5 text-light-3">
        Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex w-full flex-col gap-5">
          
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
            disabled={isUserLoading || isSignIn}
            type="submit"
            className="shad-button_primary">
            {isUserLoading || isSignIn ? <Loader /> : "Sign Up"}
          </Button>
          <p className="small-regular mt-3 text-center text-light-2">
          Don&apos;t have an account?{" "}
            <Link
              className="small-semibold text-primary-500 hover:text-primary-600"
              to="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm