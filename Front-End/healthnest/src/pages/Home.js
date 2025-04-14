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
          console.error('Error fetching health tips:', err);
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
        // Fallback to default values if API fails
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
                    <p className="hero-description">
                        Your trusted partner in healthcare. We provide comprehensive medical services with a focus on patient care and well-being.
                    </p>
                </div>
            </motion.div>
        <div className="container mt-5 pt-4"> { }
      <div className="row justify-content-center gap-3 mt-4">
      <h2 style={{ textAlign: "center" }}>Our Featured Services</h2>
        <div className="col-md-3">
          <HealthCheck name={names[0]} description={description[0]} />
        </div>
        <div className="col-md-3">
          <HealthCheck name={names[1]} description={description[1]} />
        </div>
        <div className="col-md-3">
          <HealthCheck name={names[2]} description={description[2]} />
        </div>
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
        <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
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

        <DoctorCarousel></DoctorCarousel>
      </div>

      
          <HappyPatients />

    </div>
    <Footer></Footer>
    
      </div>
    );
  };
  
  export default Home;
  


