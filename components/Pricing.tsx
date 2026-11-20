'use client';

import { wrap } from "@/lib/styles";

const pricingPlans = [
    {
        videos: 1,
        price: "150,000",
        features: [
            "Edited video",
            "3 revisions of scripting",
            "Video editing"
        ]
    },
    {
        videos: 2,
        price: "300,000",
        features: [
            "2 Edited videos",
            "3 revisions of scripting",
            "Video editing"
        ]
    },
    {
        videos: 3,
        price: "500,000",
        features: [
            "3 Edited videos",
            "3 revisions of scripting",
            "Video editing"
        ]
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="bg-white py-24">
            <div className={wrap}>
                <h2 className="text-center text-[clamp(32px,5vw,72px)] font-extrabold leading-[.95] tracking-tighter">
                    UGC Rate Card
                </h2>
                <p className="mx-auto mb-16 mt-3 max-w-[52ch] text-center text-[19px] leading-normal">
                    Transparent pricing for quality UGC content
                </p>

                <div className="grid gap-8 md:grid-cols-3">
                    {pricingPlans.map((plan, index) => (
                        <div key={index} className="overflow-hidden rounded-[28px] border-2 border-light-red bg-white shadow-xl transition-transform hover:scale-105">
                            <div className="bg-crimson px-8 py-6">
                                <h3 className="text-3xl font-bold text-white">{plan.videos} Video{plan.videos > 1 ? 's' : ''}</h3>
                                <p className="mt-2 text-4xl font-extrabold text-light-red">₦{plan.price}</p>
                            </div>

                            <div className="px-8 py-8">
                                <h4 className="mb-4 text-lg font-semibold text-crimson">What&apos;s included:</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <svg className="mt-1 size-5 shrink-0 text-vivid-pink" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="#contact"
                                    className="mt-8 block w-full rounded-full bg-crimson py-4 text-center font-semibold text-white transition hover:bg-vivid-pink"
                                >
                                    Get Started
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
