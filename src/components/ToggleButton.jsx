import { cn } from "../utils/utils";
import { Switch } from "@headlessui/react";

const ToggleButton = (props) => {
  return (
    <div className="flex flex-row items-center justify-start cursor-pointer">
      <Switch
        checked={props.checked}
        onChange={props.onChange}
        className={cn(
          "relative border inline-flex items-center  pr-6 pl-0.5 border-solid  aspect-[3] rounded-full w-10 py-1 shadow-sm transition-colors",
          props.checked
            ? "border-meme-red-meme-red-700"
            : "border-meme-gray-meme-gray-600"
        )}
      >
        <span className="sr-only">Hide Label 1 Info</span>
        <span
          className={cn(
            props.checked
              ? "translate-x-5 bg-slate-300"
              : "translate-x-0.5 bg-gray-500",
            "shadow inline-block size-3 transform  rounded-full transition "
          )}
        />
      </Switch>
    </div>
  );
};

export default ToggleButton;
