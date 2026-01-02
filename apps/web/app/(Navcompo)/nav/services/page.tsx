import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link';
import Image from 'next/image';


const decorImages = [
    '/Decor4.jpg',
    '/decor2.WEBP',
    '/decor3.WEBP',

];

const Services = () => {
    return (
        <>
            <div className=" text-gray-800 overflow-hidden mt-16 bg-slate-00">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-black mb-2">Ou<span className='text-orange-500'>r Serv</span><span className='text-black'>ices</span> </h1>
                        <p className="text-lg text-gray-800">
                            Tailored experiences, unforgettable celebrations.
                        </p>
                    </div>

                    {/* Services Sectin */}
                    <div className="space-y-16">
                        <div className="relative">
                            <div className="absolute w-[95%] h-[60%] top-16 left-14 bg-orange-200 opacity-50 rounded-full blur-[100px] z-[-1]"></div>
                            {/* Catering */}
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="md:w-1/2">
                                    <h2 className="text-2xl font-semibold text-orange-600 mb-2">🍽 Premium Catering</h2>
                                    <p className="text-gray-700  text-[17px] font-medium leading-relaxed">
                                        Culinary excellence crafted for your guests. From lavish buffets to plated fine dining,
                                        our catering service blends taste and presentation to leave a lasting impression.
                                    </p>
                                </div>
                                <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-md">
                                    <Image src="/cat1.jpg" alt="Catering" className="object-cover" fill />
                                </div>                            </div>

                            <div className="flex flex-col-reverse md:flex-row mt-7 gap-8 items-start">
                                <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-md">
                                    <Image src="/decor1.jpg" alt="Decor" className="object-cover" fill />
                                </div>                                <div className="md:w-1/2">
                                    <h2 className="text-2xl font-semibold text-orange-600 mb-2">🎉 Thematic Decor</h2>
                                    <p className="text-gray-700 text-[17px] font-medium leading-relaxed">
                                        We specialize in custom decor setups—whether it's royal, rustic, modern, or minimalist.
                                        Our decorators ensure your venue is a visual delight that reflects your vision.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8  mt-7 items-start">
                                <div className="md:w-1/2">
                                    <h2 className="text-2xl font-semibold text-orange-600 mb-2">🕴 Personal Event Manager</h2>
                                    <p className="text-gray-700  text-[17px] font-medium leading-relaxed">
                                        For our premium clients, we assign a dedicated manager who handles every detail—from
                                        schedule tracking to guest experience—ensuring your day runs smoothly without stress.
                                    </p>
                                </div>
                                <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-md">
                                    <Image src="/man.png" alt="Manager" className="object-cover" fill />
                                </div>                            </div>

                            <div className="flex flex-col-reverse md:flex-row  mt-7 gap-8 items-start">
                                <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-md">
                                    <Image src="/marr.jpg" alt="Marriage Planning" className="object-cover" fill />
                                </div>                                <div className="md:w-1/2">
                                    <h2 className="text-2xl font-semibold text-orange-600 mb-2">💍 Expert Wedding Planning</h2>
                                    <p className="text-gray-700  text-[17px] font-medium leading-relaxed">
                                        As certified marriage planners, we cover every aspect—from budgeting to invitations,
                                        logistics, and entertainment. Our goal: to give you a seamless, dream-come-true wedding.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20">

                        <h2 className="text-3xl font-bold text-center   text-orange-600 mb-8">✨ Our Signature Decor Themes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {decorImages.map((src, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition duration-300"
                                >
                                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                                        <Image src={src} alt="f" className="object-cover" fill />
                                    </div>                                </div>
                            ))}
                        </div>




                        <section className="w-full px-2 sm:px-8 md:px-16 md:mt-[100px] py-10">

                            <h2 className="text-4xl font-bold mb-2 sm:text-start text-center">FAQs</h2>
                            <p className="text-gray-600 text-center sm:text-start text-[18px] mb-10">
                                Find answers to common questions about our features and services.
                            </p>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                <AccordionItem value="item-1" className="border-b border-black pb-3">
                                    <AccordionTrigger className="sm:text-lg text-[16px] font-bold justify-between hover:no-underline">
                                        What is included in the Basic Package ?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-700 text-[15px] font-medium mt-2">
                                        - The Basic Package includes access to all core features like 400 setting arragement, basic catering, and 6 hrs rental.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2" className="border-b border-black pb-3">
                                    <AccordionTrigger className="sm:text-lg text-[16px] font-bold justify-between hover:no-underline">
                                        Are there any discounts available ?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-700 text-[15px] font-medium  mt-2">
                                        - Yes, we offer seasonal discounts and special pricing. Subscribe to our newsletter to stay updated!
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3" className="border-b border-black pb-3">
                                    <AccordionTrigger className="sm:text-lg text-[16px] font-bold justify-between hover:no-underline">
                                        Can we do a Customization In decor and catering ?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-700 text-[15px] font-medium  mt-2">
                                        - Absolutely. You can contact with our professionals from contact form
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>

                    </div>


                    <div className="text-center mt-8">
                        <p className="smtext-lg sm:text-[16px] font-medium text-gray-700 mb-7">
                            If you're looking for a negotiable price or customizations, feel free to contact us for a personalized quote!
                        </p>
                        <Link href={"/nav/contact"}
                            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
                        >
                            Get a Customized Quote
                        </Link>
                    </div>

                </div>


            </div>
        </>
    );
};

export default Services;