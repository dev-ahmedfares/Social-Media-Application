import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type GridUserListProps = {
    users: Models.Document[];
    inHome?:boolean
};

export default function GridUserList({ users,inHome }: GridUserListProps) {

    return (
    <ul className={inHome? "grid 2xl:grid-cols-2 gap-5 " :`user-grid`}>
      {users.map((user) => (
        <li key={user.$id} className="w-full flex-1 min-w-[200px]">
          <Link to={`/profile/${user.$id}`} className="user-card">
            <img
              src={user.imageUrl}
              alt="image"
              className="h-14 w-14 object-cover rounded-full"
            />
            <div className="text-center">
            <p className="body-bold ">{user.name}</p>
            <p className="small-regular  text-light-3 ">@{user.username}</p>
            </div>
            <Button className="shad-button_primary">Follow</Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
