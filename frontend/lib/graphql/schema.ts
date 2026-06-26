export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Doctor {
    id: ID!
    name: String!
    slug: String!
    role: String!
    specialty: String!
    experience: String!
    credentials: String!
    availability: String!
    languages: [String!]!
    bio: String!
    image: String!
    isActive: Boolean!
  }

  type Appointment {
    id: ID!
    patientName: String!
    patientEmail: String!
    patientPhone: String!
    doctorName: String!
    date: String!
    timeSlot: String!
    reason: String!
    status: String!
    createdAt: String!
  }

  type Service {
    id: ID!
    title: String!
    slug: String!
    description: String!
    icon: String!
    price: String!
    duration: String!
    category: String!
    isActive: Boolean!
  }

  type Blog {
    id: ID!
    title: String!
    slug: String!
    excerpt: String!
    authorName: String!
    coverImage: String!
    tags: [String!]!
    isPublished: Boolean!
    publishedAt: String
    createdAt: String!
  }

  type Testimonial {
    id: ID!
    patientName: String!
    rating: Int!
    review: String!
    treatment: String!
    isApproved: Boolean!
    createdAt: String!
  }

  type ContactMessage {
    id: ID!
    name: String!
    email: String!
    phone: String!
    subject: String!
    message: String!
    isRead: Boolean!
    createdAt: String!
  }

  type BookingResult {
    success: Boolean!
    message: String!
    appointmentId: String
  }

  type ContactResult {
    success: Boolean!
    message: String!
  }

  type Query {
    me: User
    doctors(activeOnly: Boolean): [Doctor!]!
    doctor(slug: String!): Doctor
    appointments: [Appointment!]!
    appointment(id: ID!): Appointment
    services(activeOnly: Boolean): [Service!]!
    service(slug: String!): Service
    blogs(publishedOnly: Boolean): [Blog!]!
    blog(slug: String!): Blog
    testimonials(approvedOnly: Boolean): [Testimonial!]!
    contactMessages: [ContactMessage!]!
  }

  input BookAppointmentInput {
    patientName: String!
    patientEmail: String!
    patientPhone: String!
    doctorName: String
    date: String!
    timeSlot: String
    reason: String
  }

  input SubmitContactInput {
    name: String!
    email: String!
    phone: String
    subject: String
    message: String!
  }

  input CreateServiceInput {
    title: String!
    slug: String!
    description: String!
    icon: String
    price: String
    duration: String
    category: String
  }

  input CreateDoctorInput {
    name: String!
    slug: String!
    role: String!
    specialty: String!
    experience: String!
    credentials: String!
    availability: String!
    languages: [String!]
    bio: String!
    image: String
  }

  type Mutation {
    bookAppointment(input: BookAppointmentInput!): BookingResult!
    submitContact(input: SubmitContactInput!): ContactResult!
    createService(input: CreateServiceInput!): Service!
    createDoctor(input: CreateDoctorInput!): Doctor!
    approveTestimonial(id: ID!): Testimonial!
    markMessageRead(id: ID!): ContactMessage!
  }
`;
