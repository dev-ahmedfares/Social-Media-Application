import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function PageNotFound() {
    const navigate = useNavigate();
  return (
    <div className="flex-center flex-1 flex-col">
        <img src="/public/assets/icons/Oops! 404 Error with a broken robot-rafiki.svg" alt="" className="w-60 h-60 lg:w-80 lg:h-80"/>
        <p className="h3-bold md:h2-bold">Page Not Found</p>
        <Button
          type="button"
          onClick={() => navigate("/")}
          variant={"default"}
          className="shad-button_primary mt-5">
          Back To Home
        </Button>
      </div>
  )
}
