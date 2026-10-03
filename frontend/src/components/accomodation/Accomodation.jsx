import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axios.js";
import "../../css/Accomodation.css";
import ProgressSteps from "../ProgressSteps";
import MyAccomodation from "./MyAccomodation";
import LoadingSpinner from "../LoadingSpinner";

const Accomodation = () => {
  const [accomodation, setAccomodation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccomodations = async () => {
      try {
        const { data } = await axiosInstance.get("/v1/rent/user/myAccommodation");
        setAccomodation(data.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Could not load your properties.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAccomodations();
  }, []);

  return (
    <>
      <ProgressSteps accomodation />
      <div className="accom-container">
        <Link to="/accomodationform">
          <button className="add-new-place">+ Add new place</button>
        </Link>
        {loading && <LoadingSpinner />}
        {!loading && accomodation.length === 0 && (
          <p>You have not published a property yet.</p>
        )}
        {!loading && accomodation.length > 0 && (
          <MyAccomodation accomodation={accomodation} />
        )}
      </div>
    </>
  );
};

export default Accomodation;
