import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment } from "@/models/Appointment";
import { Doctor } from "@/models/Doctor";
import { User } from "@/models/User";
import { ContactMessage } from "@/models/ContactMessage";
import { getSessionFromCookies, isStaffRole } from "@/lib/auth/session";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function GET(_req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || !isStaffRole(session.role)) {
    return jsonError("Forbidden", 403);
  }

  await connectDB();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Parallel DB queries for speed
  const [
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    cancelledAppointments,
    completedAppointments,
    thisMonthAppointments,
    lastMonthAppointments,
    totalPatients,
    totalDoctors,
    unreadMessages,
    recentAppointments,
    appointmentsByMonth,
  ] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "pending" }),
    Appointment.countDocuments({ status: "confirmed" }),
    Appointment.countDocuments({ status: "cancelled" }),
    Appointment.countDocuments({ status: "completed" }),
    Appointment.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Appointment.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    }),
    User.countDocuments({ role: "patient" }),
    Doctor.countDocuments({ isActive: true }),
    ContactMessage.countDocuments({ isRead: false }),
    Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("patientName doctorName date status createdAt")
      .lean(),
    // Last 6 months breakdown
    Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const monthlyGrowth =
    lastMonthAppointments === 0
      ? 100
      : Math.round(
          ((thisMonthAppointments - lastMonthAppointments) /
            lastMonthAppointments) *
            100,
        );

  const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyChart = (appointmentsByMonth as Array<{
    _id: { year: number; month: number };
    count: number;
    completed: number;
    cancelled: number;
  }>).map((entry) => ({
    label: `${MONTH_NAMES[entry._id.month - 1]} ${entry._id.year}`,
    total: entry.count,
    completed: entry.completed,
    cancelled: entry.cancelled,
  }));

  return jsonSuccess({
    overview: {
      totalAppointments,
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      cancelled: cancelledAppointments,
      completed: completedAppointments,
      thisMonth: thisMonthAppointments,
      lastMonth: lastMonthAppointments,
      monthlyGrowth,
      totalPatients,
      activeDoctors: totalDoctors,
      unreadMessages,
    },
    monthlyChart,
    recentAppointments,
  });
}
