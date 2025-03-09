import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getBounty from "../../utils/individualBounty";
const BountyDetails = () => {
  const navigate = useNavigate();
  const { bountyId } = useParams();
  useEffect(() => {
    const fetchBountyDetails = async () => {
      if (!bountyId) {
        navigate("/admin/bounties");
        return;
      }
      try {
        const response = await getBounty(bountyId);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBountyDetails();
  }, [bountyId]);
  return (
    <>
      <h1>{bountyId}</h1>
    </>
  );
};

export default BountyDetails;
