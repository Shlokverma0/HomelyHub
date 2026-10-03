import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/Home.css";

import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";

const Search = () => {
  const { RangePicker } = DatePicker;
  const [keyword, setKeyword] = useState({ city: "", guests: "", dateIn: "", dateOut: "" });
  const [value, setValue] = useState([]);

  const dispatch = useDispatch();

  function searchHandler(e) {
    e.preventDefault();
    dispatch(propertyAction.updateSearchParams({ ...keyword, page: 1 }));
    dispatch(getAllProperties());
    setKeyword({ city: "", guests: "", dateIn: "", dateOut: "" });
    setValue([]);
  }

  function returnDates(date, dateString) {
    setValue([date[0], date[1]]);
    updateKeyword("dateIn", dateString[0]);
    updateKeyword("dateOut", dateString[1]);
  }

  const updateKeyword = (field, value) => {
    setKeyword((prevKeyword) => ({
      ...prevKeyword,
      [field]: value,
    }));
  };

  return (
    <>
      <form className="searchbar" onSubmit={searchHandler}>
        <input
          className="search"
          id="search_destination"
          placeholder="Search destinations"
          type="text"
          value={keyword.city || ""}
          onChange={(e) => updateKeyword("city", e.target.value)}
        />
        <Space direction="vertical" size={12}>
          <RangePicker
            value={value}
            format="YYYY-MM-DD"
            picker="date"
            className="date_picker"
            disabledDate={(current) => {
              return current && current.isBefore(Date.now(), "day");
            }}
            onChange={returnDates}
          />
        </Space>
        <input
          className="search"
          id="addguest"
          placeholder="Add guests"
          type="number"
          value={keyword.guests || ""}
          onChange={(e) => updateKeyword("guests", e.target.value)}
        />
        <button className="material-symbols-outlined searchicon" type="submit" aria-label="Search stays">
          search
        </button>
      </form>
    </>
  );
};

export default Search;
