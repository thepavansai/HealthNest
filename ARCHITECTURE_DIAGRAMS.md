# HealthNest: Architecture & Technical Diagrams
## Visual Guide for Presentations

---

## SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEALTHNEST SYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                  ┌──────────────────┐    │
│  │   FRONTEND       │                  │    BACKEND       │    │
│  │   (React 18)     │◄─────────────────►│  (Spring Boot)   │    │
│  │                  │    REST API +     │                  │    │
│  │  • Dashboard     │    JWT Auth       │  • Controllers   │    │
│  │  • Auth Pages    │                   │  • Services      │    │
│  │  • Components    │                   │  • Repositories  │    │
│  │  • State Mgmt    │                   │  • Security      │    │
│  │  (React Router)  │                   │                  │    │
│  └──────────────────┘                  └────────┬─────────┘    │
│         │                                       │               │
│         │         (JSON over HTTPS)             │               │
│         │                                       │               │
│         │                          ┌────────────▼───────────┐   │
│         │                          │   DATABASE LAYER       │   │
│         │                          │                        │   │
│         │                          │  MySQL 8.0             │   │
│         │                          │  • Users               │   │
│         │                          │  • Doctors             │   │
│         │                          │  • Appointments        │   │
│         │                          │  • Prescriptions       │   │
│         │                          │  • Feedback            │   │
│         │                          │                        │   │
│         │                          └────────────────────────┘   │
│         │                                                       │
│  ┌──────▼──────────────┐                                        │
│  │  LOCAL STORAGE      │                                        │
│  │  (Client-side)      │                                        │
│  │  • JWT Token        │                                        │
│  │  • User ID          │                                        │
│  │  • Role             │                                        │
│  │  • Profile Info     │                                        │
│  └─────────────────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## AUTHENTICATION & AUTHORIZATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              JWT AUTHENTICATION FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN PHASE
   ┌──────────┐                                  ┌─────────┐
   │  User    │                                  │ Backend │
   │  enters  │                                  │ (Spring)│
   │ email &  │─────POST /login──────────────►   │         │
   │ password │◄────{token, userId, role}─────   │         │
   └──────────┘                                  └─────────┘
        │
        │ Store in localStorage
        ▼
   ┌─────────────────────┐
   │  BROWSER            │
   │ - userId            │
   │ - token             │
   │ - userRole          │
   └─────────────────────┘


2. AUTHORIZATION PHASE
   ┌──────────┐                    ┌──────────┐              ┌─────────┐
   │ Frontend │                    │ Backend  │              │ Database│
   │ (React)  │─Request + Token────► JWT      │──Check Role──►         │
   │          │                    │ Filter   │              │         │
   │          │◄─Success/Failure───┤          │              │         │
   └──────────┘                    └──────────┘              └─────────┘
        │
        │ ProtectedRoute component
        │ checks localStorage
        ▼
   ┌─────────────────┐
   │ Token valid     │
   │ & Role allowed? │
   │ YES → Render    │
   │ NO → Redirect   │
   └─────────────────┘


3. TOKEN STRUCTURE
   ┌────────────────────────────────────────┐
   │  JWT TOKEN                              │
   ├────────────────────────────────────────┤
   │  HEADER   │ TOKEN_TYPE: "Bearer"        │
   │           │ ALGORITHM: "HS256"          │
   │───────────┼─────────────────────────────│
   │  PAYLOAD  │ email: "user@email.com"     │
   │           │ role: "USER"/"DOCTOR"/"ADMIN"
   │           │ iat: 1642291200             │
   │           │ exp: 1642298400 (+30 min)   │
   │───────────┼─────────────────────────────│
   │  SIGNATURE│ HMAC-SHA256(header.payload) │
   └────────────────────────────────────────┘
