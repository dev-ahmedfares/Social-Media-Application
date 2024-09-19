import FormProfile from "@/components/shared/FormProfile";
import Loader from "@/components/shared/Loader";
import { useGetUserById } from "@/lib/react-query/queries";
import { useParams } from "react-router-dom";

export default function UpdateProfile() {
  const { id } = useParams();
  const { userData, isLoading } = useGetUserById(id || "");
  return (
    <div className="saved-container max-md:my-16">
      <h2 className="h3-bold lg:h2-bold flex w-full max-w-5xl items-center gap-3">
        <img
          src="/assets/icons/edit.svg"
          alt="save icon"
          className="invert-white h-7 w-7 lg:h-8 lg:w-8"
        />
        <p>Edit Profile</p>
      </h2>
      {isLoading || !userData ? (
        <div className="flex-center w-full h-full">
          <Loader without={true} />
        </div>
      ) : (
        <FormProfile userData={userData} />
      )}
    </div>
  );
}
