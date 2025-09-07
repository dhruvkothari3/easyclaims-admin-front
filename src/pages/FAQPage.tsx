import PublicLayout from "@/components/layout/PublicLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      id: "claim-time",
      question: "How long does it take to process a claim?",
      answer: "Most claims are processed within 24-48 hours. Complex claims may take up to 7 business days. We keep you updated throughout the process."
    },
    {
      id: "required-docs",
      question: "What documents do I need for a claim?",
      answer: "Required documents vary by claim type but typically include: policy documents, incident report, photos of damage, receipts, and identification. Our team will guide you through the specific requirements."
    },
    {
      id: "claim-status",
      question: "How can I track my claim status?",
      answer: "You can track your claim status by contacting our support team via phone, email, or WhatsApp. We provide regular updates on claim progress."
    },
    {
      id: "rejected-claim",
      question: "What if my claim is rejected?",
      answer: "If your claim is rejected, we provide detailed reasons and guidance on next steps. You have the right to appeal the decision, and we'll help you through the appeals process."
    },
    {
      id: "emergency-claims",
      question: "Do you handle emergency claims?",
      answer: "Yes, we provide 24/7 emergency claim support. For urgent situations, call our emergency hotline for immediate assistance."
    },
    {
      id: "multiple-policies",
      question: "Can I claim from multiple policies?",
      answer: "Yes, if you have multiple applicable policies, we can help coordinate claims across different insurers to maximize your coverage benefits."
    },
    {
      id: "settlement-methods",
      question: "How do I receive my settlement?",
      answer: "Settlements can be processed via bank transfer, check, or direct payment to service providers (for cashless claims). You can choose your preferred method."
    },
    {
      id: "service-charges",
      question: "Are there any service charges?",
      answer: "Our basic claim assistance services are free. We may charge a nominal fee for premium services like expedited processing or additional documentation support."
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our claim services and processes.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="bg-card rounded-lg border px-6 shadow-soft">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Our support team is here to help. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+91-1800-CLAIMS" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-blue-50 transition-colors"
            >
              Call Support
            </a>
            <a 
              href="mailto:support@easyclaims.in"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default FAQPage;