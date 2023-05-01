import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "../contexts/authContext";

const ProtectedModerator = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthContext();
  return user?.moderatorId ? (
    children
  ) : (
    <Navigate to="/profile" state={{ from: location }} replace />
  );
};

export default ProtectedModerator;
