import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-xl text-brand-black mb-2">Thank you.</p>
        <p className="text-base font-serif text-gray-medium">Check your inbox for confirmation.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-sans font-bold uppercase tracking-wider mb-4">Newsletter</h3>
      <p className="text-lg font-serif text-gray-dark mb-5">
        Get the best stories delivered to your inbox every morning.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-border px-4 py-3 text-base font-sans placeholder:text-gray-medium focus:outline-none focus:border-brand-black transition-colors"
        />
        <button
          type="submit"
          className="w-full bg-brand-red text-white py-3 text-sm font-sans font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
