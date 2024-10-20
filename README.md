# Clinic Management System API

This API provides endpoints for managing doctors, patients, appointments, prescriptions, and medical history. It is built using **NestJS** and **Mongoose**.

## Features

- **Doctor and Patient Management**: Create and manage doctor and patient accounts with administrative endpoints.
- **Appointments**: Create, update, and manage appointments, linking them to both doctors and patients.
- **Prescriptions**: Manage prescriptions for appointments, ensuring that prescriptions cannot be issued without an associated appointment.
- **Medical History**: Store patient medical history, including diagnosis, treatments, and notes, with optional links to specific appointments.
- **Validation**: All requests are validated using **DTOs** and **class-validator** to ensure data integrity.
- **MongoDB**: NoSQL database used with **Mongoose** for schema management and object modeling.

## Table of Contents

- [Installation](#installation)
- [Endpoints](#endpoints)
  - [Doctor Endpoints](#doctor-endpoints)
  - [Patient Endpoints](#patient-endpoints)
  - [Appointment Endpoints](#appointment-endpoints)
  - [Prescription Endpoints](#prescription-endpoints)
  - [Medical History Endpoints](#medical-history-endpoints)
- [DTOs](#dtos)
  - [Create DTOs](#create-dtos)
  - [Update DTOs](#update-dtos)
  - [Search DTOs](#search-dtos)
- [Models](#models)
- [Validation](#validation)
- [Error Handling](#error-handling)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/oussamasf/doctor-api.git
```

2. Install the dependencies:

```bash
npm install
```

3. Set up the environment variables:

Create a `.env` file in the root directory based on `.env.example`:

4. Run the application:

```bash
npm run start
```

The API will be accessible at `http://localhost:3001`.

## Endpoints

### Doctor Endpoints

- **POST /doctors**: Create a new doctor.
- **GET /doctors**: Get a list of all doctors.
- **GET /doctors/:id**: Get details of a specific doctor by ID.
- **PUT /doctors/:id**: Update details of a doctor.
- **DELETE /doctors/:id**: Remove a doctor.

### Patient Endpoints

- **POST /patients**: Create a new patient.
- **GET /patients**: Get a list of all patients.
- **GET /patients/:id**: Get details of a specific patient by ID.
- **PUT /patients/:id**: Update details of a patient.
- **DELETE /patients/:id**: Remove a patient.

### Appointment Endpoints

- **POST /appointments**: Create a new appointment.
- **GET /appointments**: Get a list of all appointments.
- **GET /appointments/:id**: Get details of a specific appointment by ID.
- **PUT /appointments/:id**: Update an appointment.
- **DELETE /appointments/:id**: Remove an appointment.

### Prescription Endpoints

- **POST /prescriptions**: Create a new prescription (linked to an appointment).
- **GET /prescriptions**: Get a list of all prescriptions.
- **GET /prescriptions/:id**: Get details of a specific prescription by ID.
- **PUT /prescriptions/:id**: Update a prescription.
- **DELETE /prescriptions/:id**: Remove a prescription.

### Medical History Endpoints

- **POST /medical-history**: Create a new medical history entry for a patient.
- **GET /medical-history**: Get a list of all medical history records.
- **GET /medical-history/:id**: Get details of a specific medical history record by ID.
- **PUT /medical-history/:id**: Update a medical history record.
- **DELETE /medical-history/:id**: Remove a medical history record.

## DTOs

### Create DTOs

- **CreateDoctorDto**: Defines the structure and validation for creating a doctor.
- **CreatePatientDto**: Defines the structure and validation for creating a patient.
- **CreateAppointmentDto**: Ensures that patient and doctor exist, and validates the date and reason.
- **CreatePrescriptionDto**: Ensures a prescription is linked to an appointment, with validation for medications, dosage, and duration.
- **CreateMedicalHistoryDto**: Defines the required fields for recording medical history.

### Update DTOs

- **UpdateDoctorDto**: Allows partial updates of doctor information.
- **UpdatePatientDto**: Allows partial updates of patient information.
- **UpdateAppointmentDto**: Allows partial updates of appointment details.
- **UpdatePrescriptionDto**: Allows partial updates of prescription details.
- **UpdateMedicalHistoryDto**: Allows partial updates of medical history records.

### Search and Filter DTOs

- **DoctorSearchDto**: Filters doctors by specialization, name, etc.
- **PatientSearchDto**: Filters patients by name, date of birth, etc.
- **AppointmentSearchDto**: Filters appointments by doctor, patient, date, etc.
- **PrescriptionSearchDto**: Filters prescriptions by doctor, patient, appointment, etc.
- **MedicalHistorySearchDto**: Filters medical history records by patient, doctor, diagnosis, etc.

## Models

- **Doctor Model**: Stores doctor details such as name, email, password (hashed), and specialization.
- **Patient Model**: Stores patient details such as name, email, password (hashed), date of birth, and address.
- **Appointment Model**: Links a patient and doctor, with a specific date, time, and reason for the appointment.
- **Prescription Model**: Links a prescription to an appointment and stores the medications, dosage, frequency, and duration.
- **Medical History Model**: Records patient medical history including diagnosis, treatment, and optional appointment reference.

## Validation

The system uses **DTOs** and **class-validator** for validation. Each DTO ensures that only valid data is passed to the database. For example:

- **patientId** and **doctorId** are validated to ensure they exist in the system.
- Dates are validated for correct format (e.g., YYYY-MM-DD for appointments).
- Prescriptions cannot be created without a valid appointment.

## Error Handling

The API handles errors gracefully, returning appropriate HTTP status codes and error messages. For instance:

- **404 Not Found**: Returned when a requested resource (doctor, patient, appointment, etc.) does not exist.
- **400 Bad Request**: Returned when validation fails for any DTO.
- **500 Internal Server Error**: Returned for unexpected server issues.
