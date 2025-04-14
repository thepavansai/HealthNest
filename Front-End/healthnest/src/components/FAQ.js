import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

import './FAQ.css';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItem, setOpenItem] = useState(null);

  const faqData = [
    {
      id: 1,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button on the top right corner of our homepage. Fill in your personal details including name, email, password, gender, date of birth, and phone number. Once submitted, you\'ll receive a verification email to activate your account.'
    },
    {
      id: 2,
      category: 'account',
      question: 'How can I change my password?',
      answer: 'Once logged in, go to your Profile settings. Under the "Security" section, you\'ll find an option to change your password. Enter your current password followed by your new password, confirm it, and save the changes.'
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I edit my profile information?',
      answer: 'After logging in, click on your name or profile icon at the top right corner. Select "Profile" from the dropdown menu. On your profile page, click the "Edit Profile" button to update your personal information.'
    },
    {
      id: 4,
      category: 'services',
      question: 'What is the Health Check service?',
      answer: 'Health Check is our symptom analysis tool that provides preliminary guidance based on the symptoms you describe. Simply enter your symptoms in detail, and our system will suggest possible remedies and precautions. Note that this should not replace professional medical advice.'
    },
    {
      id: 5,
      category: 'services',
      question: 'How accurate is the symptom checker?',
      answer: 'Our symptom checker uses advanced algorithms to match your symptoms with common health conditions. While it can provide helpful guidance, it\'s designed as a preliminary tool and not a definitive diagnosis. Always consult with a healthcare professional for proper evaluation and treatment.'
    },
    {
      id: 6,
      category: 'appointments',
      question: 'How do I book an appointment with a doctor?',
      answer: 'To book an appointment, first describe your health issue in the appointment form. Our system will suggest appropriate specialists based on your condition. You can then choose your preferred doctor, select an available time slot, and confirm your appointment by completing the payment process.'
    },
    {
      id: 7,
      category: 'appointments',
      question: 'Can I reschedule or cancel my appointment?',
      answer: 'Yes, you can reschedule or cancel appointments through your dashboard. Go to "My Appointments" and select the appointment you wish to modify. For cancellations, please note our cancellation policy - appointments cancelled less than 24 hours before the scheduled time may incur a fee.'
    },
    {
      id: 8,
      category: 'appointments',
      question: 'How far in advance can I book an appointment?',
      answer: 'You can book appointments up to one day in advance. Our system doesn\'t allow booking further ahead to ensure timely medical attention and efficient scheduling for both patients and doctors.'
    },
    {
      id: 9,
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept multiple payment methods including credit/debit cards, UPI, and net banking. All transactions are secure and encrypted to protect your financial information.'
    },
    {
      id: 10,
      category: 'payment',
      question: 'Are there any refund policies?',
      answer: 'If your appointment is rejected by the doctor or if you cancel more than 24 hours before the scheduled time, you\'ll receive a full refund. Cancellations within 24 hours may be subject to a partial refund or rescheduling options.'
    }
  ];

  // Handle click on FAQ item
  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  // Handle category change
  const changeCategory = (category) => {
    setActiveCategory(category);
  };

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Categories for the filter buttons
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'account', name: 'Account' },
    { id: 'services', name: 'Services' },
    { id: 'appointments', name: 'Appointments' },
    { id: 'payment', name: 'Payment' }
  ];

  return (<>
  <Header></Header>
    <div className="faq-container health-theme">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to the most common questions about Health Nest services</p>
      </div>
      
      <div className="faq-search-container">
        <input 
          type="text" 
          id="faq-search" 
          placeholder="Search for questions..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="faq-categories">
        {categories.map(category => (
          <button 
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => changeCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="faq-list">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map(faq => (
            <div 
              key={faq.id} 
              className={`faq-item ${openItem === faq.id ? 'active' : ''}`}
              data-category={faq.category}
            >
              <div 
                className="faq-question"
                onClick={() => toggleItem(faq.id)}
              >
                {faq.question}
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No matching questions found. Try a different search term.</div>
        )}
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default FAQ;




