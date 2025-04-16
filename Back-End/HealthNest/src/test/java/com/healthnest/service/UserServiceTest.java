package com.healthnest.service;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.healthnest.dto.enums.Gender;
import com.healthnest.exception.AuthenticationException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.User;
import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;

@SpringBootTest
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleUser = new User();
        sampleUser.setUserId(1);
        sampleUser.setName("John Doe");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPassword("password123");
        sampleUser.setPhoneNo("1234567890");
        sampleUser.setGender(Gender.MALE);
    }

    @Test
    void testCreateUser_UserAlreadyExists() {
        lenient().when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));

        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> userService.createUser(sampleUser));
        assertEquals("User already exists!", exception.getMessage());
    }

    @Test
    void testCreateUser_NewUser() {
        
        String originalPassword = sampleUser.getPassword(); 
        String encodedPassword = "encodedPassword";
        
        lenient().when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.empty());
        
        lenient().when(bCryptPasswordEncoder.encode(eq(originalPassword))).thenReturn(encodedPassword);
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn("encodedPassword");
        
        
        userService.createUser(sampleUser);

        
        
        verify(bCryptPasswordEncoder).encode(eq(originalPassword)); 
        
        verify(userRepository).save(argThat(savedUser -> 
            savedUser.getPassword().equals(encodedPassword) 
        ));
    }

    @Test 
    void testCreateUser_ShortPassword() {
        
        sampleUser.setPassword("123"); 

        
        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> userService.createUser(sampleUser));
                
        assertEquals("Password must be at least 6 characters long", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testCreateUser_InvalidPhoneNumber() {
        
        sampleUser.setPhoneNo("123abc");

        
        Exception exception = assertThrows(IllegalArgumentException.class, 
                () -> userService.createUser(sampleUser));
                
        assertEquals("Phone number must be 10 digits", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testCreateUser_NullPassword() {
        
        sampleUser.setPassword(null);

        
        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> userService.createUser(sampleUser));
                
        assertEquals("Password must be at least 6 characters long", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testCreateUser_NullEmail() {
        
        sampleUser.setEmail(null);

        
        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> userService.createUser(sampleUser));
                
        assertEquals("Invalid email format", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testLogin_Success() {
        lenient().when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        lenient().when(bCryptPasswordEncoder.matches("password123", sampleUser.getPassword())).thenReturn(true);

        String result = userService.login(sampleUser.getEmail(), "password123");

        assertEquals("Login successful", result);
        verify(bCryptPasswordEncoder).matches("password123", sampleUser.getPassword());
    }

    @Test
    void testLogin_InvalidPassword() {
        lenient().when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        lenient().when(bCryptPasswordEncoder.matches("wrongPassword", sampleUser.getPassword())).thenReturn(false);

        Exception exception = assertThrows(AuthenticationException.class,
                () -> userService.login(sampleUser.getEmail(), "wrongPassword"));

        assertEquals("Invalid Password", exception.getMessage());
        verify(bCryptPasswordEncoder).matches("wrongPassword", sampleUser.getPassword());
    }

    @Test
    void testLogin_UserNotFound() {
        lenient().when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        Exception exception = assertThrows(UserNotFoundException.class,
                () -> userService.login("nonexistent@example.com", "password"));

        assertEquals("User doesn't exist", exception.getMessage());
    }

    @Test
    void testEditProfile_Success() {
        User updatedUser = new User();
        updatedUser.setName("Jane Doe");
        updatedUser.setPhoneNo("1111111111");
        updatedUser.setEmail("jane@example.com");
        updatedUser.setGender(Gender.FEMALE);

        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        lenient().when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        boolean result = userService.editProfile(updatedUser, 1);

        assertTrue(result);
        verify(userRepository, times(1)).save(any(User.class));
        assertEquals("Jane Doe", sampleUser.getName());
        assertEquals("1111111111", sampleUser.getPhoneNo());
        assertEquals("jane@example.com", sampleUser.getEmail());
        assertEquals(Gender.FEMALE, sampleUser.getGender());
    }

    @Test
    void testEditProfile_UserNotFound() {
        User updatedUser = new User();

        lenient().when(userRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> userService.editProfile(updatedUser, 999));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCancelAppointment_Success() {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);
        appointment.setAppointmentStatus("Scheduled");

        lenient().when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));

        userService.cancelAppointment(1);

        assertEquals("Cancelled", appointment.getAppointmentStatus());
    }

    @Test
    void testCancelAppointment_AppointmentNotFound() {
        lenient().when(appointmentRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> userService.cancelAppointment(999));
    }

    @Test
    void testChangePassword_Success() {
        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        lenient().when(bCryptPasswordEncoder.matches("password123", sampleUser.getPassword())).thenReturn(true);
        lenient().when(bCryptPasswordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        lenient().when(userRepository.save(sampleUser)).thenReturn(sampleUser);

        boolean result = userService.changePassword(1, "password123", "newPassword");

        assertTrue(result);
        assertEquals("encodedNewPassword", sampleUser.getPassword());
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    void testChangePassword_IncorrectOldPassword() {
        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        lenient().when(bCryptPasswordEncoder.matches("wrongPassword", sampleUser.getPassword())).thenReturn(false);

        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> userService.changePassword(1, "wrongPassword", "newPassword"));

        assertEquals("Current password is incorrect", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testChangePassword_UserNotFound() {
        lenient().when(userRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> userService.changePassword(999, "password123", "newPassword"));
    }

    @Test
    void testDeleteAccount_Success() {
        lenient().when(userRepository.existsById(1)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1);

        userService.deleteAccount(1);

        verify(userRepository).deleteById(1);
    }

    @Test
    void testDeleteAccount_UserNotFound() {
        lenient().when(userRepository.existsById(999)).thenReturn(false);

        assertThrows(UserNotFoundException.class,
                () -> userService.deleteAccount(999));

        verify(userRepository, never()).deleteById(anyInt());
    }

    @Test
    void testBookAppointment_Success() {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);
        lenient().when(appointmentRepository.save(appointment)).thenReturn(appointment);

        boolean result = userService.bookAppointment(appointment);

        assertTrue(result);
        verify(appointmentRepository).save(appointment);
    }

    @Test
    void testGetUserId_Success() {
        lenient().when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));

        Integer userId = userService.getUserId(sampleUser.getEmail());

        assertEquals(1, userId);
    }

    @Test
    void testGetUserId_UserNotFound() {
        lenient().when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> userService.getUserId("nonexistent@example.com"));
    }

    @Test
    void testGetUserName_Success() {
        lenient().when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));

        String name = userService.getUserName(sampleUser.getEmail());

        assertEquals("John Doe", name);
    }

    @Test
    void testGetUserName_UserNotFound() {
        lenient().when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> userService.getUserName("nonexistent@example.com"));
    }

    @Test
    void testDeleteAllUsers_Success() {
        doNothing().when(userRepository).deleteAll();

        String response = userService.deleteAllUsers();

        verify(userRepository).deleteAll();
        assertEquals("All users and their appointments deleted successfully", response);
    }

    @Test
    void testDeleteAllUsers_Error() {
        doThrow(new RuntimeException("Test exception")).when(userRepository).deleteAll();

        assertThrows(RuntimeException.class, () -> userService.deleteAllUsers());
    }

    @Test
    void testGetUserDetails_Success() {
        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));

        User result = userService.getUserDetails(1);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john@example.com", result.getEmail());
    }

    @Test
    void testGetUserDetails_UserNotFound() {
        lenient().when(userRepository.findById(999)).thenReturn(Optional.empty());

        Exception exception = assertThrows(UserNotFoundException.class,
                () -> userService.getUserDetails(999));

        assertEquals("User not found with ID: 999", exception.getMessage());
    }

    @Test
    void testGetAllUsers_Success() {
        List<User> users = Arrays.asList(sampleUser, new User());
        lenient().when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertSame(users, result);
    }

    @Test
    void testIsUserAlreadyRegistered_UserExists() {
        lenient().when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));

        boolean result = userService.isUserAlreadyRegistered(sampleUser.getEmail());

        assertTrue(result);
    }

    @Test
    void testIsUserAlreadyRegistered_UserDoesNotExist() {
        lenient().when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        boolean result = userService.isUserAlreadyRegistered("notfound@example.com");

        assertFalse(result);
    }

    @Test
    void testEditProfile_NullUser() {
        assertThrows(IllegalArgumentException.class, () -> userService.editProfile(null, 1));
    }

    @Test
    void testEditProfile_EmptyNameUpdated() {
        User updatedUser = new User();
        updatedUser.setName("");

        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));

        assertThrows(IllegalArgumentException.class, () -> userService.editProfile(updatedUser, 1));
    }

    @Test
    void testEditProfile_InvalidEmailUpdated() {
        User updatedUser = new User();
        updatedUser.setEmail("invalid-email");

        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));

        assertThrows(IllegalArgumentException.class, () -> userService.editProfile(updatedUser, 1));
    }

    @Test
    void testEditProfile_InvalidPhoneNoUpdated() {
        User updatedUser = new User();
        updatedUser.setPhoneNo("123");

        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));

        assertThrows(IllegalArgumentException.class, () -> userService.editProfile(updatedUser, 1));
    }

    @Test
    void testCancelAppointment_NullAppointment() {
        lenient().when(appointmentRepository.findById(1)).thenReturn(Optional.of(new Appointment()));
        assertDoesNotThrow(() -> userService.cancelAppointment(1));
    }

    @Test
    void testChangePassword_NewPasswordTooShort() {
        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        lenient().when(bCryptPasswordEncoder.matches("password123", sampleUser.getPassword())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.changePassword(1, "password123", "123"));
    }

    @Test
    void testChangePassword_SamePassword() {
        lenient().when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        lenient().when(bCryptPasswordEncoder.matches("password123", sampleUser.getPassword())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.changePassword(1, "password123", "password123"));
    }

    @Test
    void testDeleteAllUsers_Exception() {
        doThrow(new RuntimeException("Test exception")).when(userRepository).deleteAll();

        assertThrows(RuntimeException.class, () -> userService.deleteAllUsers());
    }

    @Test
    void testGetUserDetails_Exception() {
        lenient().when(userRepository.findById(1)).thenThrow(new RuntimeException("Test exception"));

        assertThrows(RuntimeException.class, () -> userService.getUserDetails(1));
    }

    @Test
    void testGetAllUsers_Exception() {
        lenient().when(userRepository.findAll()).thenThrow(new RuntimeException("Test exception"));

        assertThrows(RuntimeException.class, () -> userService.getAllUsers());
    }
}
