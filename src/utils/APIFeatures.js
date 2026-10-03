const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const filters = {};
    const { minPrice, maxPrice, propertyType, roomType, amenities } =
      this.queryString;

    const price = {};
    if (minPrice !== undefined && minPrice !== "") {
      const minimum = Number(minPrice);
      if (Number.isFinite(minimum) && minimum >= 0) price.$gte = minimum;
    }
    if (maxPrice !== undefined && maxPrice !== "" && maxPrice !== ">") {
      const maximum = Number(String(maxPrice).replace(/^<=?/, ""));
      if (Number.isFinite(maximum) && maximum >= 0) price.$lte = maximum;
    }
    if (Object.keys(price).length) filters.price = price;

    if (propertyType) {
      filters.propertyType = {
        $in: String(propertyType)
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      };
    }
    if (roomType) filters.roomType = String(roomType);

    if (amenities) {
      const selected = (Array.isArray(amenities) ? amenities : [amenities])
        .map((value) => String(value).trim())
        .filter(Boolean);
      if (selected.length) filters["amenities.name"] = { $all: selected };
    }

    this.query = this.query.find(filters);
    return this;
  }

  search() {
    const { city, guests, dateIn, dateOut } = this.queryString;
    const search = {};

    if (city && String(city).trim()) {
      const pattern = new RegExp(escapeRegex(String(city).trim()), "i");
      search.$or = [
        { "address.city": pattern },
        { "address.state": pattern },
        { "address.area": pattern },
      ];
    }

    if (guests !== undefined && guests !== "") {
      const guestCount = Number(guests);
      if (Number.isInteger(guestCount) && guestCount > 0) {
        search.maximumGuest = { $gte: guestCount };
      }
    }

    if (dateIn && dateOut) {
      const start = new Date(dateIn);
      const end = new Date(dateOut);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start) {
        search.currentBookings = {
          $not: {
            $elemMatch: { fromDate: { $lt: end }, toDate: { $gt: start } },
          },
        };
      }
    }

    this.query = this.query.find(search);
    return this;
  }

  paginate() {
    const parsedPage = Number.parseInt(this.queryString.page, 10);
    const parsedLimit = Number.parseInt(this.queryString.limit, 10);
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isInteger(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 48)
      : 12;

    this.query = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}

export { APIFeatures };
