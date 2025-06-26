import crypto from "crypto";
import { Enrollment } from "../models/enrollment.model.js";
import { Course } from "../models/course.model.js";
import { Cashfree } from "cashfree-pg";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";

dotenv.config();

var pg = new Cashfree(
  Cashfree.SANDBOX,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(uniqueId).digest("hex");
  return hash.substr(0, 12);
}

const checkout = async (req, res) => {
  try {
    const { courseId, coursePrice } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const orderId = generateOrderId();

    var request = {
      order_amount: coursePrice,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: req.user?._id.toString(),
        customer_phone: "8888888888",
        customer_name: req.user?.name,
        customer_email: req.user?.email,
      },
      order_meta: {
        return_url: `https://eduhub-elearning.vercel.app/payment-success?order_id=${orderId}&course_id=${courseId}`, // frontend URL
      },
    };

    const response = await pg.PGCreateOrder(request);
    // console.log("Res:", response);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, courseId } = req.body;
    const userId = req.user._id;
    const response = await pg.PGOrderFetchPayments(orderId);

    // console.log("response from verifyPayment method ", response.data);

    if (response.data.length && response.data[0].payment_status === "SUCCESS") {
      // Check if already enrolled
      const existing = await Enrollment.findOne({
        course: courseId,
        user: userId,
      });
      if (existing) {
        return res.status(400).json({ message: "Already enrolled" });
      }

      // Save enrollment info
      const enrollment = new Enrollment({
        user: userId,
        course: courseId,
        paymentInfo: {
          orderId,
          paymentId: response.data[0].cf_payment_id,
          amountPaid: response.data[0].order_amount,
        },
      });

      // Save payment info
      const payment = new Payment({
        user: userId,
        course: courseId,
        amount: response.data[0].order_amount,
      });

      await payment.save();
      await enrollment.save();

      // update the Course and User documents
      const course = await Course.findById(courseId);
      const user = await User.findById(userId);

      if (!course.studentsEnrolled?.includes(userId)) {
        course.studentsEnrolled.push(userId);
        await course.save();
      }

      if (!user.enrolledCourses?.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      res.status(200).json({ success: true, payment: response.data[0] });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { checkout, verifyPayment };
