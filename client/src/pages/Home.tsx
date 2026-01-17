import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Bridgia Website - Institutional Minimalism Design
 * 
 * Design Philosophy:
 * - Serif headlines (Crimson Text) paired with sans-serif body (Poppins)
 * - Asymmetric layout with generous white space
 * - Color palette: Purple (#774f9f), Lavender (#d1cbe5), Teal (#77b5b6)
 * - Smooth, purposeful interactions without flashiness
 * - Content-first approach for executive audience
 */

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitContactMutation = trpc.contact.submit.useMutation();

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactMutation.mutateAsync({
        name: contactForm.name,
        email: contactForm.email,
        company: contactForm.company,
        message: contactForm.message,
      });

      toast.success("Message sent successfully. We will be in touch soon.");
      setContactForm({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error("Contact submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#e8e3f0]">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center">
            <img src="/bridgia-logo.png" alt="Bridgia" className="h-12 w-auto" />
          </a>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#what-we-do" className="text-[#1a1a1a] hover:text-[#774f9f] transition-colors">
              What We Do
            </a>
            <a href="#how-we-help" className="text-[#1a1a1a] hover:text-[#774f9f] transition-colors">
              How We Help
            </a>
            <a href="#who-we-work-with" className="text-[#1a1a1a] hover:text-[#774f9f] transition-colors">
              Who We Work With
            </a>
            <a href="#why-bridgia" className="text-[#1a1a1a] hover:text-[#774f9f] transition-colors">
              Why Bridgia
            </a>
            <a href="#contact" className="text-[#1a1a1a] hover:text-[#774f9f] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-[#e8e3f0]">
        <div className="container">
          <div className="max-w-2xl">
            <div className="accent-line mb-8"></div>
            <h1 className="mb-6" style={{ fontFamily: "'Crimson Text', serif", fontSize: "3.5rem", fontWeight: 600 }}>
              Intelligence Before Execution
            </h1>
            <p className="text-lg text-[#666666] mb-8 leading-relaxed">
              Bridgia helps construction and project-based companies make better decisions about which markets to enter, which projects to pursue, and how to position themselves for success. We focus on quality over volume, strategy over activity.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 text-[#774f9f] hover:text-[#6a4a8a] transition-colors font-medium">
              Start a conversation <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-20 md:py-32 border-b border-[#e8e3f0]">
        <div className="container">
          <div className="mb-16">
            <div className="accent-line mb-6"></div>
            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: "2.5rem", fontWeight: 600 }}>
              What We Do
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Business Intelligence */}
            <div>
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-4">
                Business Intelligence for Market & Project Selection
              </h3>
              <p className="text-[#666666] leading-relaxed">
                We analyze market conditions, project pipelines, and competitive positioning to help you identify opportunities that align with your strengths and strategic vision. Our approach is grounded in data and institutional knowledge, not hunches.
              </p>
            </div>

            {/* Market Focus */}
            <div>
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-4">
                Market Focus & Opportunity Relevance
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Instead of chasing every opportunity, we help you define your focus areas and evaluate project fit against your capabilities, capacity, and strategic objectives. This clarity reduces wasted effort and improves your win rate.
              </p>
            </div>

            {/* Qualification */}
            <div>
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-4">
                Qualification & Readiness Support
              </h3>
              <p className="text-[#666666] leading-relaxed">
                We assess whether your organization is ready for specific opportunities—from technical capacity to financial position to team expertise. This prevents costly mistakes and ensures you pursue projects where you can genuinely succeed.
              </p>
            </div>

            {/* Strategic Partnership */}
            <div>
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-4">
                Strategic Partnership, Not Execution
              </h3>
              <p className="text-[#666666] leading-relaxed">
                We are advisors and strategists, not contractors. We do not bid, execute, or manage projects. Our role is to help you make better decisions before you commit resources, ensuring every bid and every project aligns with your vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section id="how-we-help" className="py-20 md:py-32 border-b border-[#e8e3f0] bg-[#f5f3f8]">
        <div className="container">
          <div className="mb-16">
            <div className="accent-line mb-6"></div>
            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: "2.5rem", fontWeight: 600 }}>
              How We Help
            </h2>
          </div>

          <div className="space-y-12">
            <div className="border-l-4 border-[#774f9f] pl-8">
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-3">
                Reduce Wasted Bidding Effort
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Not every opportunity is worth pursuing. We help you identify which projects warrant investment of your team's time and resources, eliminating low-probability bids that drain capacity without strategic value.
              </p>
            </div>

            <div className="border-l-4 border-[#77b5b6] pl-8">
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-3">
                Improve Project Fit with Company Vision
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Every project should reinforce your strategic direction, build your capabilities, or strengthen your market position. We ensure that growth is intentional and aligned with your long-term vision, not reactive.
              </p>
            </div>

            <div className="border-l-4 border-[#d1cbe5] pl-8">
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-3">
                Support Access to Relevant Decision-Makers
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Proper positioning opens doors. We help you position your organization clearly and credibly so that the right clients and partners see you as a relevant, capable partner. This leads to better opportunities and stronger relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With Section */}
      <section id="who-we-work-with" className="py-20 md:py-32 border-b border-[#e8e3f0]">
        <div className="container">
          <div className="mb-16">
            <div className="accent-line mb-6"></div>
            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: "2.5rem", fontWeight: 600 }}>
              Who We Work With
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-[#f5f3f8] p-8 rounded-lg">
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.25rem", fontWeight: 600 }} className="mb-3 text-[#774f9f]">
                Construction Companies
              </h3>
              <p className="text-[#666666] leading-relaxed">
                General contractors and specialized construction firms seeking clarity on market opportunities and project selection in a competitive landscape.
              </p>
            </div>

            <div className="bg-[#f5f3f8] p-8 rounded-lg">
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.25rem", fontWeight: 600 }} className="mb-3 text-[#774f9f]">
                Engineering & Project-Based Firms
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Engineering consultants, design firms, and project management companies that need strategic guidance on market positioning and opportunity evaluation.
              </p>
            </div>

            <div className="bg-[#f5f3f8] p-8 rounded-lg">
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.25rem", fontWeight: 600 }} className="mb-3 text-[#774f9f]">
                Organizations Seeking Focused Growth
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Companies committed to intentional, sustainable growth in the Saudi market, where strategic focus and proper positioning create competitive advantage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bridgia Section */}
      <section id="why-bridgia" className="py-20 md:py-32 border-b border-[#e8e3f0] bg-[#f5f3f8]">
        <div className="container">
          <div className="mb-16">
            <div className="accent-line mb-6"></div>
            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: "2.5rem", fontWeight: 600 }}>
              Why Bridgia
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-[#774f9f] text-3xl font-bold mb-4">01</div>
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.25rem", fontWeight: 600 }} className="mb-3">
                Focus Over Volume
              </h3>
              <p className="text-[#666666] leading-relaxed">
                We believe that quality growth comes from strategic focus, not activity. We help you say no to the wrong opportunities so you can excel at the right ones.
              </p>
            </div>

            <div>
              <div className="text-[#77b5b6] text-3xl font-bold mb-4">02</div>
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.25rem", fontWeight: 600 }} className="mb-3">
                Intelligence Before Execution
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Better decisions start with better information. We provide the analysis, context, and strategic clarity you need to move forward with confidence.
              </p>
            </div>

            <div>
              <div className="text-[#d1cbe5] text-3xl font-bold mb-4">03</div>
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.25rem", fontWeight: 600 }} className="mb-3">
                Clarity, Structure & Relevance
              </h3>
              <p className="text-[#666666] leading-relaxed">
                We bring structure to complex decisions. Our approach is transparent, grounded in data, and focused on helping you understand your options and their implications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <div className="accent-line mb-6"></div>
              <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: "2.5rem", fontWeight: 600 }} className="mb-8">
                Get in Touch
              </h2>
              <p className="text-[#666666] leading-relaxed mb-12">
                We are here to discuss your challenges, explore opportunities, and explore how Bridgia can support your strategic growth. Reach out directly—we respond promptly.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-[#774f9f] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Email</p>
                    <a href="mailto:bd@bridgia-sa.com" className="text-[#774f9f] hover:text-[#6a4a8a] transition-colors">
                      bd@bridgia-sa.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="text-[#774f9f] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Phone</p>
                    <a href="tel:+966576672060" className="text-[#774f9f] hover:text-[#6a4a8a] transition-colors">
                      +966 57667 2060
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-[#774f9f] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Location</p>
                    <p className="text-[#666666]">Riyadh, Saudi Arabia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#f5f3f8] p-8 rounded-lg">
              <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.5rem", fontWeight: 600 }} className="mb-6">
                Send us a Message
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-[#d1cbe5] rounded-lg bg-white text-[#1a1a1a] focus:outline-none focus:border-[#774f9f] focus:ring-1 focus:ring-[#774f9f] disabled:opacity-50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-[#d1cbe5] rounded-lg bg-white text-[#1a1a1a] focus:outline-none focus:border-[#774f9f] focus:ring-1 focus:ring-[#774f9f] disabled:opacity-50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={contactForm.company}
                    onChange={handleContactChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-[#d1cbe5] rounded-lg bg-white text-[#1a1a1a] focus:outline-none focus:border-[#774f9f] focus:ring-1 focus:ring-[#774f9f] disabled:opacity-50"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full px-4 py-2 border border-[#d1cbe5] rounded-lg bg-white text-[#1a1a1a] focus:outline-none focus:border-[#774f9f] focus:ring-1 focus:ring-[#774f9f] disabled:opacity-50"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#774f9f] text-white py-2 rounded-lg font-medium hover:bg-[#6a4a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e3f0] py-12 bg-[#f5f3f8]">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-[#666666]">
            <div className="flex items-center gap-4">
              <img src="/bridgia-logo.png" alt="Bridgia" className="h-10 w-auto" />
              <div>
                <p>&copy; 2025 Bridgia. All rights reserved.</p>
                <p>Business Intelligence & Advisory | Riyadh, Saudi Arabia</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
