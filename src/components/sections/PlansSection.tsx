interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function PlansSection() {
  const plans: Plan[] = [
    {
      name: "Starter",
      price: "$99",
      description: "Perfect for beginners",
      features: [
        "Basic investment tools",
        "Up to 5 active investments",
        "Email support",
        "Monthly reports",
      ],
    },
    {
      name: "Professional",
      price: "$299",
      description: "For serious investors",
      features: [
        "Advanced analytics",
        "Unlimited investments",
        "Priority support",
        "Real-time alerts",
        "Portfolio analysis",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "$599",
      description: "For expert traders",
      features: [
        "AI-powered insights",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom strategies",
        "Advanced reporting",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Investment Plans</h2>
        <p className="text-xl text-slate-400">
          Choose the perfect plan for your investment journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg p-8 transition-transform hover:scale-105 ${
              plan.popular
                ? "bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400"
                : "bg-slate-800 border border-slate-700"
            }`}
          >
            {plan.popular && (
              <div className="mb-4 inline-block bg-blue-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-slate-300 mb-6">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-slate-400">/month</span>
            </div>
            <button
              className={`w-full py-3 rounded-lg font-semibold mb-8 transition-colors ${
                plan.popular
                  ? "bg-white text-blue-600 hover:bg-slate-100"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Get Started
            </button>
            <ul className="space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-slate-200">
                  <svg
                    className="w-5 h-5 mr-3 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

