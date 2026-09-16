import React, { useEffect, useState } from "react";
import "../../css/Payment.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  STATIC_PAYMENT_DETAILS,
  STATIC_ORDER_DATA,
} from "../../data/staticData";

const Payment = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [showPaymentGateaway, setShowPaymentGateaway] = useState(false);

  // STATIC: was `useSelector(selectPaymentDetails)`.
  // TODO: replace with your own booking details logic.
  const [paymentDetails] = useState(STATIC_PAYMENT_DETAILS);
  const {
    checkinDate,
    checkoutDate,
    totalPrice,
    propertyName,
    guests,
    nights,
  } = paymentDetails;

  // STATIC: was `useSelector(selectPaymentStatus)`.
  // TODO: replace with your own payment status logic.
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const handleBooking = async () => {
    const paymentData = {
      amount: totalPrice,
      propertyId,
      fromDate: checkinDate,
      toDate: checkoutDate,
      guests,
    };
    console.log(paymentData);

    // TODO: add your "create order / initiate checkout" logic here.
    // Statically we just show the payment gateway screen.
    setLoading(true);
    setOrderData(STATIC_ORDER_DATA);
    setLoading(false);
  };

  const handleConfirmPayment = async () => {
    // TODO: add your "verify payment" logic here.
    toast.success("🎉 Payment Successful! Booking Confirmed!");
    setTimeout(() => navigate("/user/mybookings"), 1000);
    setOrderData(null);
  };

  const handleCancelPayment = () => {
    toast.error("Payment Cancelled");
    navigate(`/propertylist/${propertyId}`);
  };
  useEffect(() => {
    if (orderData && !showPaymentGateaway) {
      setShowPaymentGateaway(true);
    }
  }, [orderData]);
  if (showPaymentGateaway && orderData) {
    return (
      <div className="payment-gateway-overlay">
        <div className="payment-gateway-modal">

          <div className="gateway-header">
            <div className="gateway-logo">
              <h2>🏠 HomelyHub</h2>
              <span>Payment Gateway</span>
            </div>
            <div className="secure-badge">
              <span>🔒 Secure Payment</span>
            </div>
          </div>

          <div className="gateway-content">
            <div className="merchant-info">
              <h3>
                Payment to: <strong>HomelyHub</strong>
              </h3>
              <p>
                Order ID: <strong>{orderData.orderId}</strong>
              </p>
            </div>

            <div className="payment-summary">
              <div className="summary-item">
                <span>Property:</span>
                <span>{propertyName}</span>
              </div>
              <div className="summary-item">
                <span>Check-in:</span>
                <span>{checkinDate}</span>
              </div>
              <div className="summary-item">
                <span>Check-out:</span>
                <span>{checkoutDate}</span>
              </div>
              <div className="summary-item">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="summary-item">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
              <div className="summary-item total-amount">
                <span>
                  <strong>Total Amount:</strong>
                </span>
                <span>
                  <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
                </span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="gateway-actions">
              <button
                onClick={handleCancelPayment}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel Payment
              </button>
              <button
                onClick={handleConfirmPayment}
                className="confirm-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    Confirm Payment ₹{totalPrice.toLocaleString("en-IN")}
                  </>
                )}
              </button>
            </div>

            <div className="security-info">
              <p>
                <span>🛡️</span>
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Complete Your Booking</h1>
        <p>{propertyName}</p>
      </div>

      <div className="payment-content">

        <div className="booking-summary-card">
          <h3>Booking Details</h3>
          <div className="detail-row">
            <span>Check-in:</span>
            <span>{checkinDate}</span>
          </div>
          <div className="detail-row">
            <span>Check-out:</span>
            <span>{checkoutDate}</span>
          </div>
          <div className="detail-row">
            <span>Guests:</span>
            <span>{guests}</span>
          </div>
          <div className="detail-row">
            <span>Nights:</span>
            <span>{nights}</span>
          </div>
          <div className="detail-row total-row">
            <strong>Total Amount:</strong>
            <strong>₹{totalPrice}</strong>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="payment-action">
          <button
            onClick={handleBooking}
            disabled={loading}
            className="book-now-btn"
          >
            {loading ? "Processing..." : `Proceed to Payment ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
