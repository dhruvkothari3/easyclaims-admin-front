import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";

const ContactPage = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+91-1800-CLAIMS",
      action: "tel:+91-1800-CLAIMS",
      available: "24/7 Available"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Quick support via WhatsApp",
      contact: "+91-98765-43210",
      action: "https://wa.me/919876543210",
      available: "9 AM - 9 PM"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your queries via email",
      contact: "support@easyclaims.in",
      action: "mailto:support@easyclaims.in",
      available: "24 Hours Response"
    }
  ];

  const offices = [
    {
      city: "Mumbai",
      address: "123 Business Park, Andheri East, Mumbai - 400069",
      phone: "+91-22-4567-8900"
    },
    {
      city: "Delhi",
      address: "456 Corporate Hub, Connaught Place, New Delhi - 110001", 
      phone: "+91-11-4567-8900"
    },
    {
      city: "Bangalore",
      address: "789 Tech Plaza, Electronic City, Bangalore - 560100",
      phone: "+91-80-4567-8900"
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our support team. We're here to help with your 
              insurance claims and questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How Can We Help You?
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose your preferred way to reach us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-all duration-300 group">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <method.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <p className="text-muted-foreground">{method.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a 
                    href={method.action}
                    target={method.action.startsWith('http') ? '_blank' : undefined}
                    rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-block text-primary font-semibold text-lg hover:text-primary/80 transition-colors"
                  >
                    {method.contact}
                  </a>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {method.available}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Offices
            </h2>
            <p className="text-xl text-muted-foreground">
              Visit us at our offices across major cities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {offices.map((office, index) => (
              <Card key={index} className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    {office.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{office.address}</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-primary mr-2" />
                    <a href={`tel:${office.phone}`} className="text-primary hover:text-primary/80 transition-colors">
                      {office.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Emergency Claims Support
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            For urgent claims requiring immediate attention, our emergency support 
            team is available 24/7.
          </p>
          <a 
            href="tel:+91-1800-CLAIMS"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold text-lg rounded-md hover:bg-blue-50 transition-colors"
          >
            <Phone className="h-5 w-5 mr-2" />
            Emergency Hotline: +91-1800-CLAIMS
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;