```

---

## ROLE-BASED ACCESS CONTROL

```
┌──────────────────────────────────────────┐
│         THREE ROLE HIERARCHY              │
└──────────────────────────────────────────┘

  ADMIN
   ├── View all users
   ├── View all doctors
   ├── Activate/Deactivate doctors
   ├── View all appointments
   ├── View analytics
   └── Delete users/doctors

  DOCTOR
   ├── View own profile
   ├── View own appointments
   ├── Write prescriptions
   ├── Track income
   ├── Set availability
   └── View patient feedback

  USER
   ├── View own profile
   ├── Search doctors by symptom
   ├── Book appointments
   ├── View own appointments
   ├── View prescriptions
   ├── Leave feedback
   └── Cancel appointments


ENDPOINT PROTECTION EXAMPLE:

@GetMapping("/appointments/{id}")
@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
public ResponseEntity<AppointmentDTO> getAppointment(@PathVariable Long id) {
    // This endpoint only allows DOCTOR or ADMIN roles
    // Users without these roles get 403 Forbidden
}
```

---

## APPOINTMENT BOOKING - AVOIDING RACE CONDITIONS

```
┌────────────────────────────────────────────────────────────────┐
│         RACE CONDITION PREVENTION MECHANISM                     │
└────────────────────────────────────────────────────────────────┘

Time: t0  User1 wants slot: Doctor A, Jan 1, 2 PM
      t1  User2 wants slot: Doctor A, Jan 1, 2 PM
      (Both click Book at nearly same time)


WITHOUT PROTECTION:
  t0 ► User1: Is slot free? → YES
  t1 ► User2: Is slot free? → YES
  t2 ► User1: Save booking ✓ (succeeds)
  t3 ► User2: Save booking ✓ (WRONG! Both have same slot!)


WITH OUR PROTECTION:

  DATABASE LAYER (First Defense):
  ┌───────────────────────────────────┐
  │ UNIQUE CONSTRAINT:                │
  │ (doctor_id, date, time)           │
  │                                   │
  │ Physically prevents database      │
  │ from storing duplicate entries    │
  └───────────────────────────────────┘

  APPLICATION LAYER (Second Defense):
  ┌─────────────────────────────────────────────┐
  │ @Transactional                              │
  │ public boolean bookAppointment(appt) {      │
  │                                             │
  │   // First check: Verify slot not taken    │
  │   if (appointmentRepository               │
  │       .existsByDoctorAndDateAndTime(...))  │
  │     return false; // Another user booked it│
  │                                             │
  │   // Save the appointment                   │
  │   appointmentRepository.save(appt);         │
  │   return true;                              │
  │ }                                           │
  └─────────────────────────────────────────────┘


RESULT:
  t0 ► User1: Check → FREE, Save → ✓ SAVED
  t1 ► User2: Check → TAKEN (by User1), Reject ✓ PREVENTED
