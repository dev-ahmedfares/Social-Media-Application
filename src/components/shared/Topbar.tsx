import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useEffect } from "react";

export default function Topbar() {
  const { signOut, isSuccess } = useSignOutAccount();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <div className="topbar flex-between px-5 py-4">
      <Link to="/">
        <img
          src="/assets/images/logo.svg"
          alt="logo"
          width={130}
          height={325}

        />
      </Link>
      <div className="flex items-center gap-4">
        <Button
          variant={"ghost"}
          className="shad-button_ghost"
          onClick={() => signOut()}>
          <img src="/assets/icons/logout.svg" alt="logout" />
        </Button>
        <Link to={`/profile/${user.id}`}>
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile image"
            className="h-8 w-8 rounded-full object-cover object-top"
          />
        </Link>
      </div>
    </div>
  );
}
