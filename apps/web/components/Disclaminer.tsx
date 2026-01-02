"use client";

import { FaExclamationTriangle } from "react-icons/fa";

export const Disclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-orange-100 border-l-4 border-orange-500 rounded-md shadow-md">
      <div className="flex items-start gap-3">
        <FaExclamationTriangle className="text-orange-500 mt-1 text-xl" />
        <div>
          <h2 className="text-lg font-semibold text-orange-700 mb-2">
            Payment, Cancellation & Refund Policy
          </h2>
          <ul className="list-disc pl-5 text-sm text-orange-800 space-y-2">
            <li>
              All bookings are subject to availability and confirmation. Once the payment is
              completed, it is <strong>non-refundable</strong> under normal circumstances.
            </li>
            <li>
              To cancel your booking, you must call us at least <strong>3 days before</strong> the
              event. In such cases, your amount will be refunded after deducting a token fee of{" "}
              <strong>₹3000</strong> under <strong>7</strong> days.
            </li>
            <li>
              If cancellation is made <strong>1 day before</strong> the function, only{" "}
              <strong>50% of the amount</strong> will be refunded.
            </li>
            <li>
              In case we cancel or reschedule your booking, a <strong>full refund or alternate
              date</strong> will be provided as per mutual agreement.
            </li>
            <li>
              For refunds or cancellations, please contact:
              <br />
              📞 <strong>+91 98765 43210</strong>
              <br />
              📧 <strong>support@virajhall</strong>
            </li>
            <li>
              By making a payment, you agree to all our terms and conditions stated above.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
