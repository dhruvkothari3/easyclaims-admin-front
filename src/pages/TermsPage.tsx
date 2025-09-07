import PublicLayout from "@/components/layout/PublicLayout";

const TermsPage = () => {
  return (
    <PublicLayout>
      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <div className="prose prose-gray max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using EasyClaims' services, you accept and agree to be bound by the 
                  terms and provision of this agreement. These terms apply to all users of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Description of Service</h2>
                <p className="text-muted-foreground mb-4">
                  EasyClaims provides insurance claim assistance services including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Claim processing and management</li>
                  <li>Documentation assistance</li>
                  <li>Communication with insurance providers</li>
                  <li>Claim status tracking and updates</li>
                  <li>Customer support and guidance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">User Responsibilities</h2>
                <p className="text-muted-foreground mb-4">As a user of our services, you agree to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Submit genuine claims and documentation</li>
                  <li>Cooperate with our claim processing procedures</li>
                  <li>Notify us of any changes to your information</li>
                  <li>Use our services in accordance with applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Service Limitations</h2>
                <p className="text-muted-foreground mb-4">
                  While we strive to provide excellent service, please note:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>We facilitate claims but do not guarantee approval</li>
                  <li>Final claim decisions rest with insurance providers</li>
                  <li>Processing times may vary based on claim complexity</li>
                  <li>Some services may incur additional fees</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Privacy and Confidentiality</h2>
                <p className="text-muted-foreground">
                  We are committed to protecting your privacy and maintaining the confidentiality of your 
                  information. Please review our Privacy Policy for detailed information about how we 
                  collect, use, and protect your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  EasyClaims shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                  or other intangible losses, resulting from your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your access to our services immediately, without prior 
                  notice or liability, for any reason whatsoever, including without limitation if you 
                  breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be interpreted and governed by the laws of India. Any disputes 
                  shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-muted/30 p-6 rounded-lg mt-4">
                  <p className="text-foreground font-semibold mb-2">EasyClaims Legal Team</p>
                  <p className="text-muted-foreground">Email: legal@easyclaims.in</p>
                  <p className="text-muted-foreground">Phone: +91-1800-CLAIMS</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify or replace these Terms at any time. If a revision is 
                  material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Last updated:</strong> January 1, 2024
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsPage;