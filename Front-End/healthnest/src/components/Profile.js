import React from "react";
import { Mail, Phone } from "lucide-react";

export default function DoctorProfile() {
  return (
    <div className="max-w-5xl mx-auto p-8 grid gap-8 bg-gray-50 min-h-screen">
      <div className="bg-white border rounded-2xl shadow-md p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200 shadow-inner">
          <img
            src="/images/dr-smith.jpg"
            alt="Dr. Jane Smith"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-extrabold text-gray-800">Dr. Jane Smith</h2>
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Cardiologist
          </span>
          <p className="text-gray-600">15+ years experience · New York, NY</p>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-blue-700 hover:bg-blue-50 cursor-pointer">
              <Mail className="w-4 h-4" /> Email
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-green-700 hover:bg-green-50 cursor-pointer">
              <Phone className="w-4 h-4" /> Call
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-md p-8 space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">
            Dr. Jane Smith is a board-certified cardiologist with over 15 years of experience in treating
            cardiovascular diseases. Her patient-first approach and dedication to preventive care make her one of the
            most trusted professionals in the field.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Availability</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li>Mon - Fri: 9:00 AM - 5:00 PM</li>
            <li>Saturday: 10:00 AM - 2:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Patient Reviews</h3>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li>
              <p><strong>John D.</strong>: "Very professional and kind. Explained everything clearly."</p>
            </li>
            <li>
              <p><strong>Maria R.</strong>: "Helped me manage my heart condition effectively. Highly recommend."</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
