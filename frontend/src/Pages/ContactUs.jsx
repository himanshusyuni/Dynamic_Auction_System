//Contact us:
import React from "react";

const ContactUs = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Contact Us</h1>
            <p className="text-gray-700 text-center">Last updated on Feb 6, 2025</p>

            <div className="mt-6 space-y-4">
                <p><strong>Merchant Legal Entity Name:</strong> Himanshu</p>
                <p><strong>Registered Address:</strong> 1057/A, Mehrauli , New Delhi</p>
                <p><strong>Telephone No:</strong> <a href="tel:8595602610" className="text-blue-600 hover:underline">8595602610</a></p>
                <p><strong>Email:</strong> <a href="mailto:himanshusyuni2601@gmail.com" className="text-blue-600 hover:underline">himanshusyuni2601@gmail.com</a></p>
            </div>
        </div>
    );
};

export default ContactUs;