import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Setting from "./pages/Setting";
import Users from "./pages/Users";
import Bounty from "./pages/Bounty";
import Registrations from "./pages/Registrations";
import Balance from "./pages/Balance";
import Notification from "./pages/Notification";
import BountyDetails from "./pages/BountyDetails";
import TeacherProfile from "./pages/TeacherProfile";
import StudentProfile from "./pages/StudentProfile";
import UpdatePassword from "./pages/UpdatePassword";
import isAuthenticated from "../utils/isAuthenticated";
import PageNotFound from "./pages/PageNotFound";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/users" replace />;
};

const App = () => {
  return (
    <>
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Setting />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-user-password"
          element={
            <PrivateRoute>
              <UpdatePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/bounties"
          element={
            <PrivateRoute>
              <Bounty />
            </PrivateRoute>
          }
        />
        <Route
          path="/bounties/:bountyId"
          element={
            <PrivateRoute>
              <BountyDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/:teacherId"
          element={
            <PrivateRoute>
              <TeacherProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/:studentId"
          element={
            <PrivateRoute>
              <StudentProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/registrations"
          element={
            <PrivateRoute>
              <Registrations />
            </PrivateRoute>
          }
        />
        <Route
          path="/balances"
          element={
            <PrivateRoute>
              <Balance />
            </PrivateRoute>
          }
        />
        <Route
          path="/notify"
          element={
            <PrivateRoute>
              <Notification />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <PageNotFound />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
