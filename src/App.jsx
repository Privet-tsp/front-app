import { Routes, Route } from "react-router-dom";

import {
  Login,
  Register,
  Profile,
  Anketa,
  NotFound,
  User,
  LoginModerator,
  RegisterModerator,
  All,
  Appeals,
} from "./pages";
import { Protected, SharedLayout, ProtectedModerator } from "./components/";
import { useAuth } from "./hooks";

const App = () => {
  useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/moderator" element={<LoginModerator />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/moderator" element={<RegisterModerator />} />
      <Route
        path="/all"
        element={
          <ProtectedModerator>
            <SharedLayout>
              <All />
            </SharedLayout>
          </ProtectedModerator>
        }
      />
      <Route
        path="/appeals"
        element={
          <ProtectedModerator>
            <SharedLayout>
              <Appeals />
            </SharedLayout>
          </ProtectedModerator>
        }
      />
      <Route
        path="/profile"
        element={
          <Protected>
            <SharedLayout>
              <Profile />
            </SharedLayout>
          </Protected>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <Protected>
            <SharedLayout>
              <User />
            </SharedLayout>
          </Protected>
        }
      />
      <Route
        path="/search"
        element={
          <Protected>
            <SharedLayout>
              <Anketa />
            </SharedLayout>
          </Protected>
        }
      />
      <Route
        path="*"
        element={
          <SharedLayout>
            <NotFound />
          </SharedLayout>
        }
      />
    </Routes>
  );
};

export default App;
