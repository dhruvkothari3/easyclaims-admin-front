import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Heart, Award } from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To simplify the insurance claim process and make it accessible to everyone, ensuring fair and timely settlements."
    },
    {
      icon: Heart,
      title: "Our Values", 
      description: "We believe in transparency, integrity, and putting our customers first in everything we do."
    },
    {
      icon: Award,
      title: "Our Commitment",
      description: "Providing exceptional customer service and maintaining the highest standards of professionalism."
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About EasyClaims
            </h1>
            <p className="text-xl text-muted-foreground">
              We're revolutionizing the insurance industry by making claims processing 
              simple, transparent, and customer-centric.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, EasyClaims was born out of frustration with the 
                  traditional insurance claim process. Our founders experienced firsthand 
                  the complexities and delays that customers face when filing claims.
                </p>
                <p>
                  We set out to create a platform that would eliminate these pain points 
                  and provide a seamless experience from claim initiation to settlement. 
                  Today, we serve thousands of customers across India.
                </p>
                <p>
                  Our technology-driven approach combined with human expertise ensures 
                  that every claim is handled with care and processed efficiently.
                </p>
              </div>
            </div>
            <div className="bg-gradient-primary rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">By the Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-accent">50K+</div>
                  <div className="text-blue-100">Claims Processed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">98%</div>
                  <div className="text-blue-100">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">24hrs</div>
                  <div className="text-blue-100">Average Processing Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">100+</div>
                  <div className="text-blue-100">Insurance Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do and shape our commitment to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-soft">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;