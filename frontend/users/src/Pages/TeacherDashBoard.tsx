import Navbar from "../components/Navbar";

const TeacherDashBoard = () => {
  return (
    <>
      <Navbar
        role={"teacher"}
        elements={["Bounties", "Submissions", "Notifications", "Account"]}
      />
    </>
  );
};

export default TeacherDashBoard;
