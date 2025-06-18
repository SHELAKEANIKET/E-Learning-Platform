import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useApp } from "../context/AppContextProvider";
import { showToast } from "../helper/toastMessage";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const courseId = searchParams.get("course_id");
  const { baseUrl } = useApp();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'failed'

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          `${baseUrl}/payment/verify`,
          { orderId, courseId },
          { withCredentials: true }
        );

        // console.log("Data from backend:", data.payment);

        if (data.payment.payment_status === "SUCCESS") {
          showToast("Payment successful! You're enrolled.", "success");
          setStatus("success");
        } else {
          showToast("Payment not verified or failed.", "error");
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err.message);
        showToast("Verification failed.", "error");
        setStatus("failed");
      }
    };

    if (orderId) verifyPayment();
    else setStatus("failed");
  }, [orderId, courseId]);

  return (
    <div className="mt-20 flex justify-center items-center gap-3 flex-col text-white">
      <h2 className="text-2xl">Payment Result</h2>

      {status === "loading" && <p className="text-lg">Verifying payment...</p>}

      {status === "success" && (
        <>
          <p className="text-lg">Payment Verified Successfully!</p>
          <Link
            to={`/course/${courseId}`}
            className="bg-blue-600 text-white px-4 py-3 rounded"
          >
            Go to Course
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <p className="text-lg text-red-500">Payment verification failed.</p>
          <Link
            to="/allcourses"
            className="bg-gray-700 text-white px-4 py-3 rounded"
          >
            Back to Courses
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
