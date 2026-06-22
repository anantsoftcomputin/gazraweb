import LegalPageShell, { LegalSection } from '../components/shared/LegalPageShell';
import { OPERATING_ENTITY, PARENT_ORG, LEGAL_CONTACT } from '../constants/legalInfo';

const Terms = () => {
  return (
    <LegalPageShell
      title="Terms &"
      highlight="Conditions"
      description="The rules that govern your use of the Project Gazra website and Gazra Cafe services."
      lastUpdated="22 June 2026"
    >
      <LegalSection title="1. Introduction">
        <p>
          These Terms and Conditions ("Terms") govern your access to and use of the Project Gazra website, including
          Gazra Cafe, Gazra Skill Hub, Gazra Support Fund, Gazra Mitra, events, and any related services (together, the
          "Website"). By accessing or using the Website, you agree to be bound by these Terms. If you do not agree, please
          do not use the Website.
        </p>
      </LegalSection>

      <LegalSection title="2. Who We Are">
        <p>
          Project Gazra is a community initiative run under {PARENT_ORG.name}. Gazra Cafe, the food and beverage outlet
          featured on this Website, is operated and managed on a day-to-day basis by {OPERATING_ENTITY.name},
          {' '}{OPERATING_ENTITY.type}, registered at {OPERATING_ENTITY.addressLines.join(', ')}.
        </p>
        <p>
          {OPERATING_ENTITY.name} is solely responsible for all operational aspects of Gazra Cafe — including food
          preparation, table bookings, in-cafe service, and (once live) online ordering and payments — while Gazra Cafe
          itself remains a part of {PARENT_ORG.name}.
        </p>
      </LegalSection>

      <LegalSection title="3. Use of the Website">
        <p>You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, or restrict, anyone else's use of it. You must not:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Provide false, inaccurate, or misleading information on any form (contact, RSVP, volunteer, booking, or order forms);</li>
          <li>Attempt to gain unauthorized access to any part of the Website or its systems;</li>
          <li>Use the Website to transmit any harmful code, spam, or unlawful content;</li>
          <li>Misuse any contact, booking, or ordering feature for fraudulent purposes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Cafe Bookings & Online Orders">
        <p>
          Gazra Cafe currently accepts table bookings and walk-ins. We are working towards integrating an online ordering
          system powered by Razorpay, which will allow customers to order food and beverages directly through this
          Website and pay online. Once live, all online orders will be subject to these Terms and to Razorpay's own
          terms of service.
        </p>
        <p>
          Menu items, prices, and availability are subject to change without notice. We reserve the right to refuse or
          cancel any booking or order, including in cases of suspected fraud, errors in pricing or availability, or
          circumstances beyond our reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="5. Payments">
        <p>
          Once online ordering is enabled, all payments made through the Website will be processed by Razorpay, a
          third-party, RBI-regulated payment gateway. We do not store your card, UPI, or other payment credentials on
          our servers — these are handled directly and securely by Razorpay in accordance with its own security
          standards and privacy policy.
        </p>
      </LegalSection>

      <LegalSection title="6. Cancellations & Refunds">
        <p>
          Gazra Cafe does not offer refunds on confirmed orders or payments, except where required by applicable law or
          in the limited circumstances described in our{' '}
          <a href="/refund-policy" className="text-primary-600 font-semibold hover:text-primary-700">Refund Policy</a>.
          Please review that policy carefully before placing an order or making a booking.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual Property">
        <p>
          All content on this Website — including text, graphics, logos, images, and the Gazra name and branding — is
          the property of Project Gazra / {PARENT_ORG.shortName} or its licensors, and is protected by applicable
          intellectual property laws. You may not reproduce, distribute, or create derivative works from this content
          without our prior written consent.
        </p>
      </LegalSection>

      <LegalSection title="8. User-Submitted Content">
        <p>
          Where you submit content to us (for example, through contact forms, testimonials, volunteer applications, or
          event RSVPs), you confirm that the information is accurate and that you have the right to share it. We may use
          testimonials and feedback for promotional purposes unless you ask us not to.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of Liability">
        <p>
          The Website and Gazra Cafe services are provided on an "as is" and "as available" basis. To the fullest extent
          permitted by law, neither Project Gazra, {PARENT_ORG.shortName}, nor {OPERATING_ENTITY.name} shall be liable
          for any indirect, incidental, or consequential loss arising from your use of the Website or Gazra Cafe
          services.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing Law & Jurisdiction">
        <p>
          These Terms are governed by the laws of India. Any disputes arising out of or relating to these Terms or your
          use of the Website shall be subject to the exclusive jurisdiction of the courts in Vadodara, Gujarat.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to These Terms">
        <p>
          We may update these Terms from time to time to reflect changes in our services (including the introduction of
          online ordering) or for legal and regulatory reasons. The "Last updated" date at the top of this page reflects
          the most recent revision. Continued use of the Website after changes are posted constitutes acceptance of the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact Us">
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul className="space-y-1">
          <li>Email: <a href={`mailto:${LEGAL_CONTACT.email}`} className="text-primary-600 font-semibold hover:text-primary-700">{LEGAL_CONTACT.email}</a></li>
          <li>Phone: <a href={`tel:${LEGAL_CONTACT.phone.replace(/\s/g, '')}`} className="text-primary-600 font-semibold hover:text-primary-700">{LEGAL_CONTACT.phone}</a></li>
          <li>Address: {PARENT_ORG.addressLines.join(', ')}</li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
};

export default Terms;
