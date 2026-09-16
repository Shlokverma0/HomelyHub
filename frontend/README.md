# HomelyHub — Static Frontend

This is the **static version** of the HomelyHub frontend.

It is a copy of `frontend/` with **all Redux Toolkit logic removed**.
Nothing else was changed — every component, className, CSS file, JSX
structure, route and dependency is exactly the same as the original.

## Run it

```bash
npm install
npm run dev
```

## What was removed

| Removed | Replaced with |
| --- | --- |
| `src/store/` (all slices + actions) | `src/data/staticData.js` — plain placeholder data |
| `<Provider store={store}>` in `main.jsx` | nothing — the app renders directly |
| `useSelector(...)` | `useState(STATIC_...)` inside each component |
| `dispatch(someAction())` | a `// TODO: add your ... logic here` comment |
| `@reduxjs/toolkit`, `react-redux` in `package.json` | removed from dependencies |

## How to add your own logic

Every place that used to talk to the store is marked with a comment.
Search the project for:

```
TODO:
```

There are two kinds of spots:

**1. Reading data** — a `useState` seeded with placeholder data:

```jsx
// STATIC: was `useSelector((state) => state.properties)`.
// TODO: replace with your own fetch logic.
const [properties] = useState(STATIC_PROPERTIES);
```

Swap the initial value for your API/context result (add a setter if you need
one). The data shape in `src/data/staticData.js` matches what the JSX below
it expects, so the markup keeps working unchanged.

**2. Writing data** — an empty handler:

```jsx
const submitHandler = (e) => {
  e.preventDefault();
  // TODO: add your login logic here.
  console.log({ email, password });
  ...
};
```

Drop your call in place of the `console.log`. The payload objects the original
app sent are still spelled out in the code (booking details, new accomodation,
updated profile fields), so you can pass them straight to your API.

`src/utils/axios.js` is untouched and still points at `VITE_API_BASE_URL`
from `.env`, so you can start making requests right away.

## Files that contain TODOs

```
src/App.jsx                                    current user
src/components/home/Header.jsx                 auth state, logout, reset filters
src/components/home/Search.jsx                 search
src/components/home/Filter.jsx                 filters
src/components/home/PropertyList.jsx           properties + pagination
src/components/propertyListing/PropertyListing.jsx   property details
src/components/propertyListing/PaymentForm.jsx       auth state, save booking
src/components/payment/Payment.jsx             create order, verify payment
src/components/user/Login.jsx                  login
src/components/user/Signup.jsx                 signup
src/components/user/Profile.jsx                current user
src/components/user/EditProfile.jsx            current user, update profile
src/components/user/UpdatePassword.jsx         update password
src/components/user/ForgetPassword.jsx         forgot password
src/components/user/ResetPassword.jsx          reset password
src/components/accomodation/Accomodation.jsx       my accomodations
src/components/accomodation/AccomodationForm.jsx   create accomodation
src/components/myBookings/MyBookings.jsx       my bookings
src/components/myBookings/BookingDetails.jsx   booking details
```

## Placeholder data

`src/data/staticData.js` holds the sample user, properties, property details,
bookings, accomodations and payment details. Set
`STATIC_IS_AUTHENTICATED` to `false` there to preview the logged-out UI.
Delete the file once your own data is wired in.
