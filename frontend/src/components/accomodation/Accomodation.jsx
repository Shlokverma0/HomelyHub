import React, { useEffect, useState } from "react";
import "../../css/Accomodation.css";
import ProgressSteps from "../ProgressSteps";
import MyAccomodation from "./MyAccomodation";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { STATIC_ACCOMODATION } from "../../data/staticData";

const Accomodation = () => {
  // STATIC: was `useSelector((state) => state.accomodation)`.
  // TODO: replace with your own accomodation fetching logic.
  const [accomodation] = useState(STATIC_ACCOMODATION);
  const [loading] = useState(false);

  useEffect(() => {
    // TODO: fetch the user's accomodations here and set them above.
  }, []);

  return (
    <>
      <ProgressSteps accomodation />
      <div className="accom-container">
        <Link to="/accomodationform">
          <button className="add-new-place">+ Add new place</button>
        </Link>
        {loading && <LoadingSpinner />}
        {accomodation.length === 0 && !loading && (
          <p>Accomodation not available</p>
        )}
        {accomodation.length > 0 && !loading && (
          <MyAccomodation accomodation={accomodation} loading={loading} />
        )}
      </div>
    </>
  );
};

export default Accomodation;
