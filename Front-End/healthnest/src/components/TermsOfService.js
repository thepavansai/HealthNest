import React from 'react';
import Footer from './Footer';
import Header from './Header';
import './TermsOfService.css';
import { BASE_URL } from '../config/apiConfig';

const TermsOfService = () => {
  const currentDate = 'April 15, 2025';

  return (<>
   <Header></Header>
    <div className="terms-container">
      <div className="terms-content">
        <h1 className="terms-title">TERMS OF USE</h1>
        <p className="terms-update">Last updated {currentDate}</p>

        <section className="terms-section">
          <h2 className="section-title">AGREEMENT TO OUR LEGAL TERMS</h2>
          <p>
            We are Health Nest, doing business as HN ("<strong>Company</strong>," "<strong>we</strong>," "<strong>us</strong>," "<strong>our</strong>"), a company registered in India at Madhapur, Hyderabad, Telangana 500089.
          </p>
          <p>
            We operate the website <a href={BASE_URL} className="terms-link">HealthNest</a> (the "<strong>Site</strong>"), as well as any other related products and services that refer or link to these legal terms (the "<strong>Legal Terms</strong>") (collectively, the "<strong>Services</strong>").
          </p>
          <p>
            A platform that is used to generate remedies and precautions based on the user symptoms and a platform to book an appointment for the doctor of your choice
          </p>
          <p>
            You can contact us by phone at 9988667777, email at healthnest@gmail.com, or by mail to Madhapur, Hyderabad, Telangana 500089, India.
          </p>
          <p>
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("<strong>you</strong>"), and Health Nest, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
          <p>
            Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.
          </p>
          <p>
            The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">1. OUR SERVICES</h2>
          <p>
            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">2. INTELLECTUAL PROPERTY RIGHTS</h2>
          
          <h3 className="subsection-title">Our intellectual property</h3>
          <p>
            We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "<strong>Content</strong>"), as well as the trademarks, service marks, and logos contained therein (the "<strong>Marks</strong>").
          </p>
          <p>
            Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.
          </p>
          <p>
            The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.
          </p>
          
          <h3 className="subsection-title">Your use of our Services</h3>
          <p>
            Subject to your compliance with these Legal Terms, including the "<a href="#prohibited-activities" className="terms-link">PROHIBITED ACTIVITIES</a>" section below, we grant you a non-exclusive, non-transferable, revocable license to:
          </p>
          <ul className="terms-list">
            <li>access the Services; and</li>
            <li>download or print a copy of any portion of the Content to which you have properly gained access,</li>
          </ul>
          <p>solely for your personal, non-commercial use or internal business purpose.</p>
        </section>

        {}
        
        <section className="terms-section" id="prohibited-activities">
          <h2 className="section-title">3. PROHIBITED ACTIVITIES</h2>
          <p>
            You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
          <p>As a user of the Services, you agree not to:</p>
          <ul className="terms-list">
            <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
            <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
            <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
            <li>Delete the copyright or other proprietary rights notice from any Content.</li>
            <li>Attempt to impersonate another user or person or use the username of another user.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">4. USER REGISTRATION</h2>
          <p>
            You may be required to register with the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">5. DISCLAIMER</h2>
          <p>
            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">6. LIMITATION OF LIABILITY</h2>
          <p>
            IN NO EVENT WILL WE BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">7. CONTACT US</h2>
          <p>
            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
          </p>
          <address className="contact-info">
            Health Nest<br />
            Madhapur, Hyderabad<br />
            Telangana 500089<br />
            India<br />
            Phone: 9988667777<br />
            Email: healthnest@gmail.com
          </address>
        </section>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default TermsOfService;