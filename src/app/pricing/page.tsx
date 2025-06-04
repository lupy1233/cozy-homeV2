import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description:
      "Perfect for small apartments and first-time smart home owners.",
    price: "$9.99",
    features: [
      "Basic home automation",
      "Up to 5 devices",
      "Mobile app access",
      "Email support",
      "Basic energy monitoring",
    ],
  },
  {
    name: "Professional",
    description: "Ideal for medium-sized homes with multiple smart devices.",
    price: "$19.99",
    features: [
      "Advanced home automation",
      "Up to 20 devices",
      "Mobile app access",
      "Priority support",
      "Advanced energy monitoring",
      "Voice control integration",
      "Custom automation rules",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large homes and businesses requiring maximum control.",
    price: "$29.99",
    features: [
      "Complete home automation",
      "Unlimited devices",
      "Mobile app access",
      "24/7 premium support",
      "Advanced energy monitoring",
      "Voice control integration",
      "Custom automation rules",
      "API access",
      "Multi-user management",
      "Advanced security features",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your home automation needs. All plans
            include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-lg border ${
                  plan.popular ? "border-primary shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Can I change plans later?
              </h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">
                What happens after the trial?
              </h3>
              <p className="text-muted-foreground">
                After your 14-day trial, you'll be automatically enrolled in the
                plan you selected. You can cancel anytime before the trial ends.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Do you offer refunds?
              </h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee if you're not satisfied
                with our service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for
                business accounts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
