import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";
import { Shield, Clock, Users, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Your data is protected with enterprise-grade security standards."
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Get your claims processed quickly with our streamlined system."
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Our experienced team is here to help you every step of the way."
    },
    {
      icon: CheckCircle,
      title: "Transparent Process",
      description: "Track your claim status in real-time with complete transparency."
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Make Insurance Claims
              <span className="block text-accent"> Simple & Fast</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              Experience hassle-free claim processing with our transparent, 
              efficient, and customer-focused approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get Quote
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose EasyClaims?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've reimagined the insurance claim process to be more 
              user-friendly, efficient, and transparent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust EasyClaims 
            for their insurance needs.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Contact Us Today
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;