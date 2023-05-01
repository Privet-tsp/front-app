import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "../contexts/authContext";

const Protected = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthContext();
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default Protected;
