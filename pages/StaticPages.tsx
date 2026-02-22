import React from 'react';

export const SupportPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 max-w-screen-xl">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <span className="text-gray-medium font-semibold uppercase tracking-wider text-xs mb-4 block">Membership</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-brand-black mb-6 leading-tight">Support the Narrative.</h1>
        <p className="text-xl text-gray-dark font-serif leading-relaxed">
          Independent journalism is fragile. It requires resources, time, and freedom from corporate interests. Your contribution ensures we stay true to the story.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
        {[
          { price: 10, label: 'Supporter', desc: 'Keep the lights on.' },
          { price: 25, label: 'Member', desc: 'Fuel deep investigations.' },
          { price: 50, label: 'Patron', desc: 'Shape the future of our platform.' }
        ].map((tier) => (
          <div key={tier.price} className="text-center group cursor-pointer">
            <div className="border border-border py-12 px-6 transition-all group-hover:border-brand-red">
              <span className="block text-4xl font-display mb-4">${tier.price}</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{tier.label}</h3>
              <p className="text-gray-medium font-serif text-base">{tier.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
         <p className="text-gray-medium text-base font-serif mb-5">Or make a one-time contribution</p>
         <button className="bg-brand-red text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors">
            Custom Amount
         </button>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
       <div className="container mx-auto px-6 py-20 max-w-screen-xl">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

             <div className="lg:col-span-5">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-brand-black leading-tight mb-6">
                   We are<br />the new<br />chronicle.
                </h1>
                <div className="w-12 h-0.5 bg-brand-red mb-6"></div>
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-medium">Est. 2023 — Mumbai / New York</p>
             </div>

             <div className="lg:col-span-7 space-y-6">
                <p className="text-xl text-brand-black font-serif italic leading-relaxed">
                   "To understand the world, we must first understand ourselves."
                </p>
                <p className="text-lg font-serif text-gray-dark leading-relaxed">
                   The Good Indian Post was born from a simple observation: the stories of 1.4 billion people—and their global diaspora—were being told through a keyhole. We saw headlines about crisis, poverty, and politics. We rarely saw the texture of daily life, the nuance of cultural shifts, or the quiet triumphs of innovation.
                </p>
                <p className="text-lg font-serif text-gray-dark leading-relaxed">
                   We are an independent collective of writers, photographers, and thinkers. We believe in <strong className="text-brand-black">Slow Journalism</strong>. We believe that a story is not finished when the deadline hits, but when the truth is revealed.
                </p>
                <p className="text-lg font-serif text-gray-dark leading-relaxed">
                   Our editorial vision is decentralized. We don't just report from the capital; we report from the handloom villages of Bengal, the tech parks of Bangalore, the kitchens of Southall, and the art galleries of Berlin.
                </p>
             </div>

          </div>

          <div className="mt-20 pt-12">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                   <h4 className="font-semibold uppercase tracking-wider text-sm text-gray-medium mb-4">Masthead</h4>
                </div>
                <div>
                   <span className="block font-display text-lg mb-1">Riya Singh</span>
                   <span className="text-sm text-gray-medium font-sans uppercase tracking-wider">Editor-in-Chief</span>
                </div>
                <div>
                   <span className="block font-display text-lg mb-1">David Chen</span>
                   <span className="text-sm text-gray-medium font-sans uppercase tracking-wider">Creative Director</span>
                </div>
                <div>
                   <span className="block font-display text-lg mb-1">Arjun Reddy</span>
                   <span className="text-sm text-gray-medium font-sans uppercase tracking-wider">Technology Lead</span>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 max-w-screen-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

         <div className="lg:col-span-5">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-brand-black mb-6 leading-tight">Get in Touch.</h1>
            <p className="text-xl font-serif text-gray-dark leading-relaxed mb-8">
               Have a story pitch, a partnership inquiry, or feedback on our coverage? We read every email.
            </p>
            <div className="space-y-5 font-serif text-lg">
               <p><span className="font-semibold text-brand-black text-sm uppercase tracking-wider block mb-1">General</span> hello@goodindianpost.com</p>
               <p><span className="font-semibold text-brand-black text-sm uppercase tracking-wider block mb-1">Editorial</span> pitches@goodindianpost.com</p>
            </div>
         </div>

         <div className="lg:col-span-7">
            <form className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                     <label className="block text-sm font-semibold uppercase tracking-wider text-gray-medium mb-2 group-focus-within:text-brand-black transition-colors">Name</label>
                     <input type="text" className="w-full border border-border px-4 py-3.5 font-serif text-lg focus:outline-none focus:border-brand-black transition-colors" placeholder="Jane Doe" />
                  </div>
                  <div className="group">
                     <label className="block text-sm font-semibold uppercase tracking-wider text-gray-medium mb-2 group-focus-within:text-brand-black transition-colors">Email</label>
                     <input type="email" className="w-full border border-border px-4 py-3.5 font-serif text-lg focus:outline-none focus:border-brand-black transition-colors" placeholder="jane@example.com" />
                  </div>
               </div>

               <div className="group">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-medium mb-2 group-focus-within:text-brand-black transition-colors">Subject</label>
                  <select className="w-full border border-border px-4 py-3.5 font-serif text-lg focus:outline-none focus:border-brand-black transition-colors appearance-none rounded-none bg-white">
                     <option>I have a story to tell</option>
                     <option>I want to advertise</option>
                     <option>Correction / Feedback</option>
                  </select>
               </div>

               <div className="group">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-medium mb-2 group-focus-within:text-brand-black transition-colors">Message</label>
                  <textarea className="w-full border border-border px-4 py-3.5 font-serif text-lg focus:outline-none focus:border-brand-black transition-colors min-h-[150px] resize-none" placeholder="Start typing..."></textarea>
               </div>

               <div className="flex justify-end">
                  <button className="bg-brand-red text-white px-10 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors">
                     Send Message
                  </button>
               </div>
            </form>
         </div>

      </div>
    </div>
  );
};
