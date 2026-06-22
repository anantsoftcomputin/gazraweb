import LegalPageShell, { LegalSection } from '../components/shared/LegalPageShell';
import { OPERATING_ENTITY, PARENT_ORG, LEGAL_CONTACT } from '../constants/legalInfo';

const RefundPolicy = () => {
  return (
    <LegalPageShell
      title="Refund"
      highlight="Policy"
      description="Please read this policy carefully before placing an order or making a booking with Gazra Cafe."
      lastUpdated="22 June 2026"
    >
      <LegalSection title="1. Overview">
        <p>
          This Refund Policy applies to all orders, bookings, and payments made in connection with Gazra Cafe, operated
          by {OPERATING_ENTITY.name} ({OPERATING_ENTITY.type}) as part of {PARENT_ORG.name}. This policy covers both
          in-cafe payments and, once enabled, online orders placed through this Website and processed via Razorpay.
        </p>
      </LegalSection>

      <LegalSection title="2. No Refund Policy">
        <p className="font-semibold text-neutral-800">
          Gazra Cafe does not offer refunds, exchanges, or reversals on any completed order or payment.
        </p>
        <p>
          Once an order has been placed and payment has been confirmed — whether in-cafe or, in future, online — that
          payment is final. This applies to food and beverage items, table bookings, and any other paid service offered
          by Gazra Cafe, regardless of whether the order has been collected, served, or consumed.
        </p>
      </LegalSection>

      <LegalSection title="3. Order Cancellations">
        <p>
          You may request to cancel an order only before it has been confirmed and accepted by Gazra Cafe staff or, for
          online orders, before preparation has begun. Once an order is confirmed or preparation has started, it cannot
          be cancelled and is not eligible for a refund.
        </p>
      </LegalSection>

      <LegalSection title="4. Quality or Service Concerns">
        <p>
          We take quality seriously. If you are unhappy with an item or experience at Gazra Cafe, please let our staff
          know at the time, or contact us using the details below. While we do not provide monetary refunds, we may, at
          our sole discretion, offer a replacement item or other goodwill gesture to make things right.
        </p>
      </LegalSection>

      <LegalSection title="5. Duplicate or Erroneous Payments">
        <p>
          The only exception to this no-refund policy is in the case of a genuine technical error — for example, a
          duplicate charge for the same order, or a payment debited without a corresponding order being placed. In such
          cases, please contact us within 7 days of the transaction with proof of payment, and we will investigate and
          coordinate with Razorpay to resolve the issue, which may include a reversal of the erroneous amount.
        </p>
      </LegalSection>

      <LegalSection title="6. Online Payments via Razorpay">
        <p>
          Once online ordering is live, all online payments will be processed through Razorpay, an RBI-regulated
          payment gateway. Any payment-processing issues (such as a failed transaction where money was debited but the
          order did not go through) are subject to Razorpay's own dispute-resolution process in addition to this policy.
          We will assist you in raising such issues with Razorpay where required.
        </p>
      </LegalSection>

      <LegalSection title="7. Event & Booking Charges">
        <p>
          Where Gazra Cafe table bookings or related charges require advance payment, the same no-refund principle
          applies. If you are unable to honour a booking, please inform us as early as possible so we can make the table
          available to others, though this does not entitle you to a refund of any amount already paid.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to This Policy">
        <p>
          We may revise this Refund Policy from time to time, particularly as we roll out online ordering and payments.
          The "Last updated" date above reflects the most recent revision. We encourage you to review this page
          periodically.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact Us">
        <p>For any questions or concerns about a payment, please contact us before placing your order, or reach out promptly afterwards:</p>
        <ul className="space-y-1">
          <li>Email: <a href={`mailto:${LEGAL_CONTACT.email}`} className="text-primary-600 font-semibold hover:text-primary-700">{LEGAL_CONTACT.email}</a></li>
          <li>Phone: <a href={`tel:${LEGAL_CONTACT.phone.replace(/\s/g, '')}`} className="text-primary-600 font-semibold hover:text-primary-700">{LEGAL_CONTACT.phone}</a></li>
          <li>Address: {PARENT_ORG.addressLines.join(', ')}</li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
};

export default RefundPolicy;
