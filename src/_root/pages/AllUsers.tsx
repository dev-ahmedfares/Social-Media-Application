import GridUserList from "@/components/shared/GridUserList";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/hooks/use-toast";

import { useGetUsers } from "@/lib/react-query/queries";



export default function AllUsers() {

  const { toast } = useToast();
  const { allUsers, isLoading, isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return;
  }

  return (
    <div className="saved-container max-lg:px-10">
      <h2 className="h3-bold md:h2-bold flex w-full max-w-5xl items-center gap-3">
        All Users
      </h2>
      {isLoading || !allUsers ? (
        <div className="flex-center h-full">
          <Loader without={true} />
        </div>
      ) : (
        <GridUserList users={allUsers.documents} />
      )}
    </div>
  );
}
