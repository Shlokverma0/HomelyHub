import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../../css/Home.css";

import {useDispatch, useSelector} from "react-redux";
import {propertyAction} from "../../store/Property/property-slice";
import {getAllProperties} from "../../store/Property/property-action";
import LoadingSpinner from "../LoadingSpinner";

const Card = ({ id, image, name, address, price }) => {
  return (
    <figure className="property">
      <Link to={`/propertylist/${id}`}>
        <img src={image} alt="Propertyimg" />
      </Link>
      <h4>{name}</h4>
      <figcaption>
        <main className="propertydetails">
          <h5>{name}</h5>

          <h6>
            <span className="material-symbols-outlined houseicon">
              home_pin
            </span>
            {address}
          </h6>
          <p>
            <span className="price"> ₹{price}</span> per night
          </p>
        </main>
      </figcaption>
    </figure>
  );
};

const PropertyList = () => {
  const [currentPage, setCurrentPage] = useState({ page: 1 });

  const dispatch = useDispatch();
  const {properties, totalProperties, loading, error} = useSelector((state) => state.properties);

  const lastPage = Math.ceil(totalProperties / 12);

  const propertyListRef = useRef(null);

  useEffect(() => {
  const fetchProperties =  async(page) =>{
    dispatch(propertyAction.updateSearchParams(page));
    dispatch(getAllProperties())
  };
  fetchProperties(currentPage)
  }, [currentPage, dispatch]);

  useEffect(() => {
    if (propertyListRef.current) {
      gsap.fromTo(
        propertyListRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [properties]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="not_found">{error}</p>
      ) : properties.length === 0 ? (
        <p className={"not_found"}>No stays found. Try changing your search or filters.</p>
      ) : (
        <div className="propertylist" ref={propertyListRef}>
          {properties.map((property) => (
            <Card
              key={property._id}
              id={property._id}
              image={property.images?.[0]?.url || "/assets/property2.webp"}
              name={property.propertyName}
              address={[property.address?.city, property.address?.state, property.address?.pincode].filter(Boolean).join(", ")}
              price={property.price}
              slug={property.slug}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="previous_btn"
          onClick={() => setCurrentPage((prev) => ({ page: prev.page - 1 }))}
          disabled={currentPage.page === 1}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>

        <button
          className="next_btn"
          onClick={() => setCurrentPage((prev) => ({ page: prev.page + 1 }))}
          disabled={loading || properties.length < 12 || currentPage.page >= lastPage}
        >
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </>
  );
};

export default PropertyList;
