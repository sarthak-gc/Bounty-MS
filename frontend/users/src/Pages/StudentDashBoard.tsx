import Navbar from "../components/Navbar";

const StudentDashBoard = () => {
  return (
    <>
      <Navbar
        role={"student"}
        elements={["Bounties", "Submissions", "Notifications", "Account"]}
      />
    </>
  );
};

export default StudentDashBoard;