```

---

## BACKEND ARCHITECTURE - LAYERED APPROACH

```
┌─────────────────────────────────────────────────────────────────┐
│  HTTP REQUEST FROM FRONTEND                                     │
└─────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CONTROLLER LAYER                                               │
│  (Handle HTTP)                                                  │
│                                                                 │
│  @PostMapping("/bookAppointment")                               │
│  @PreAuthorize("hasRole('USER')")                               │
│  public ResponseEntity<String> book(@RequestBody AppointmentDTO)│
│  {                                                              │
│      appointmentService.book(appointment);                      │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVICE LAYER                                                  │
│  (Business Logic)                                               │
│                                                                 │
│  public boolean bookAppointment(Appointment appointment) {      │
│      // Validate appointment                                    │
│      validateAppointment(appointment);                          │
│                                                                 │
│      // Check if slot is available (double-check)               │
│      if (isSlotTaken(appointment)) {                            │
│          throw new AppointmentException("Slot taken");          │
│      }                                                          │
│                                                                 │
│      // Save appointment                                        │
│      return appointmentRepository.save(appointment);            │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  REPOSITORY LAYER                                               │
│  (Database Access)                                              │
│                                                                 │
│  @Repository                                                    │
│  public interface AppointmentRepository                         │
│      extends CrudRepository<Appointment, Long> {                │
│                                                                 │
│      boolean existsByDoctorAndDateAndTime(...);                 │
│      Appointment save(Appointment appointment);                 │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  DATABASE LAYER                                                 │
│  (MySQL)                                                        │
│                                                                 │
│  CREATE TABLE appointments (                                    │
│      appointment_id BIGINT PRIMARY KEY AUTO_INCREMENT,          │
│      doctor_id BIGINT NOT NULL,                                 │
│      appointment_date DATE NOT NULL,                            │
│      appointment_time TIME NOT NULL,                            │
│      UNIQUE KEY uk_doctor_date_time                             │
│           (doctor_id, appointment_date, appointment_time)       │
│  );                                                             │
└────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│  HTTP RESPONSE TO FRONTEND                                      │
│  {"message": "Appointment booked successfully", ...}            │
└─────────────────────────────────────────────────────────────────┘
```

---

## FRONTEND COMPONENT HIERARCHY

```
┌─────────────────┐
│   App (Router)  │
└────────┬────────┘
         │
    ┌────┴─────┐
    │           │
    ▼           ▼
┌──────────┐  ┌──────────────────────┐
│  Public  │  │   ProtectedRoute     │
│ Pages    │  │   (Role Checker)     │
│          │  │                      │
│• Home    │  └──────────┬───────────┘
│• Login   │             │
│• Signup  │   ┌─────────┼─────────┐
│• About   │   │         │         │
│          │   ▼         ▼         ▼
└──────────┘ USER     DOCTOR    ADMIN
             PAGES   PAGES      PAGES
             │         │         │
          ┌──┴──┐   ┌──┴──┐   ┌──┴──┐
          │     │   │     │   │     │
          ▼     ▼   ▼     ▼   ▼     ▼
        Dash Appt Prof Dash Appt Dash
        board ment ile board ment board
```

---

## DATA FLOW - BOOKING AN APPOINTMENT

```
USER PERSPECTIVE:
┌───────────────┐
│ 1. Select     │
│    doctor &   │
│    time slot  │
└───────┬───────┘
        │
┌───────▼───────┐
│ 2. Confirm    │
│    booking    │
└───────┬───────┘
        │
┌───────▼────────────────┐           ┌─────────────────────┐
│ 3. Enter payment info  │           │ Frontend            │
│    (payment modal)     │───────────►│                     │
└───────┬────────────────┘           │ • Validate input    │
        │                            │ • Show confirmation │
        │                            │ • Check auth token  │
        │                            └────────┬────────────┘
        │                                     │
        └─────────────────────┬───────────────┘
                              │
                    ┌─────────▼────────────┐
                    │ 4. Send to Backend   │
                    │                      │
                    │ POST /bookAppointment│
                    │ {                    │
                    │   doctorId: 5,       │
                    │   date: "2024-01-15" │
                    │   time: "14:00"      │
                    │ }                    │
                    └─────────┬────────────┘
                              │
                    ┌─────────▼────────────────────┐
                    │ Backend Processing           │
                    │                              │
                    │ 1. Verify JWT token validity │
                    │ 2. Check user role (USER)    │
                    │ 3. Validate appointment data │
                    │ 4. Check slot availability   │
                    │ 5. Double-check availability │
                    │ 6. Save to database          │
                    │ (Database enforces UNIQUE)   │
                    │ 7. Return success            │
                    └─────────┬────────────────────┘
                              │
        ┌─────────────────────▼──────────────────┐
        │ Desktop Update                         │
        │                                        │
        │ 5. Show success message               │
        │ 6. Redirect to Appointments page      │
        │ 7. Display newly booked appointment   │
        │ 8. Option to view prescription (wait) │
        └────────────────────────────────────────┘
```

---

## SECURITY LAYERS

```
┌───────────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                        │
└───────────────────────────────────────────────────────────────┘

LAYER 1: HTTPS/TLS
┌─────────────────────────────────────┐
│ Encrypts data in transit            │
│ ✓ Frontend → Backend encrypted      │
│ ✓ Browser shows 🔒 lock icon        │
└─────────────────────────────────────┘
           ▼
LAYER 2: CORS
┌─────────────────────────────────────┐
│ Prevents cross-origin attacks       │
│ ✓ Only allow requests from          │
│   health-nest.netlify.app           │
└─────────────────────────────────────┘
           ▼
LAYER 3: JWT AUTHENTICATION
┌─────────────────────────────────────┐
│ Verifies user identity              │
│ ✓ Token signed with secret key      │
│ ✓ Token expires after 30 minutes    │
│ ✓ Role embedded in token            │
└─────────────────────────────────────┘
           ▼
LAYER 4: JWT FILTER
┌─────────────────────────────────────┐
│ Every request validated             │
│ ✓ Extract token from header         │
│ ✓ Verify signature                  │
│ ✓ Check expiration                  │
│ ✓ Extract role                      │
└─────────────────────────────────────┘
           ▼
LAYER 5: METHOD SECURITY
┌─────────────────────────────────────┐
│ Endpoint-level authorization        │
│ @PreAuthorize("hasRole('DOCTOR')")  │
│ ✓ Only doctors can access           │
└─────────────────────────────────────┘
           ▼
LAYER 6: BUSINESS LOGIC VALIDATION
┌─────────────────────────────────────┐
│ Verify user can perform action      │
│ ✓ User can only access own data     │
│ ✓ Doctor can't modify other doctors'│
│   profiles                          │
└─────────────────────────────────────┘
           ▼
LAYER 7: DATABASE CONSTRAINTS
┌─────────────────────────────────────┐
│ Enforce rules at lowest level       │
│ ✓ UNIQUE constraints                │
│ ✓ NOT NULL constraints              │
│ ✓ Foreign key constraints           │
└─────────────────────────────────────┘
```

---

## DATABASE SCHEMA RELATIONSHIPS

```
┌────────────────┐
│     USER       │
├────────────────┤
│ userId (PK)    │
│ email          │
│ password       │
│ name           │
│ phone          │
│ dateOfBirth    │
│ gender         │
│ role           │
└────┬───────────┘
     │        (1:N)
     │        Has
     │
     ├──────────────────────────────────┐
     │                                  │
┌────▼─────────────────┐    ┌──────────▼────────┐
│   APPOINTMENT        │    │    FEEDBACK       │
├──────────────────────┤    ├───────────────────┤
│ appointmentId (PK)   │    │ id (PK)           │
│ userId (FK) ──┘      │    │ userId (FK) ──┘   │
│ doctorId (FK) ──┐    │    │ feedback          │
│ date           │    │    │ rating            │
│ time           │    │    │ emailId           │
│ status         │    │    └───────────────────┘
│ description    │    │
└────┬────────────┘    │
     │                 │
     │        (1:N)    │
     │        Has      │
     │                 │
┌────▼────────────┐    │
│  PRESCRIPTION   │    │
├─────────────────┤    │
│ id (PK)         │    │
│ appointmentId   ├───┘
│ (FK)            │
│ doctorId (FK)───┴───┐
│ medicines       │   │
│ advice          │   │
│ date            │   │
└─────────────────┘   │
                      │
                 (1:N)│
                 Has  │
                      │
             ┌────────▼─────────┐
             │     DOCTOR       │
             ├──────────────────┤
             │ doctorId (PK)    │
             │ doctorName       │
             │ emailId          │
             │ password         │
             │ specialization   │
             │ experience       │
             │ phone            │
             │ consultationFee  │
             │ rating           │
             │ status           │
             │ latitude         │
             │ longitude        │
             └──────────────────┘
```

---

## API ENDPOINTS STRUCTURE

```
PUBLIC ENDPOINTS (No authentication required):
├── POST   /v1/users/signup          - Register new user
├── POST   /v1/users/login           - User login
├── POST   /v1/doctor-signup         - Register new doctor
├── POST   /v1/doctor-login          - Doctor login
├── POST   /v1/admin-login           - Admin login
├── GET    /v1/doctor/summary        - Doctor list
└── GET    /v1/feedback/all          - All feedback

USER ENDPOINTS (requires @PreAuthorize("hasRole('USER')"))
├── GET    /v1/users/{id}            - Get profile
├── PUT    /v1/users/{id}            - Update profile
├── GET    /v1/users/appointments/{userId}
├── POST   /v1/appointments          - Book appointment
├── PATCH  /v1/appointments/{id}     - Cancel appointment
└── POST   /v1/feedback/add          - Submit feedback

DOCTOR ENDPOINTS (requires @PreAuthorize("hasRole('DOCTOR')"))
├── GET    /v1/doctor/profile/{id}   - Get profile
├── PUT    /v1/doctor/profile/{id}   - Update profile
├── GET    /v1/appointments/doctor/{id}
├── POST   /v1/prescriptions/add     - Write prescription
└── GET    /v1/doctor/income         - View income

ADMIN ENDPOINTS (requires @PreAuthorize("hasRole('ADMIN')"))
├── GET    /v1/admin/users           - List all users
├── GET    /v1/admin/doctors         - List all doctors
├── DELETE /v1/admin/users/delete    - Delete users
├── PATCH  /v1/admin/doctors/verify  - Approve doctor
└── GET    /v1/admin/analytics       - View analytics
```

---

## DEPLOYMENT ARCHITECTURE

```
┌────────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT                      │
└────────────────────────────────────────────────────────┘

FRONTEND
┌──────────────────────────────────────┐
│ GitHub Repository (Source)           │
└──────────────┬───────────────────────┘
               │
    ┌──────────▼──────────────┐
    │ Git Push Trigger        │
    │ (on main/animations)    │
    └──────────┬──────────────┘
               │
    ┌──────────▼──────────────────┐
    │ Netlify Build              │
    │ - npm install              │
    │ - npm run build            │
    │ - Build optimization       │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │ Netlify Deployment         │
    │ https://health-nest.       │
    │ netlify.app                │
    │ - SSL/TLS enabled          │
    │ - CDN cached               │
    └────────────────────────────┘


BACKEND
┌──────────────────────────────────────┐
│ GitHub Repository (Source)           │
└──────────┬───────────────────────────┘
           │
    ┌──────▼─────────────┐
    │ Jenkins Pipeline   │
    │ (CI/CD)            │
    │ - Trigger on push  │
    │ - Build artifact   │
    │ - Run tests        │
    └──────┬─────────────┘
           │
    ┌──────▼────────────────────┐
    │ Docker Build              │
    │ (Dockerfile)              │
    │ - Base image: openjdk:17  │
    │ - Copy JAR                │
    │ - Expose port 8080        │
    └──────┬────────────────────┘
           │
    ┌──────▼────────────────┐
    │ Docker Container      │
    │ Running Spring Boot   │
    │ - Health checks       │
    │ - Resource limits     │
    └──────┬─────────────────┘
           │
┌──────────▼────────────────┐
│ Database Layer            │
│ MySQL (Cloud hosted)      │
│ - Backups automated       │
│ - Read replicas           │
└───────────────────────────┘
```

---

## TESTING STRATEGY

```
UNIT TESTS (JUnit)
├── Service Layer Tests
│   ├── AppointmentServiceTest
│   ├── UserServiceTest
│   ├── DoctorServiceTest
│   ├── FeedBackServiceTest
│   └── JWTServiceTest
│
├── Controller Tests
│   ├── UserControllerTest
│   ├── DoctorControllerTest
│   ├── AppointmentControllerTest
│   ├── AdminControllerTest
│   ├── FeedbackControllerTest
│   └── AuthenticationControllerTest
│
└── Exception Tests
    └── GlobalExceptionHandlerTest


CODE COVERAGE (JaCoCo)
├── Target: 75%+ coverage on critical paths
├── Report generated in: target/site/jacoco
└── Tracks:
    ├── Line coverage
    ├── Branch coverage
    └── Method coverage




