import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const getStatistics = async () => {
    try {
        // Fetch individual counts
        const [usersResponse, doctorsResponse, appointmentsResponse] = await Promise.all([
            axios.get(`${BASE_URL}/users/countallusers`),
            axios.get(`${BASE_URL}/doctor/countalldoctors`),
            axios.get(`${BASE_URL}/appointments/countall`)
        ]);

        

        return {
            doctorCount: doctorsResponse.data || 0,
            patientCount: usersResponse.data || 0,
            appointmentCount: appointmentsResponse.data
        };
    } catch (error) {
        console.error('Error fetching statistics:', error);
        // Return default values if API fails
        return {
            doctorCount: 100,
            patientCount: 5000,
            appointmentCount: 100
        };
    }
}; 