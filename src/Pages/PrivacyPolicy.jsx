import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  MessageSquare,
  Database,
  Globe,
  Bot,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

/* =========================================================
   LEGAL PAGE LAYOUT COMPONENT
   ========================================================= */
const LegalLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 xl:py-24">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              ThreadOS AI
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              Customer Experience Platform
            </p>
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 max-w-2xl mx-auto text-sm leading-6 text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">
          <span>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>Version 1.0</span>
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        {children}
      </article>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ThreadOS AI. All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-[10px] font-medium text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
            >
              Seller Login
            </Link>
            <Link
              to="/signup"
              className="text-[10px] font-medium text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
            >
              Create Account
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  </div>
);

/* =========================================================
   SECTION COMPONENT
   ========================================================= */
const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="mb-12 animate-slideUp">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
        <Icon size={18} className="text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h3>
    </div>
    <div className="ml-12 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
      {children}
    </div>
  </section>
);

/* =========================================================
   PARAGRAPH & LIST HELPERS
   ========================================================= */
const P = ({ children, className = "" }) => (
  <p className={className}>{children}</p>
);

const Strong = ({ children }) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>;

const Ul = ({ children }) => (
  <ul className="space-y-2 list-disc list-inside">{children}</ul>
);

const Li = ({ children }) => <li className="leading-7">{children}</li>;

