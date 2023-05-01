import ReactDOM from "react-dom";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="absolute top-1/2 left-1/2 translate-x-[-50%] text-white translate-y-[-50%]">
      <ClipLoader color="white" />
    </div>,
    document.getElementById("root")
  );
};

export default Loader;
