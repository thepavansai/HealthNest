package com.healthnest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.healthnest.exception.AuthenticationException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.model.UserPrincipal;
import com.healthnest.model.enums.Gender;
import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationConfiguration authConfig;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Appointment testAppointment;

    @BeforeEach
    void setUp() throws Exception {
        // Set up test user
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setGender(Gender.MALE);
        testUser.setDateOfBirth("1990-01-01");
        testUser.setPhoneNo("1234567890");
        testUser.setRole("USER");

        // Set up test doctor (needed for appointment)
        Doctor testDoctor = new Doctor();
        testDoctor.setDoctorId(1L);
        testDoctor.setDoctorName("Dr. Test");

        // Set up test appointment
        testAppointment = new Appointment();
        testAppointment.setAppointmentId(1L);
        testAppointment.setUser(testUser);
        testAppointment.setDoctor(testDoctor);
        testAppointment.setAppointmentStatus("Pending");
        testAppointment.setAppointmentDate(LocalDate.now());
        testAppointment.setAppointmentTime(LocalTime.of(10, 0));
        testAppointment.setDescription("Test appointment");

        // Configure authentication manager - make it lenient to avoid unnecessary stubbing errors
        lenient().when(authConfig.getAuthenticationManager()).thenReturn(authenticationManager);
    }



    @Test
    void loadUserByUsername_ExistingUser_ReturnsUserPrincipal() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userService.loadUserByUsername("test@example.com");

        // Assert
        assertNotNull(userDetails);
        assertTrue(userDetails instanceof UserPrincipal);
        assertEquals("test@example.com", userDetails.getUsername());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void loadUserByUsername_NonExistingUser_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername("nonexistent@example.com");
        });
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    @Test
    void createUser_ValidUser_SavesUser() {
        // Arrange
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("new@example.com");
        newUser.setPassword("password123");
        newUser.setGender(Gender.FEMALE);
        newUser.setPhoneNo("9876543210");

        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        // Act
        userService.createUser(newUser);

        // Assert
        verify(userRepository, times(1)).findByEmail("new@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(newUser);
        assertEquals("encodedPassword", newUser.getPassword());
        assertEquals("USER", newUser.getRole());
    }

    @Test
    void createUser_ExistingEmail_ThrowsException() {
        // Arrange
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("test@example.com");
        newUser.setPassword("password123");
        newUser.setGender(Gender.FEMALE);
        newUser.setPhoneNo("9876543210");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(newUser);
        });
        assertEquals("User already exists!", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_NullUser_ThrowsException() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(null);
        });
        assertEquals("User cannot be null", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_EmptyName_ThrowsException() {
        // Arrange
        User newUser = new User();
        newUser.setName("");
        newUser.setEmail("new@example.com");
        newUser.setPassword("password123");
        newUser.setGender(Gender.FEMALE);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(newUser);
        });
        assertEquals("User name cannot be empty", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_InvalidEmail_ThrowsException() {
        // Arrange
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("invalid-email");
        newUser.setPassword("password123");
        newUser.setGender(Gender.FEMALE);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(newUser);
        });
        assertEquals("Invalid email format", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_ShortPassword_ThrowsException() {
        // Arrange
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("new@example.com");
        newUser.setPassword("12345");
        newUser.setGender(Gender.FEMALE);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(newUser);
        });
        assertEquals("Password must be at least 6 characters long", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_InvalidPhoneNumber_ThrowsException() {
        // Arrange
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("new@example.com");
        newUser.setPassword("password123");
        newUser.setGender(Gender.FEMALE);
        newUser.setPhoneNo("123");

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(newUser);
        });
        assertEquals("Phone number must be 10 digits", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserDetails_ExistingUser_ReturnsUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserDetails(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getUserId(), result.getUserId());
        assertEquals(testUser.getName(), result.getName());
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserDetails_NonExistingUser_ThrowsException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.getUserDetails(999L);
        });
        assertEquals("User not found with ID: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void isUserAlreadyRegistered_ExistingEmail_ReturnsTrue() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        boolean result = userService.isUserAlreadyRegistered("test@example.com");

        // Assert
        assertTrue(result);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void isUserAlreadyRegistered_NonExistingEmail_ReturnsFalse() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act
        boolean result = userService.isUserAlreadyRegistered("nonexistent@example.com");

        // Assert
        assertFalse(result);
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    @Test
    void editProfile_ValidUpdate_UpdatesUser() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setName("Updated Name");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setPhoneNo("9876543210");
        updatedUser.setDateOfBirth("1995-05-05");
        updatedUser.setGender(Gender.FEMALE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        boolean result = userService.editProfile(updatedUser, 1L);

        // Assert
        assertTrue(result);
        assertEquals("Updated Name", testUser.getName());
        assertEquals("updated@example.com", testUser.getEmail());
        assertEquals("9876543210", testUser.getPhoneNo());
        assertEquals("1995-05-05", testUser.getDateOfBirth());
        assertEquals(Gender.FEMALE, testUser.getGender());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void editProfile_NullUser_ThrowsException() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.editProfile(null, 1L);
        });
        assertEquals("User cannot be null", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void editProfile_EmptyName_ThrowsException() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setName("");
        updatedUser.setEmail("updated@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.editProfile(updatedUser, 1L);
        });
        assertEquals("User name cannot be empty", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void editProfile_InvalidEmail_ThrowsException() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setName("Updated Name");
        updatedUser.setEmail("invalid-email");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.editProfile(updatedUser, 1L);
        });
        assertEquals("Invalid email format", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void editProfile_InvalidPhoneNumber_ThrowsException() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setName("Updated Name");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setPhoneNo("123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.editProfile(updatedUser, 1L);
        });
        assertEquals("Invalid phone number format", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void editProfile_NonExistingUser_ThrowsException() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setName("Updated Name");
        updatedUser.setEmail("updated@example.com");

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.editProfile(updatedUser, 999L);
        });
        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getAllUsers_ReturnsAllUsers() {
        // Arrange
        List<User> userList = Arrays.asList(testUser, new User());
        when(userRepository.findAll()).thenReturn(userList);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }
    @Test
    void cancelAppointment_ExistingAppointment_CancelsAppointment() {
        // Arrange
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));

        // Act
        userService.cancelAppointment(1L);

        // Assert
        assertEquals("Cancelled", testAppointment.getAppointmentStatus());
        verify(appointmentRepository, times(1)).findById(1L);
    }

    @Test
    void changePassword_ValidOldPassword_ChangesPassword() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");

        // Act
        boolean result = userService.changePassword(1L, "oldPassword", "newPassword");

        // Assert
        assertTrue(result);
        assertEquals("newEncodedPassword", testUser.getPassword());
        verify(userRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("oldPassword", "encodedPassword");
        verify(passwordEncoder, times(1)).encode("newPassword");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void changePassword_InvalidOldPassword_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.changePassword(1L, "wrongPassword", "newPassword");
        });
        assertEquals("Current password is incorrect", exception.getMessage());
        verify(userRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("wrongPassword", "encodedPassword");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_ShortNewPassword_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.changePassword(1L, "oldPassword", "short");
        });
        assertEquals("New password must be at least 6 characters long", exception.getMessage());
        verify(userRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("oldPassword", "encodedPassword");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_SameAsOldPassword_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.changePassword(1L, "oldPassword", "oldPassword");
        });
        assertEquals("New password must be different from the current password", exception.getMessage());
        verify(userRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("oldPassword", "encodedPassword");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_NonExistingUser_ThrowsException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.changePassword(999L, "oldPassword", "newPassword");
        });
        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteAccount_ExistingUser_DeletesUser() {
        // Arrange
        when(userRepository.existsById(1L)).thenReturn(true);

        // Act
        userService.deleteAccount(1L);

        // Assert
        verify(userRepository, times(1)).existsById(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteAccount_NonExistingUser_ThrowsException() {
        // Arrange
        when(userRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.deleteAccount(999L);
        });
        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, times(1)).existsById(999L);
        verify(userRepository, never()).deleteById(anyLong());
    }

    @Test
    void bookAppointment_ValidAppointment_SavesAppointment() {
        // Arrange
        when(appointmentRepository.save(testAppointment)).thenReturn(testAppointment);

        // Act
        boolean result = userService.bookAppointment(testAppointment);

        // Assert
        assertTrue(result);
        verify(appointmentRepository, times(1)).save(testAppointment);
    }

    @Test
    void login_ValidCredentials_ReturnsSuccessResponse() throws Exception {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(jwtService.generateToken(eq("test@example.com"), eq("USER"))).thenReturn("jwt-token");

        // Act
        Map<String, String> result = userService.login("test@example.com", "password123");

        // Assert
        assertEquals("Login successful", result.get("message"));
        assertEquals("jwt-token", result.get("token"));
        assertEquals("USER", result.get("role"));
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("password123", "encodedPassword");
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateToken("test@example.com", "USER");
    }

    @Test
    void login_NonExistingUser_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.login("nonexistent@example.com", "password123");
        });
        assertEquals("User doesn't exist", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // Act & Assert
        AuthenticationException exception = assertThrows(AuthenticationException.class, () -> {
            userService.login("test@example.com", "wrongPassword");
        });
        assertEquals("Invalid Password", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("wrongPassword", "encodedPassword");
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    void getUserId_ExistingEmail_ReturnsUserId() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        Long userId = userService.getUserId("test@example.com");

        // Assert
        assertEquals(1L, userId);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void getUserId_NonExistingEmail_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.getUserId("nonexistent@example.com");
        });
        assertEquals("User not found with email: nonexistent@example.com", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    @Test
    void getUserName_ExistingEmail_ReturnsUserName() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        String userName = userService.getUserName("test@example.com");

        // Assert
        assertEquals("Test User", userName);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void deleteAllUsers_DeletesAllUsers() {
        // Act
        String result = userService.deleteAllUsers();

        // Assert
        assertEquals("All users and their appointments deleted successfully", result);
        verify(userRepository, times(1)).deleteAll();
    }

    @Test
    void setNewPassword_ExistingUser_SetsNewPassword() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("newEncodedPassword");

        // Act
        boolean result = userService.setNewPassword("test@example.com", "newPassword123");

        // Assert
        assertTrue(result);
        assertEquals("newEncodedPassword", testUser.getPassword());
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).encode("newPassword123");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void setNewPassword_NonExistingUser_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.setNewPassword("nonexistent@example.com", "newPassword123");
        });
        assertEquals("User not found with email: nonexistent@example.com", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void setNewPassword_ShortPassword_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.setNewPassword("test@example.com", "short");
        });
        assertEquals("New password must be at least 6 characters long", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}

    