const HighlightBox = ({ type = "info", children }) => {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
    warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
    important: "border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
  };
  const icons = {
    info: <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />,
    warning: <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />,
    important: <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />,
  };
  return (
    <div className={`mb-4 rounded-xl border p-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="text-sm leading-6">{children}</div>
      </div>
    </div>
  );
};

const DataTable = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={`border-b border-slate-200 dark:border-slate-800 ${ri % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50 dark:bg-slate-900/50"}`}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-4 py-3 text-slate-600 dark:text-slate-300">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* =========================================================
   PRIVACY POLICY PAGE
   ========================================================= */
const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How ThreadOS AI collects, uses, and protects your information when you use our AI customer-service platform."
    >
      {/* Introduction */}
      <Section id="introduction" title="Introduction" icon={Shield}>
        <P>
          ThreadOS AI ("we," "our," or "us") operates the ThreadOS AI Customer Experience Platform
          (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our Service as a seller (business user) or interact with
          our platform as a customer (end user).
        </P>
        <P>
          We are committed to protecting your privacy and complying with applicable data protection
          laws, including GDPR, CCPA, and other regional regulations. By using the Service, you
          agree to the collection and use of information in accordance with this policy.
        </P>
        <HighlightBox type="important">
          <Strong>Data Controller:</Strong> ThreadOS AI acts as a data controller for seller account
          data and a data processor for customer conversation data on behalf of our sellers.
          Sellers are data controllers for their customers' personal data.
        </HighlightBox>
      </Section>

      {/* Information We Collect */}
      <Section id="information-collected" title="Information We Collect" icon={Database}>
        <P>
          We collect different categories of information depending on your role:
        </P>

        <h4 className="font-semibold text-slate-900 dark:text-white">1. Seller Account Information</h4>
        <Ul>
          <Li><Strong>Identity Data:</Strong> Name, email address, phone number, business name, business category</Li>
          <Li><Strong>Authentication Data:</Strong> Hashed passwords, session tokens, 2FA secrets, device fingerprints</Li>
          <Li><Strong>Business Data:</Strong> Business address, currency, timezone, language preferences, branding</Li>
          <Li><Strong>Billing Data:</Strong> Subscription tier, payment method (processed by Stripe), invoice history</Li>
        </Ul>

        <h4 className="font-semibold text-slate-900 dark:text-white">2. Customer Conversation Data</h4>
        <Ul>
          <Li><Strong>Messages:</Strong> Text, images, documents, audio, location, contacts shared via chat</Li>
          <Li><Strong>Metadata:</Strong> Timestamps, channel (WhatsApp, Instagram, Website, Telegram), message IDs</Li>
          <Li><Strong>Profile Data:</Strong> Phone numbers, names, profile pictures from messaging platforms</Li>
          <Li><Strong>Conversation Context:</Strong> Order history, product interests, conversation summaries</Li>
        </Ul>

        <h4 className="font-semibold text-slate-900 dark:text-white">3. Product & Business Data</h4>
        <Ul>
          <Li><Strong>Catalog:</Strong> Product names, descriptions, prices, images, stock levels, categories, variants</Li>
          <Li><Strong>Orders:</Strong> Order details, customer info, payment status, fulfillment status</Li>
          <Li><Strong>Knowledge Base:</Strong> FAQs, policies (delivery, returns, payments), business information</Li>
        </Ul>

        <h4 className="font-semibold text-slate-900 dark:text-white">4. Technical & Usage Data</h4>
        <Ul>
          <Li><Strong>Log Data:</Strong> IP addresses, browser/device info, access times, API requests, errors</Li>
          <Li><Strong>Analytics:</Strong> Feature usage, conversation volumes, response times, AI confidence scores</Li>
          <Li><Strong>Security Events:</Strong> Login attempts, device changes, failed authentications, 2FA events</Li>
        </Ul>
      </Section>

      {/* How We Use Information */}
      <Section id="how-we-use" title="How We Use Your Information" icon={MessageSquare}>
        <P>
          We process personal data for the following purposes, relying on legitimate interest,
          contractual necessity, and consent where required:
        </P>

        <DataTable
          headers={["Purpose", "Legal Basis", "Data Categories"]}
          rows={[
            ["Provide the Service (inbox, products, orders)", "Contract", "Account, Conversations, Products, Orders"],
            ["AI-powered responses & recommendations", "Legitimate Interest", "Conversations, Products, Knowledge Base"],
            ["WhatsApp/Telegram/Instagram integration", "Contract", "Messages, Profile Data, Channel Metadata"],
            ["Seller authentication & security", "Legitimate Interest", "Auth Data, Device Info, Security Events"],
            ["Analytics & product improvement", "Legitimate Interest", "Usage Data, Analytics, Conversation Metrics"],
            ["Customer support & communications", "Legitimate Interest", "Account, Contact Info, Support Tickets"],
            ["Legal compliance & fraud prevention", "Legal Obligation", "Account, Transactions, Security Events"],
            ["Marketing (with consent)", "Consent", "Email, Name, Business Info"],
          ]}
        />
      </Section>

      {/* AI Processing */}
      <Section id="ai-processing" title="AI Processing & Automated Decision-Making" icon={Bot}>
        <P>
          ThreadOS AI uses Google's Gemini models to generate automated responses to customer
          inquiries. This involves:
        </P>
        <Ul>
          <Li><Strong>Input:</Strong> Customer message + conversation history (last 6 messages) + seller's product catalog + business info + FAQs</Li>
          <Li><Strong>Processing:</Strong> Real-time inference via Google Generative AI API (v1, not v1beta). No training on your data.</Li>
          <Li><Strong>Output:</Strong> AI-generated response, confidence score, detected intent, suggested actions</Li>
          <Li><Strong>Human Handoff:</Strong> Low-confidence or sensitive topics trigger handoff to human agents</Li>
        </Ul>
        <HighlightBox type="info">
          <Strong>No Training on Your Data:</Strong> We do not use your conversations, products, or business
          data to train or fine-tune AI models. All inference is stateless — Google's API does not
          retain your inputs for model improvement.
        </HighlightBox>
        <P>
          Sellers can disable AI auto-replies, adjust confidence thresholds, and configure handoff
          rules in Settings → AI. Customers can request human assistance at any time.
        </P>
      </Section>

      {/* Third-Party Services */}
      <Section id="third-party" title="Third-Party Services & Integrations" icon={Globe}>
        <P>
          We integrate with the following third-party services. Each has its own privacy policy;
          we encourage you to review them:
        </P>

        <DataTable
          headers={["Service", "Purpose", "Data Shared", "Region"]}
          rows={[
            ["Google Cloud (Firebase)", "Auth, Database (Firestore), Hosting", "Account data, Conversations, Products, Orders", "Global (multi-region)"],
            ["Google Generative AI (Gemini)", "AI Response Generation", "Message text, Product catalog, Business info", "US / EU (configurable)"],
            ["Meta (WhatsApp Business API)", "WhatsApp Messaging", "Phone numbers, Messages, Media, Profile names", "Global"],
            ["WAGate.app", "WhatsApp Gateway (alt.)", "API key, Messages, Phone numbers", "Global"],
            ["Telegram Bot API", "Telegram Messaging", "Chat IDs, Messages, User profiles", "Global"],
            ["Stripe", "Billing & Subscriptions", "Payment method, Billing email, Invoice data", "Global"],
            ["Sentry (optional)", "Error Monitoring", "Error traces, Context (no PII)", "US / EU"],
          ]}
        />
        <HighlightBox type="warning">
          <Strong>International Transfers:</Strong> Some subprocessors operate outside the EEA/UK.
          We rely on Standard Contractual Clauses (SCCs) and adequacy decisions for lawful transfers.
          Contact us for our Data Processing Addendum (DPA) and subprocessor list.
        </HighlightBox>
      </Section>

      {/* Data Retention */}
      <Section id="retention" title="Data Retention" icon={Clock}>
        <DataTable
          headers={["Data Category", "Retention Period", "Deletion Trigger"]}
          rows={[
            ["Seller Account Data", "Active + 3 years", "Account deletion request"],
            ["Customer Conversations", "Active + 2 years", "Seller deletes conversation / customer requests erasure"],
            ["Product & Order Data", "Active + 7 years", "Seller deletes / legal requirement"],
            ["Analytics & Logs", "13 months", "Automatic rolling deletion"],
            ["Security Events", "2 years", "Automatic rolling deletion"],
            ["AI Inference Logs", "30 days", "Automatic rolling deletion"],
            ["Backups", "90 days", "Automatic rolling deletion"],
          ]}
        />
        <P>
          "Active" means the seller account is not deleted and the conversation/order is not manually
          removed. Sellers can delete conversations, products, and orders from their dashboard at
          any time. Customers can request data deletion by contacting the seller directly.
        </P>
      </Section>

      {/* Data Subject Rights */}
      <Section id="rights" title="Your Rights" icon={Shield}>
        <P>
          Depending on your jurisdiction, you may have the following rights:
        </P>
        <Ul>
          <Li><Strong>Access:</Strong> Request a copy of your personal data</Li>
          <Li><Strong>Rectification:</Strong> Correct inaccurate or incomplete data</Li>
          <Li><Strong>Erasure:</Strong> Request deletion ("right to be forgotten")</Li>
          <Li><Strong>Restriction:</Strong> Limit processing of your data</Li>
          <Li><Strong>Portability:</Strong> Receive your data in a structured, machine-readable format</Li>
          <Li><Strong>Objection:</Strong> Object to processing based on legitimate interest</Li>
          <Li><Strong>Withdraw Consent:</Strong> Where processing is based on consent</Li>
          <Li><Strong>Complaint:</Strong> Lodge a complaint with a supervisory authority</Li>
        </Ul>
        <P>
          <Strong>Sellers:</Strong> Exercise rights via Settings → Account or email privacy@threados.ai.
          <br />
          <Strong>Customers:</Strong> Contact the seller (business) directly — they are the data
          controller for your conversation data. Sellers can export/delete customer data from their
          dashboard.
        </P>
      </Section>

      {/* Security */}
      <Section id="security" title="Security Measures" icon={Lock}>
        <Ul>
          <Li><Strong>Encryption in Transit:</Strong> TLS 1.2+ for all API and web traffic</Li>
          <Li><Strong>Encryption at Rest:</Strong> AES-256 for Firestore, Firebase Auth, backups</Li>
          <Li><Strong>Authentication:</Strong> Firebase Auth with email/password, optional 2FA (TOTP), session management with rotation</Li>
          <Li><Strong>API Security:</Strong> Firebase ID tokens on all authenticated endpoints; HMAC-SHA256 webhook verification for Meta/Telegram</Li>
          <Li><Strong>Access Control:</Strong> Role-based permissions (Owner, Manager, Agent), seller-isolated data</Li>
          <Li><Strong>Monitoring:</Strong> Login alerts for new devices, audit logs, rate limiting</Li>
          <Li><Strong>Infrastructure:</Strong> Google Cloud / Firebase — SOC 2, ISO 27001, GDPR compliant</Li>
        </Ul>
        <HighlightBox type="info">
          While we implement strong safeguards, no internet transmission or electronic storage is
          100% secure. We cannot guarantee absolute security.
        </HighlightBox>
      </Section>

      {/* Children's Privacy */}
      <Section id="children" title="Children's Privacy" icon={AlertTriangle}>
        <P>
          The Service is not directed to individuals under 16 (or the applicable digital consent
          age in your jurisdiction). We do not knowingly collect personal data from children. If
          you believe a child has provided us with personal data, contact us and we will delete it.
        </P>
      </Section>

      {/* Changes to Policy */}
      <Section id="changes" title="Changes to This Policy" icon={AlertTriangle}>
        <P>
          We may update this Privacy Policy from time to time. Material changes will be communicated
          via email (for sellers) and/or a prominent notice in the dashboard. The "Last updated"
          date at the top of this page reflects the latest revision.
        </P>
        <P>
          Continued use of the Service after changes constitutes acceptance of the revised policy.
        </P>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact Us" icon={Mail}>
        <P>
          For privacy inquiries, data subject requests, or to obtain our Data Processing Addendum:
        </P>
        <Ul>
          <Li><Strong>Email:</Strong> privacy@threados.ai</Li>
          <Li><Strong>Postal:</Strong> ThreadOS AI, [Company Address], [City, Country]</Li>
          <Li><Strong>DPA Request:</Strong> dpa@threados.ai</Li>
        </Ul>
        <P>
          We respond to all legitimate requests within 30 days (or as required by applicable law).
        </P>
      </Section>

      {/* Quick Links for Navigation */}
      <nav className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-label="Quick navigation">
        <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Quick Navigation</h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { id: "introduction", label: "Introduction" },
            { id: "information-collected", label: "Data We Collect" },
            { id: "how-we-use", label: "How We Use Data" },
            { id: "ai-processing", label: "AI Processing" },
            { id: "third-party", label: "Third Parties" },
            { id: "retention", label: "Retention" },
            { id: "rights", label: "Your Rights" },
            { id: "security", label: "Security" },
            { id: "contact", label: "Contact Us" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </LegalLayout>
  );
};

export default PrivacyPolicy;