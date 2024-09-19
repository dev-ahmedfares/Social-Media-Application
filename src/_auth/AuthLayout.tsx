import { useAuthContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const {isAuthenticated} = useAuthContext();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex-center flex-1 py-10 flex-col">
            <Outlet />
          </section>
          <img
            src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden w-1/2 bg-no-repeat object-cover xl:block"
          />
        </>
      )}
    </>
  );
}

export default AuthLayout;
