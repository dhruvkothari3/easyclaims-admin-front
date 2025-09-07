import PublicLayout from "@/components/layout/PublicLayout";

const PrivacyPage = () => {
  return (
    <PublicLayout>
      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <div className="prose prose-gray max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  submit a claim, or contact us for support. This may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Personal identification information (name, email, phone number)</li>
                  <li>Policy and claim information</li>
                  <li>Documentation and evidence related to claims</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Process and manage your insurance claims</li>
                  <li>Communicate with you about your claims and our services</li>
                  <li>Improve our services and customer experience</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>With insurance companies to process your claims</li>
                  <li>With service providers who assist in our operations</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. This includes physical, 
                  electronic, and administrative safeguards.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-muted/30 p-6 rounded-lg mt-4">
                  <p className="text-foreground font-semibold mb-2">EasyClaims Privacy Team</p>
                  <p className="text-muted-foreground">Email: privacy@easyclaims.in</p>
                  <p className="text-muted-foreground">Phone: +91-1800-CLAIMS</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any material 
                  changes by posting the new policy on our website and updating the effective date.
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

export default PrivacyPage;