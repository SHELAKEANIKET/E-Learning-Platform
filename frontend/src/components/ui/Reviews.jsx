import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useApp } from "../../context/AppContextProvider";
import moment from "moment";
import AddReviewModal from "./AddReviewModal";
import axios from "axios";

function Reviews({ course, isEnrolled }) {
  // var reviews = [
  //   {
  //     name: "jack smith",
  //     rating: 2,
  //     comment:
  //       "this is best js course this is best js course this is best js course this is best js course this is best js course",
  //   },
  //   {
  //     name: "varun kumar",
  //     rating: 2,
  //     comment: "very nice course",
  //   },
  //   {
  //     name: "rohan sharma",
  //     rating: 5,
  //     comment: "best js course",
  //   },
  //   {
  //     name: "varun kumar",
  //     rating: 2,
  //     comment: "very nice course",
  //   },
  //   {
  //     name: "rohan sharma",
  //     rating: 5,
  //     comment: "best js course",
  //   },
  // ];

  const [reviews, setReviews] = useState([]);
  const { baseUrl, user } = useApp();
  const rev = course?.reviews; // extract the course reviews array
  // console.log(rev);

  const getReviews = async () => {
    try {
      const res = await axios.get(`${baseUrl}/review/all/${course?._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setReviews(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getReviews();
  }, [course?._id]);

  function reviewStars(num) {
    let stars = [];

    for (let i = 0; i < num; i++) {
      stars.push(<FaStar className="text-yellow-400" />);
    }

    return <span className="flex">{stars}</span>;
  }
  const AlreadyReviewed = reviews?.some((rev) => rev.user.name !== user?.name)
    ? true
    : false;

  return (
    <div className="flex justify-start items-start gap-1 my-10 flex-col">
      <div className="w-full flex justify-between">
        <h1 className="text-xl font-semibold text-white">Students Reviews</h1>
        {AlreadyReviewed && <AddReviewModal course={course} />}
      </div>
      <div className="flex justify-start items-start flex-col overflow-y-auto scroll-smooth hide-scrollbar max-h-80 w-full">
        {reviews?.length > 0 ? (
          <div className="flex flex-col gap-2 my-4 w-full">
            {reviews.map((r, idx) => (
              <li
                key={idx}
                className="bg-white w-full rounded flex gap-1 flex-col py-1 px-2"
              >
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium">{r.user.name}</p>
                  <span className="text-sm">
                    {moment(r.createdAt).format("DD/MM/YY")}
                  </span>
                </div>
                <p className="">{reviewStars(r.rating)}</p>
                <p className="text-lg">{r.comment}</p>
              </li>
            ))}
          </div>
        ) : (
          <span className="text-white">No Reviews</span>
        )}
      </div>
    </div>
  );
}

export default Reviews;
