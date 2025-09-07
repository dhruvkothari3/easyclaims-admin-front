import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Home, Heart, Briefcase, Plane, Shield } from "lucide-react";

const ServicesPage = () => {
  const services = [
    {
      icon: Car,
      title: "Vehicle Insurance Claims",
      description: "Comprehensive support for motor vehicle insurance claims including accidents, theft, and damage.",
      features: ["24/7 Support", "Quick Assessment", "Direct Settlement", "Towing Service"]
    },
    {
      icon: Home,
      title: "Home Insurance Claims", 
      description: "Complete assistance for property damage, theft, natural disasters, and liability claims.",
      features: ["Property Assessment", "Emergency Services", "Contractor Network", "Fair Settlement"]
    },
    {
      icon: Heart,
      title: "Health Insurance Claims",
      description: "Seamless processing of medical claims with our network of healthcare providers.",
      features: ["Cashless Treatment", "Pre-authorization", "Claim Settlement", "Medical Support"]
    },
    {
      icon: Briefcase,
      title: "Business Insurance Claims",
      description: "Specialized support for commercial insurance claims and business interruption coverage.",
      features: ["Business Continuity", "Asset Protection", "Liability Coverage", "Expert Consultation"]
    },
    {
      icon: Plane,
      title: "Travel Insurance Claims",
      description: "Comprehensive travel insurance claim support for domestic and international travel.",
      features: ["Emergency Assistance", "Medical Coverage", "Trip Cancellation", "Lost Baggage"]
    },
    {
      icon: Shield,
      title: "Life Insurance Claims",
      description: "Compassionate handling of life insurance claims with dedicated support for families.",
      features: ["Compassionate Service", "Quick Processing", "Family Support", "Documentation Help"]
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive insurance claim services across all major categories 
              with expert guidance and support.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Claim Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent steps to get your claim processed efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Report Claim", description: "Contact us via phone, email, or WhatsApp to report your claim." },
              { step: "2", title: "Assessment", description: "Our experts assess the damage and gather necessary documentation." },
              { step: "3", title: "Processing", description: "We process your claim and coordinate with insurance providers." },
              { step: "4", title: "Settlement", description: "Receive your settlement quickly through our streamlined process." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ServicesPage;