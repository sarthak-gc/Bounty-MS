import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
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

const App = () => {
  return (
    <>
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/users" element={<Users />} />
        <Route path="/bounties" element={<Bounty />} />
        <Route path="/bounties/:bountyId" element={<BountyDetails />} />
        <Route path="/teacher/:teacherId" element={<TeacherProfile />} />
        <Route path="/student/:studentId" element={<StudentProfile />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/balances" element={<Balance />} />
        <Route path="/notify" element={<Notification />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </>
  );
};

export default App;
