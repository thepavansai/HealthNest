import Footer from "../components/Footer";
import HealthCheck from "../components/HealthCheck"
import Header from "../components/Header"
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import './Home.css';
import DoctorCarousel from "../components/DoctorCarousel";
import { getHealthTips } from "../services/getHealthTips";
import { getStatistics } from "../services/getStatistics";
import ContentCarousel from "../components/ContentCarousel";
import HappyPatients from "../components/HappyPatients";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  const [statistics, setStatistics] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0
});
  const [healthTips, setHealthTips] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const names = ["Health Checkup", "View Appointments", "Join Our Team"];
    const description = [
      "Consult a specialist based on your condition.",
      "View and manage your upcoming appointments.",
      "If you're a doctor interested in joining us"
    ];
    useEffect(() => {
      fetchHealthTips();
      fetchStatistics();
  }, []);

  const fetchHealthTips = async (customHeight = '', customWeight = '') => {
      try {
        setLoading(true);
          const tips = await getHealthTips(customHeight || height, customWeight || weight);
          setHealthTips(tips);
          setError(null);
      } catch (err) {
          setError('Failed to fetch health tips. Please try again.');
         
      } finally {
          setLoading(false);
      }
  };

  const fetchStatistics = async () => {
    try {
        setLoadingStats(true);
        const stats = await getStatistics();
        setStatistics({
            doctors: stats.doctorCount || 0,
            patients: stats.patientCount || 0,
            appointments: stats.appointmentCount || 0
        });
    } catch (err) {
        console.error('Error fetching statistics:', err);
        
        setStatistics({
            doctors: 100,
            patients: 5000,
            appointments: 10000
        });
    } finally {
        setLoadingStats(false);
    }
};

  const statisticsData = [
    { number: `${statistics.doctors}+`, label: "Doctors" },
    { number: `${statistics.patients}+`, label: "Patients" },
    { number: `${statistics.appointments}+`, label: "Appointments" }
];

    return (
      <div>
        
        <Header/>
         <motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="hero-section"
>
  <div className="hero-content">
    <h1 className="hero-title">Welcome to HealthNest</h1>
    <div className="hero-row">
      <div className="hero-left">
        <DotLottieReact
          src="https://lottie.host/42017f2d-3a85-4a09-8663-fbccce563c50/wpVD14l9Qq.lottie  "
          loop
          autoplay
        />
      </div>
      <div className="hero-right">
        <p className="hero-description">
          Your trusted partner in healthcare. We provide comprehensive medical services with a focus on patient care and well-being.
        </p>
      </div>
    </div>
  </div>
</motion.div>

        <motion.div 
          className="container services-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="services-title">Our Featured Services</h2>
          <div className="services-grid">
            {names.map((name, index) => (
              <motion.div 
                key={index}
                className="service-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <HealthCheck name={name} description={description[index]} />
              </motion.div>
            ))}
          </div>
        </motion.div>
        <h2 style={{textAlign:"center"}}>HealthNest at a Glance</h2>
        <section className="statistics-section">
                <div className="statistics-grid">
                    {statisticsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>
            <h2 style={{ textAlign: "center" }}>Your Daily Dose of Health Tips</h2>
        <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                {loading ? (
                    <div className="loading-message" style={{ textAlign: 'center', padding: '40px' }}>
                        Loading health tips...
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                        <button 
                            className="form-button"
                            onClick={() => fetchHealthTips()}
                            style={{ marginTop: '10px' }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <ContentCarousel items={healthTips} type="tips" />
                )}
            </motion.div>

        <DoctorCarousel />
      
          <HappyPatients />

        <Footer />
      </div>
    );
  };
  
  export default Home;