import LegalPageShell, { LegalSection } from '../components/shared/LegalPageShell';
import { OPERATING_ENTITY, PARENT_ORG, LEGAL_CONTACT } from '../constants/legalInfo';

const Privacy = () => {
  return (
    <LegalPageShell
      title="Privacy"
      highlight="Policy"
      description="How Project Gazra and Gazra Cafe collect, use, and protect your information."
      lastUpdated="22 June 2026"
    >
      <LegalSection title="1. Introduction">
        <p>
          This Privacy Policy explains how Project Gazra, {PARENT_ORG.shortName}, and {OPERATING_ENTITY.name}
          {' '}({OPERATING_ENTITY.type} responsible for the day-to-day operations of Gazra Cafe) collect, use, store,
          and protect your personal information when you use this Website or interact with Gazra Cafe.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We collect information that you voluntarily provide to us, including through:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Contact forms, with phone number verification for authenticity;</li>
          <li>Event RSVPs and check-ins (name, email, phone number, and an associated QR code);</li>
          <li>Volunteer and support-request submissions;</li>
          <li>Newsletter sign-ups (email address);</li>
          <li>Gazra Cafe table bookings;</li>
          <li>In the future, online food orders placed through the Website (name, contact details, order details, and delivery/pickup preferences).</li>
        </ul>
        <p>
          If and when online payments go live, payment details (such as card or UPI information) are entered directly
          into Razorpay's secure payment interface and are never collected or stored on our own servers.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Respond to enquiries and process bookings, RSVPs, orders, and volunteer or support requests;</li>
          <li>Send event updates, confirmations, and (where you've opted in) newsletter communications;</li>
          <li>Operate and improve Gazra Cafe and the Website;</li>
          <li>Verify identity for check-ins and prevent fraud or misuse of our forms and booking systems;</li>
          <li>Comply with legal and regulatory obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Cookies & Tracking">
        <p>
          The Website may use cookies or similar local storage technologies to remember preferences, prevent duplicate
          form submissions (such as duplicate event RSVPs), and understand how visitors use the site. You can control
          cookies through your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-Party Services">
        <p>We rely on trusted third-party providers to operate the Website, including:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><span className="font-semibold text-neutral-800">Firebase (Google):</span> for authentication, database storage, and file storage;</li>
          <li><span className="font-semibold text-neutral-800">Razorpay:</span> for secure payment processing, once online ordering is live;</li>
          <li><span className="font-semibold text-neutral-800">Google Maps:</span> for location and directions to Gazra Cafe;</li>
          <li><span className="font-semibold text-neutral-800">Social media platforms</span> (Facebook, Instagram) linked from our Website.</li>
        </ul>
        <p>
          These providers process data under their own privacy policies and security standards. We only share the
          minimum information necessary for them to perform their function.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Sharing & Disclosure">
        <p>
          We do not sell your personal information. We may share information with {OPERATING_ENTITY.name} for the
          purpose of fulfilling cafe bookings and orders, with service providers listed above, or where required by law,
          court order, or to protect the rights and safety of Project Gazra, Gazra Cafe, or our community.
        </p>
      </LegalSection>

      <LegalSection title="7. Data Security">
        <p>
          We take reasonable technical and organizational measures to protect your information, including access
          controls on our database and reliance on established, secure providers (Firebase and Razorpay) for sensitive
          operations. No method of transmission or storage is completely secure, and we cannot guarantee absolute
          security.
        </p>
      </LegalSection>

      <LegalSection title="8. Data Retention">
        <p>
          We retain personal information only for as long as necessary to fulfil the purposes described in this policy,
          or as required by law (for example, financial records related to orders and payments once online ordering is
          live).
        </p>
      </LegalSection>

      <LegalSection title="9. Your Rights">
        <p>
          You may request access to, correction of, or deletion of the personal information we hold about you, and you
          may unsubscribe from our newsletter at any time using the link provided in our emails. To exercise these
          rights, contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection title="10. Children's Privacy">
        <p>
          The Website is not directed at children under 13, and we do not knowingly collect personal information from
          children without parental consent.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time, particularly as we introduce new features such as online
          ordering and payments. The "Last updated" date above reflects the most recent revision.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact Us">
        <p>For any privacy-related questions or requests, please contact:</p>
        <ul className="space-y-1">
          <li>Email: <a href={`mailto:${LEGAL_CONTACT.email}`} className="text-primary-600 font-semibold hover:text-primary-700">{LEGAL_CONTACT.email}</a></li>
          <li>Phone: <a href={`tel:${LEGAL_CONTACT.phone.replace(/\s/g, '')}`} className="text-primary-600 font-semibold hover:text-primary-700">{LEGAL_CONTACT.phone}</a></li>
          <li>Address: {PARENT_ORG.addressLines.join(', ')}</li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
};

export default Privacy;
