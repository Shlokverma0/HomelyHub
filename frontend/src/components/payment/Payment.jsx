import React, { useEffect, useState } from "react";
import "../../css/Payment.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createBooking } from "../../store/Booking/booking-action.js";

const readDraft = () => {
  try {
    const value = sessionStorage.getItem("homelyhub_booking_draft");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { propertyId } = useParams();
  const [draft] = useState(readDraft);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!draft || draft.propertyId !== propertyId) {
      navigate(`/propertylist/${propertyId}`, { replace: true });
    }
  }, [draft, navigate, propertyId]);

  const handleBooking = async () => {
    setLoading(true);
    try {
      await dispatch(
        createBooking({
          propertyId: draft.propertyId,
          fromDate: draft.fromDate,
          toDate: draft.toDate,
          guests: draft.guests,
        }),
      );
      sessionStorage.removeItem("homelyhub_booking_draft");
      toast.success("Your reservation is confirmed.");
      navigate("/user/mybookings");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not reserve those dates. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!draft || draft.propertyId !== propertyId) return null;

  return (
    <main className="payment-container">
      <header className="payment-header">
        <h1>Review your reservation</h1>
        <p>{draft.propertyName}</p>
      </header>

      <section className="payment-content">
        <div className="booking-summary-card">
          <h3>Stay details</h3>
          <div className="detail-row">
            <span>Location:</span>
            <span>{[draft.address?.area, draft.address?.city, draft.address?.state].filter(Boolean).join(", ")}</span>
          </div>
          <div className="detail-row">
            <span>Check-in:</span>
            <span>{draft.fromDate}</span>
          </div>
          <div className="detail-row">
            <span>Check-out:</span>
            <span>{draft.toDate}</span>
          </div>
          <div className="detail-row">
            <span>Guests:</span>
            <span>{draft.guests}</span>
          </div>
          <div className="detail-row">
            <span>Nights:</span>
            <span>{draft.nights}</span>
          </div>
          <div className="detail-row">
            <span>Rate per night:</span>
            <span>&#8377;{Number(draft.pricePerNight).toLocaleString("en-IN")}</span>
          </div>
          <div className="detail-row total-row">
            <strong>Reservation total:</strong>
            <strong>&#8377;{Number(draft.totalPrice).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <p role="note">
          This project confirms a demo reservation only. No payment is collected.
        </p>
        <div className="payment-action">
          <button
            onClick={() => navigate(`/propertylist/${propertyId}`)}
            disabled={loading}
            type="button"
          >
            Back to property
          </button>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="book-now-btn"
            type="button"
          >
            {loading ? "Confirming..." : "Confirm reservation"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default Payment;
