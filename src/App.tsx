import { Route, Routes } from "react-router-dom";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages";
import "./global.css";
import { Toaster } from "./components/ui/toaster";
import PageNotFound from "./_root/pages/PageNotFound";


function App() {
  return (
    <main className="flex supports-[height:100dvh]:h-dvh h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/sign-in" element={<SigninForm />} />
        </Route>
        {/* Private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="*" element={<PageNotFound/>}/>
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
