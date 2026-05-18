import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VeloRent collects, uses, and protects your personal information.",
};

const lastUpdated = "January 15, 2026";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information you provide directly",
        text: "When you create an account, make a booking, or contact us, we collect: your name, email address, phone number, payment information (processed securely by Stripe — we never store card numbers), driver's license details, and any communications you send us.",
      },
      {
        subtitle: "Information collected automatically",
        text: "When you use our platform, we automatically collect: IP address, browser type and version, pages visited and time spent, referring URLs, device information, and cookies and similar tracking technologies.",
      },
      {
        subtitle: "Information from third parties",
        text: "If you sign in with Google, we receive your name, email address, and profile picture from Google. We do not receive your Google password.",
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "To provide our services",
        text: "We use your information to process bookings, handle payments, send booking confirmations and receipts, provide customer support, and manage your account.",
      },
      {
        subtitle: "To improve our platform",
        text: "We analyze usage patterns to improve our website, develop new features, and personalize your experience. This analysis is performed on aggregated, anonymized data where possible.",
      },
      {
        subtitle: "To communicate with you",
        text: "We send transactional emails (booking confirmations, receipts, cancellations) and, with your consent, promotional emails about deals and new vehicles. You can unsubscribe from marketing emails at any time.",
      },
      {
        subtitle: "For legal and safety purposes",
        text: "We may use your information to comply with legal obligations, enforce our terms of service, prevent fraud, and protect the safety of our users and staff.",
      },
    ],
  },
  {
    title: "3. How We Share Your Information",
    content: [
      {
        subtitle: "Service providers",
        text: "We share information with trusted third-party service providers who help us operate our platform: Stripe (payment processing), Cloudinary (image storage), Resend (email delivery), Mapbox (location services), and Neon/Supabase (database hosting). These providers are contractually bound to protect your data.",
      },
      {
        subtitle: "We do not sell your data",
        text: "We never sell, rent, or trade your personal information to third parties for their marketing purposes.",
      },
      {
        subtitle: "Legal requirements",
        text: "We may disclose your information if required by law, court order, or government authority, or if we believe disclosure is necessary to protect our rights or the safety of others.",
      },
    ],
  },
  {
    title: "4. Data Retention",
    content: [
      {
        subtitle: "How long we keep your data",
        text: "We retain your account information for as long as your account is active. Booking records are retained for 7 years for legal and accounting purposes. You may request deletion of your account at any time — see Section 6.",
      },
    ],
  },
  {
    title: "5. Cookies",
    content: [
      {
        subtitle: "What cookies we use",
        text: "We use essential cookies (required for the platform to function, such as session cookies for authentication), analytics cookies (to understand how users interact with our platform), and preference cookies (to remember your settings). We do not use advertising or tracking cookies.",
      },
      {
        subtitle: "Managing cookies",
        text: "You can control cookies through your browser settings. Disabling essential cookies will prevent you from logging in and using the platform.",
      },
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      {
        subtitle: "Access and portability",
        text: "You have the right to request a copy of the personal data we hold about you. Contact us at privacy@velorent.com and we'll provide it within 30 days.",
      },
      {
        subtitle: "Correction",
        text: "You can update most of your personal information directly in your Profile settings. For other corrections, contact us.",
      },
      {
        subtitle: "Deletion",
        text: "You can request deletion of your account and associated data by emailing privacy@velorent.com. We'll process your request within 30 days, subject to legal retention requirements.",
      },
      {
        subtitle: "Opt-out of marketing",
        text: "Click 'Unsubscribe' in any marketing email, or update your preferences in your account settings.",
      },
    ],
  },
  {
    title: "7. Security",
    content: [
      {
        subtitle: "How we protect your data",
        text: "We use industry-standard security measures including TLS encryption for data in transit, bcrypt hashing for passwords, and access controls limiting who can access your data. However, no system is 100% secure — please use a strong, unique password for your VeloRent account.",
      },
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      {
        subtitle: "",
        text: "Our platform is not directed at children under 18. We do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with personal information, please contact us immediately.",
      },
    ],
  },
  {
    title: "9. Changes to This Policy",
    content: [
      {
        subtitle: "",
        text: "We may update this Privacy Policy from time to time. We'll notify you of significant changes by email or by displaying a notice on our platform. The 'Last updated' date at the top of this page reflects the most recent revision.",
      },
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      {
        subtitle: "",
        text: "For privacy-related questions or requests, contact our Data Protection team at privacy@velorent.com or write to us at VeloRent, 350 Fifth Avenue, New York, NY 10118.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* Header */}
      <section className="border-b border-[#34699A]/20 bg-[#0E2D4A] py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]">Legal</p>
          <h1 className="font-display text-5xl font-black uppercase text-white">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: {lastUpdated}</p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            At VeloRent, we take your privacy seriously. This policy explains what data we collect,
            why we collect it, and how we protect it.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Quick nav */}
        <div className="mb-12 rounded-2xl border border-[#34699A]/20 bg-[#113F67]/30 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Contents</p>
          <ul className="space-y-1.5">
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
        <div className="space-y-12">
          {sections.map((section) => (
            <section
              key={section.title}
              id={section.title.replace(/\s+/g, "-").toLowerCase()}
            >
              <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-[#34699A]/20">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {item.subtitle && (
                      <h3 className="text-sm font-semibold text-[#FDF5AA] mb-1.5">{item.subtitle}</h3>
                    )}
                    <p className="text-sm leading-relaxed text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-16 flex flex-wrap gap-4 border-t border-[#34699A]/20 pt-8">
          <Link href="/terms" className="text-sm text-[#58A0C8] hover:text-white transition-colors">
            Terms of Service →
          </Link>
          <Link href="/contact" className="text-sm text-[#58A0C8] hover:text-white transition-colors">
            Contact Us →
          </Link>
          <a href="mailto:privacy@velorent.com" className="text-sm text-[#58A0C8] hover:text-white transition-colors">
            privacy@velorent.com →
          </a>
        </div>
      </div>
    </div>
  );
}
