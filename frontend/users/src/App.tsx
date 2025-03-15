import Login from "./Pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";

import TeacherDashBoard from "./Pages/TeacherDashBoard";
import StudentDashBoard from "./Pages/StudentDashBoard";
import Bounty from "./Pages/Bounty";
import AddBounty from "./Pages/AddBounty";
import Submissions from "./Pages/Submissions";
import {
  isStudentAuthenticated,
  isTeacherAuthenticated,
} from "../utils/isAuthenticated";
import ReviewAnswer from "./Pages/ReviewAnswer";
import Register from "./Pages/Registration";
import StudentBounty from "./Pages/StudentBounty";
import BountyDetail from "./Pages/BountyDetail";
import SubmitAnswer from "./Pages/SubmitAnswer";
import StudentSubmission from "./Pages/StudentSubmission";
import SubmissionAnswer from "./Pages/SubmissionAnswer";
import Navbar from "./components/Navbar";
import PageNotFound from "./Pages/PageNotFound";

interface TeacherPrivateRouteI {
  children: React.ReactNode;
}
const TeacherPrivateRoute: React.FC<TeacherPrivateRouteI> = ({ children }) => {
  return isTeacherAuthenticated() ? (
    <>
      <Navbar
        role={"teacher"}
        elements={["Bounties", "Notifications", "Account"]}
      />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
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
      <Route path="/register" element={<Register />} />

      <Route
        path="/student/dashboard"
        element={
          <StudentPrivateRoute>
            <StudentDashBoard />
          </StudentPrivateRoute>
        }
      />
      <Route
        path="/teacher"
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
            <StudentBounty />
          </StudentPrivateRoute>
        }
      />
      <Route
        path="/add-bounty"
        element={
          <TeacherPrivateRoute>
            <AddBounty />
          </TeacherPrivateRoute>
        }
      />
      <Route
        path="submissions/:bountyId/review-answer/:submissionId"
        element={
          <TeacherPrivateRoute>
            <ReviewAnswer />
          </TeacherPrivateRoute>
        }
      />

      <Route path="/submissions/:bountyId" element={<Submissions />} />
      <Route path="*" element={<PageNotFound />} />

      <Route path="/bounty/:bountyId" element={<BountyDetail />} />
      <Route path="/submit-answer/:bountyId" element={<SubmitAnswer />} />
      <Route path="student/submissions" element={<StudentSubmission />} />
      <Route
        path="/bounty/:bountyId/answer/:submissionId"
        element={<SubmissionAnswer />}
      />
    </Routes>
  );
};

export default App;
