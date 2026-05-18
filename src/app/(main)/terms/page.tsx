import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "VeloRent's terms and conditions for using our car rental platform.",
};

const lastUpdated = "January 15, 2026";

const sections = [
  {
    title: "1. Acceptance of Terms",
    text: "By accessing or using VeloRent's platform (the 'Service'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these Terms, do not use the Service. These Terms apply to all visitors, users, and renters.",
  },
  {
    title: "2. Eligibility",
    text: "To use our Service you must: (a) be at least 21 years of age (25 for certain vehicle categories); (b) hold a valid driver's license issued at least 12 months prior to rental; (c) have a valid credit or debit card in your name; and (d) not have any major driving convictions in the past 3 years. We reserve the right to refuse service to anyone who does not meet these requirements.",
  },
  {
    title: "3. Account Registration",
    text: "You must create an account to make a booking. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these Terms.",
  },
  {
    title: "4. Bookings and Reservations",
    text: "A booking is confirmed only after full payment is received. Prices displayed are in USD and include applicable taxes. We reserve the right to cancel a booking if we suspect fraudulent activity or if the vehicle becomes unavailable due to circumstances beyond our control. In such cases, a full refund will be issued.",
  },
  {
    title: "5. Cancellation and Refund Policy",
    text: "Cancellations made more than 48 hours before the scheduled pickup time are eligible for a full refund. Cancellations made within 48 hours of pickup are subject to a 50% cancellation fee. No-shows (failure to pick up the vehicle without prior cancellation) are non-refundable. Refunds are processed within 5–10 business days to the original payment method.",
  },
  {
    title: "6. Vehicle Use",
    text: "You agree to: (a) use the vehicle only for lawful purposes; (b) not drive under the influence of alcohol or drugs; (c) not smoke in the vehicle; (d) not transport more passengers than the vehicle's stated capacity; (e) not use the vehicle for racing, off-road driving, or towing; (f) not sublet or lend the vehicle to any person not listed as an authorized driver on the booking; and (g) return the vehicle with a full tank of fuel.",
  },
  {
    title: "7. Driver Requirements",
    text: "All drivers must be listed on the booking at the time of pickup. Additional drivers can be added at no extra cost. All drivers must present a valid driver's license at pickup. International drivers must present both their national license and an International Driving Permit (IDP).",
  },
  {
    title: "8. Insurance and Liability",
    text: "Basic third-party liability insurance is included in all rentals as required by law. You are responsible for any damage to the vehicle not covered by the included insurance. Optional Collision Damage Waiver (CDW) reduces your liability to zero for most damage types. You remain fully liable for damage caused by: driving under the influence, deliberate damage, driving on unauthorized roads, or violation of these Terms.",
  },
  {
    title: "9. Damage and Accidents",
    text: "You must report any accident, theft, or damage to us immediately, regardless of fault. Failure to report may void your insurance coverage. You must not admit liability or make any settlement offers at the scene of an accident. We will conduct a damage assessment at vehicle return. Charges for damage will be applied to the payment method on file.",
  },
  {
    title: "10. Late Returns",
    text: "The vehicle must be returned by the date and time specified in your booking. Late returns are charged at the daily rate pro-rated by the hour. If you need to extend your rental, contact us before the scheduled return time. Extensions are subject to vehicle availability.",
  },
  {
    title: "11. Fuel Policy",
    text: "Vehicles are provided with a full tank of fuel and must be returned full. If the vehicle is returned with less than a full tank, a refueling charge will be applied at a rate higher than the local pump price. We recommend refueling before returning the vehicle.",
  },
  {
    title: "12. Privacy",
    text: "Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.",
  },
  {
    title: "13. Intellectual Property",
    text: "All content on the VeloRent platform — including text, graphics, logos, images, and software — is the property of VeloRent or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
  },
  {
    title: "14. Limitation of Liability",
    text: "To the maximum extent permitted by law, VeloRent shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service or any rental vehicle. Our total liability to you for any claim shall not exceed the amount you paid for the specific rental giving rise to the claim.",
  },
  {
    title: "15. Indemnification",
    text: "You agree to indemnify and hold harmless VeloRent, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.",
  },
  {
    title: "16. Governing Law",
    text: "These Terms are governed by the laws of the State of New York, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of New York County, New York.",
  },
  {
    title: "17. Changes to Terms",
    text: "We reserve the right to modify these Terms at any time. We will notify you of material changes by email or by posting a notice on our platform. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.",
  },
  {
    title: "18. Contact",
    text: "For questions about these Terms, contact us at legal@velorent.com or write to VeloRent Legal, 350 Fifth Avenue, New York, NY 10118.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* Header */}
      <section className="border-b border-[#34699A]/20 bg-[#0E2D4A] py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]">Legal</p>
          <h1 className="font-display text-5xl font-black uppercase text-white">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: {lastUpdated}</p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Please read these Terms carefully before using VeloRent. By using our platform,
            you agree to be bound by these Terms.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Quick nav */}
        <div className="mb-12 rounded-2xl border border-[#34699A]/20 bg-[#113F67]/30 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Contents</p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.title}>
                <a
                  href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="text-sm text-[#58A0C8] hover:text-white transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section
              key={section.title}
              id={section.title.replace(/\s+/g, "-").toLowerCase()}
            >
              <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-[#34699A]/20">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-400">{section.text}</p>
            </section>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-16 flex flex-wrap gap-4 border-t border-[#34699A]/20 pt-8">
          <Link href="/privacy" className="text-sm text-[#58A0C8] hover:text-white transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/contact" className="text-sm text-[#58A0C8] hover:text-white transition-colors">
            Contact Us →
          </Link>
          <a href="mailto:legal@velorent.com" className="text-sm text-[#58A0C8] hover:text-white transition-colors">
            legal@velorent.com →
          </a>
        </div>
      </div>
    </div>
  );
}
