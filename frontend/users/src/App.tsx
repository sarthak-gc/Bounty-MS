import Login from "./Pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";

import TeacherDashBoard from "./Pages/TeacherDashBoard";
import StudentDashBoard from "./Pages/StudentDashBoard";
import Bounty from "./Pages/Bounty";
import Submissions from "./Pages/Submissions";
import {
  isStudentAuthenticated,
  isTeacherAuthenticated,
} from "../utils/isAuthenticated";
import ReviewAnswer from "./Pages/ReviewAnswer";
interface TeacherPrivateRouteI {
  children: React.ReactNode;
}
const TeacherPrivateRoute: React.FC<TeacherPrivateRouteI> = ({ children }) => {
  return isTeacherAuthenticated() ? children : <Navigate to="/login" />;
};
interface StudentPrivateRouteI {
  children: React.ReactNode;
}
const StudentPrivateRoute: React.FC<StudentPrivateRouteI> = ({ children }) => {
  return isStudentAuthenticated() ? children : <Navigate to="/login" />;
};
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/student/dashboard"
        element={
          <StudentPrivateRoute>
            <StudentDashBoard />
          </StudentPrivateRoute>
        }
      />
      <Route
        path="/teacher/dashboard"
        element={
          <TeacherPrivateRoute>
            <TeacherDashBoard />
          </TeacherPrivateRoute>
        }
      />
      <Route
        path="/teacher/bounties"
        element={
          <TeacherPrivateRoute>
            <Bounty />
          </TeacherPrivateRoute>
        }
      />

      <Route
        path="/student/bounties"
        element={
          <StudentPrivateRoute>
            <Bounty />
          </StudentPrivateRoute>
        }
      />
      <Route path="/review-answer/:submissionId" element={<ReviewAnswer />} />

      <Route path="/submissions/:bountyId" element={<Submissions />} />
    </Routes>
  );
};

export default App;
