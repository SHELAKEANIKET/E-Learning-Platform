import React, { useState } from "react";
import { showToast } from "../../helper/toastMessage";
import { useApp } from "../../context/AppContextProvider";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function AddReviewModal({ course }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const { baseUrl } = useApp();

  const [reviews, setReviews] = useState({
    comment: "",
    rating: "",
  });

  const courseId = course?._id;

  const handleChange = (e) => {
    setReviews({ ...reviews, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${baseUrl}/review/add/${courseId}`,
        reviews,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        showToast(res.data.message, "success");
        setModalOpen(false);
      }

      setReviews({ comment: "", rating: "" });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        <button
          className="bg-primary p-1 w-fit rounded text-white"
          onClick={() => setModalOpen(true)}
        >
          Review
        </button>
      {isModalOpen ? (
        <div
          className="fixed z-50 inset-0"
          aria-labelledby="modal-title"
          role="model"
          aria-modal="true"
        >
          <div className="flex items-end justify-center sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="my-20 inline-block bg-white dark:bg-black/40 dark:text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all align-middle sm:max-w-lg w-full relative">
              <form
                onSubmit={handleSubmit}
                className="w-full p-4 md:p-8 rounded-lg max-w-xl bg-formBackground"
              >
                <p className="text-xl text-white text-center font-semibold">
                  Add Review
                </p>
                <div className="mt-4">
                  <label className="block text-white text-sm font-semibold mb-2">
                    Rating
                  </label>
                  <input
                    className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full"
                    name="rating"
                    value={reviews.rating}
                    onChange={handleChange}
                    placeholder="1-5"
                    type="number"
                    min={1}
                    max={5}
                    step={1}
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-white text-sm font-semibold mb-2">
                    Comment
                  </label>
                  <input
                    className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full"
                    name="comment"
                    value={reviews.comment}
                    onChange={handleChange}
                    type="text"
                    required
                  />
                </div>
                <div className="mt-8">
                  <button
                    disabled={isLoading}
                    className="bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold py-3 px-2 w-full rounded-md cursor-pointer flex justify-center items-center text-center"
                  >
                    {isLoading ? (
                      <div className="border-formBackground h-5 w-5 animate-spin rounded-full border-[3px] border-t-cyan-600" />
                    ) : (
                      "Add Review"
                    )}
                  </button>
                </div>
                <div className="absolute top-5 right-5 bg-gray-50 dark:bg-formBackground dark:text-white p-1 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setModalOpen(!true)}
                    className="mt-3 font-bold w-full inline-flex justify-center rounded shadow-sm p-1 bg-white text-base text-black hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-base"
                  >
                    <IoClose />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default AddReviewModal;
