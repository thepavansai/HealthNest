import Footer from "../components/Footer";
import HealthCheck from "../components/HealthCheck"
import Header from "../components/Header"
import DoctorProfile from "./DoctorProfile";
import ChangePassword from "./ChangePassword";
import ManageAppointments from "./ManageAppointments";
import DeleteAccount from "./DeleteAccount";
import DoctorCarousel from "../components/DoctorCarousel";

const Home = () => {
    const names = ["Health Checkup", "View Appointments", "Join Our Team"];
    const description = [
      "Consult a specialized doctor based on your condition.",
      "View and manage your upcoming appointments.",
      "If you're a doctor interested in joining us"
    ];
    return (
      <div>
        
        <Header/>
        
        <div className="container mt-5 pt-4"> {/* Increased top spacing */}
      <div className="row justify-content-center gap-3 mt-4">
        <div className="col-md-3">
          <HealthCheck name={names[0]} description={description[0]} />
        </div>
        <div className="col-md-3">
          <HealthCheck name={names[1]} description={description[1]} />
        </div>
        <div className="col-md-3">
          <HealthCheck name={names[2]} description={description[2]} />
        </div>
        <DoctorCarousel></DoctorCarousel>
      </div>

      
    </div>
    <Footer></Footer>
    
      </div>
    );
  };
  
  export default Home;
  


