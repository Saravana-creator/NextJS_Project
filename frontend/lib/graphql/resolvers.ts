import { connectDB } from "@/lib/db/connect";
import { Doctor } from "@/models/Doctor";
import { Appointment } from "@/models/Appointment";
import { Service } from "@/models/Service";
import { Blog } from "@/models/Blog";
import { Testimonial } from "@/models/Testimonial";
import { ContactMessage } from "@/models/ContactMessage";
import { User } from "@/models/User";
import type { GraphQLContext } from "./context";

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) return null;
      await connectDB();
      const user = await User.findById(context.user.userId);
      if (!user) return null;
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },

    doctors: async (_: unknown, args: { activeOnly?: boolean }) => {
      await connectDB();
      const filter = args.activeOnly ? { isActive: true } : {};
      const docs = await Doctor.find(filter).sort({ createdAt: -1 });
      return docs.map((d) => ({ ...d.toObject(), id: d._id.toString() }));
    },

    doctor: async (_: unknown, args: { slug: string }) => {
      await connectDB();
      const doc = await Doctor.findOne({ slug: args.slug });
      if (!doc) return null;
      return { ...doc.toObject(), id: doc._id.toString() };
    },

    appointments: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      let filter = {};
      if (context.user.role === "admin") {
        filter = {};
      } else if (context.user.role === "doctor") {
        filter = { doctorName: context.user.name ?? "" }; // doctor sees only own appointments
      } else {
        filter = { patientEmail: context.user.email };
      }
      const appts = await Appointment.find(filter).sort({ createdAt: -1 });
      return appts.map((a) => ({
        ...a.toObject(),
        id: a._id.toString(),
        createdAt: a.createdAt?.toISOString?.() ?? "",
      }));
    },

    appointment: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const appt = await Appointment.findById(args.id);
      if (!appt) return null;
      return { ...appt.toObject(), id: appt._id.toString() };
    },

    services: async (_: unknown, args: { activeOnly?: boolean }) => {
      await connectDB();
      const filter = args.activeOnly ? { isActive: true } : {};
      const svcs = await Service.find(filter).sort({ title: 1 });
      return svcs.map((s) => ({ ...s.toObject(), id: s._id.toString() }));
    },

    service: async (_: unknown, args: { slug: string }) => {
      await connectDB();
      const svc = await Service.findOne({ slug: args.slug });
      if (!svc) return null;
      return { ...svc.toObject(), id: svc._id.toString() };
    },

    blogs: async (_: unknown, args: { publishedOnly?: boolean }) => {
      await connectDB();
      const filter = args.publishedOnly ? { isPublished: true } : {};
      const blogs = await Blog.find(filter).sort({ createdAt: -1 });
      return blogs.map((b) => ({
        ...b.toObject(),
        id: b._id.toString(),
        createdAt: b.createdAt?.toISOString?.() ?? "",
        publishedAt: b.publishedAt?.toISOString?.() ?? null,
      }));
    },

    blog: async (_: unknown, args: { slug: string }) => {
      await connectDB();
      const blog = await Blog.findOne({ slug: args.slug, isPublished: true });
      if (!blog) return null;
      return {
        ...blog.toObject(),
        id: blog._id.toString(),
        createdAt: blog.createdAt?.toISOString?.() ?? "",
      };
    },

    testimonials: async (_: unknown, args: { approvedOnly?: boolean }) => {
      await connectDB();
      const filter = args.approvedOnly ? { isApproved: true } : {};
      const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
      return testimonials.map((t) => ({
        ...t.toObject(),
        id: t._id.toString(),
        createdAt: t.createdAt?.toISOString?.() ?? "",
      }));
    },

    contactMessages: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("Admin access required");
      }
      await connectDB();
      const msgs = await ContactMessage.find({}).sort({ createdAt: -1 });
      return msgs.map((m) => ({
        ...m.toObject(),
        id: m._id.toString(),
        createdAt: m.createdAt?.toISOString?.() ?? "",
      }));
    },
  },

  Mutation: {
    bookAppointment: async (
      _: unknown,
      args: {
        input: {
          patientName: string;
          patientEmail: string;
          patientPhone: string;
          doctorName?: string;
          date: string;
          timeSlot?: string;
          reason?: string;
        };
      },
    ) => {
      await connectDB();
      const appt = await Appointment.create({
        patientName: args.input.patientName,
        patientEmail: args.input.patientEmail,
        patientPhone: args.input.patientPhone,
        doctorName: args.input.doctorName ?? "",
        date: args.input.date,
        timeSlot: args.input.timeSlot ?? "",
        reason: args.input.reason ?? "",
        status: "pending",
      });
      return {
        success: true,
        message: "Appointment booked successfully. We will confirm shortly.",
        appointmentId: appt._id.toString(),
      };
    },

    submitContact: async (
      _: unknown,
      args: {
        input: {
          name: string;
          email: string;
          phone?: string;
          subject?: string;
          message: string;
        };
      },
    ) => {
      await connectDB();
      await ContactMessage.create({
        name: args.input.name,
        email: args.input.email,
        phone: args.input.phone ?? "",
        subject: args.input.subject ?? "General Inquiry",
        message: args.input.message,
      });
      return { success: true, message: "Your message has been received. We'll get back to you soon." };
    },

    createService: async (
      _: unknown,
      args: {
        input: {
          title: string;
          slug: string;
          description: string;
          icon?: string;
          price?: string;
          duration?: string;
          category?: string;
        };
      },
      context: GraphQLContext,
    ) => {
      if (!context.user || !["admin", "doctor"].includes(context.user.role)) {
        throw new Error("Admin access required");
      }
      await connectDB();
      const svc = await Service.create({
        title: args.input.title,
        slug: args.input.slug,
        description: args.input.description,
        icon: args.input.icon ?? "tooth",
        price: args.input.price ?? "",
        duration: args.input.duration ?? "",
        category: (args.input.category ?? "general") as "general" | "cosmetic" | "orthodontic" | "surgical" | "pediatric" | "preventive",
      });
      return { ...svc.toObject(), id: svc._id.toString() };
    },

    createDoctor: async (
      _: unknown,
      args: {
        input: {
          name: string;
          slug: string;
          role: string;
          specialty: string;
          experience: string;
          credentials: string;
          availability: string;
          languages?: string[];
          bio: string;
          image?: string;
        };
      },
      context: GraphQLContext,
    ) => {
      if (!context.user || !["admin", "doctor"].includes(context.user.role)) {
        throw new Error("Admin access required");
      }
      await connectDB();
      const doc = await Doctor.create({
        ...args.input,
        languages: args.input.languages ?? [],
        image: args.input.image ?? "",
      });
      return { ...doc.toObject(), id: doc._id.toString() };
    },

    approveTestimonial: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      if (!context.user || !["admin", "doctor"].includes(context.user.role)) {
        throw new Error("Admin access required");
      }
      await connectDB();
      const t = await Testimonial.findByIdAndUpdate(
        args.id,
        { isApproved: true },
        { new: true },
      );
      if (!t) throw new Error("Testimonial not found");
      return { ...t.toObject(), id: t._id.toString(), createdAt: t.createdAt?.toISOString?.() ?? "" };
    },

    markMessageRead: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      if (!context.user || !["admin", "doctor"].includes(context.user.role)) {
        throw new Error("Admin access required");
      }
      await connectDB();
      const msg = await ContactMessage.findByIdAndUpdate(
        args.id,
        { isRead: true },
        { new: true },
      );
      if (!msg) throw new Error("Message not found");
      return { ...msg.toObject(), id: msg._id.toString(), createdAt: msg.createdAt?.toISOString?.() ?? "" };
    },
  },
};
