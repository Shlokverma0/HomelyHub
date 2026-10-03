import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

const PaymentForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings = [],
}) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const { user } = useSelector((state) => state.user);

  const isDateDisabled = (current) => {
    if (current.isBefore(moment().startOf("day"))) return true;
    return currentBookings.some((booking) => {
      const start = moment(booking.fromDate).startOf("day");
      const end = moment(booking.toDate).startOf("day");
      return current.isSameOrAfter(start) && current.isBefore(end);
    });
  };

  const form = useForm({
    defaultValues: { dateRange: [], guests: "1" },
    onSubmit: async ({ value }) => {
      const [fromDate, toDate] = value.dateRange;
      const nights = moment(toDate, "YYYY-MM-DD").diff(
        moment(fromDate, "YYYY-MM-DD"),
        "days",
      );
      const guestCount = Number(value.guests);
      if (!fromDate || !toDate || nights < 1) {
        window.alert("Choose valid check-in and check-out dates.");
        return;
      }
      if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > maximumGuest) {
        window.alert(`Choose between 1 and ${maximumGuest} guests.`);
        return;
      }

      const draft = {
        propertyId,
        propertyName,
        address,
        pricePerNight: Number(price),
        fromDate,
        toDate,
        guests: guestCount,
        nights,
        totalPrice: Number(price) * nights,
      };
      sessionStorage.setItem("homelyhub_booking_draft", JSON.stringify(draft));
      navigate(`/payment/${propertyId}`);
    },
  });

  return (
    <div className="form-container">
      <form
        className="payment-form"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="price-pernight">
          Price: <b>&#8377;{Number(price).toLocaleString("en-IN")}</b>
          <span> / night</span>
        </div>
        <div className="payment-field">
          <form.Field name="dateRange">
            {(field) => (
              <div className="date">
                <Space direction="vertical" size={12}>
                  <RangePicker
                    value={selectedDates}
                    format="YYYY-MM-DD"
                    disabledDate={isDateDisabled}
                    onChange={(dates, dateStrings) => {
                      setSelectedDates(dates || []);
                      field.handleChange(dateStrings || []);
                    }}
                  />
                </Space>
              </div>
            )}
          </form.Field>
          <form.Field name="guests">
            {(field) => (
              <div className="guest">
                <label className="payment-labels" htmlFor="booking-guests">
                  Number of guests (max {maximumGuest}):
                </label>
                <input
                  id="booking-guests"
                  type="number"
                  min="1"
                  max={maximumGuest}
                  className="no-of-guest"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>
        <div className="book-place">
          <button type="submit">
            {user ? "Review reservation" : "Continue to login and reserve"}
            {selectedDates.length === 2 && (
              <> · &#8377;{(Number(price) * moment(selectedDates[1]).diff(moment(selectedDates[0]), "days")).toLocaleString("en-IN")}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
