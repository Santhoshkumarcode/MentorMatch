import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMentor, isVerified, fetchAllMentors } from "../redux/slices/mentorSlice";
import { getAllMentee } from "../redux/slices/menteeSlice";
import { allUsers } from "../redux/slices/userSlice";
import moment from "moment";
import { getAllPayments } from "../redux/slices/paymentSlice";
import { parseISO, format } from "date-fns";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
    const dispatch = useDispatch();

    const mentors = useSelector((state) => state?.mentors?.data);
    const allMentees = useSelector((state) => state?.mentees?.allMentees);
    const users = useSelector((state) => state?.users?.allUsers);
    const allPayments = useSelector((state) => state?.payments)
    const adminFeesByMonth = Array(12).fill(0);

    allPayments.allPayments.forEach((payment) => {
        if (payment.createdAt && payment.adminFee !== undefined) {
            const monthIndex = new Date(payment.createdAt).getMonth();
            adminFeesByMonth[monthIndex] += payment.adminFee;
        }
    });

    const totalRevenue = allPayments.allPayments.reduce((total, payment) => {
        return total + (payment.adminFee || 0)
    }, 0)

    const [currentPage, setCurrentPage] = useState("application");

    const handleAccept = (userId) => {
        if (window.confirm("Are you sure you want to allow this mentor?")) {
            dispatch(isVerified({ userId }));
        }
    };

    const handleReject = (userId) => {
        if (window.confirm("Are you sure you want to delete this mentor?")) {
            dispatch(deleteMentor({ userId }));
        }
    };

    useEffect(() => {
        dispatch(allUsers());
        dispatch(getAllMentee());
        dispatch(fetchAllMentors());
        dispatch(getAllPayments())
    }, [dispatch]);

    const menteeCount = allMentees?.length || 0;
    const mentorCount = mentors?.length || 0;
    const total = menteeCount + mentorCount;

    // Pie Chart Data (Mentee vs Mentor)
    const pieData = {
        labels: ["Mentees", "Mentors"],
        datasets: [
            {
                data: [menteeCount, mentorCount],
                backgroundColor: ["#4F46E5", "#10B981"],
                hoverBackgroundColor: ["#3B3CC4", "#0D9C6E"],
            },
        ],
    };

    // Bar Chart Data (Users per Month)
    const getUsersPerMonth = () => {
        if (!users || !Array.isArray(users)) return [];

        const months = Array(12).fill(0);
        users.forEach((user) => {
            if (user.createdAt) {
                const monthIndex = moment(user.createdAt).month();
                months[monthIndex] += 1;
            }
        });

        return {
            labels: months.map((_, index) => moment().month(index).format("MMM")),
            datasets: [
                {
                    label: "Users",
                    data: months,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };
    
    const revenueData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Revenue (₹)",
                data: adminFeesByMonth,
                fill: false,
                borderColor: "#4F46E5",
                backgroundColor: "#4F46E5", 
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-8 border-b border-gray-300 mb-10 shadow-md">
                {["application", "analytics", "revenue"].map((page) => (
                    <p
                        key={page}
                        className={`text-lg font-medium px-4 py-4 cursor-pointer
                            ${currentPage === page
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-400"
                            }`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page === "application" ? "Applications" : page === "analytics" ? "Analytics" : "Revenue"}
                    </p>
                ))}
            </div>

            {/* Application Page */}
            {currentPage === "application" ? (
                <div className="grid lg:grid-cols-2 gap-8 p-6">
                    {mentors?.filter((ele) => !ele.isVerified)?.map((mentor) => (
                        <div key={mentor._id} className="bg-gray-50 p-4 shadow-md border border-gray-300 rounded-lg">
                            <p className="text-gray-700 m-2 mb-4">
                                <span className="text-3xl font-semibold">{mentor?.userId?.username}</span>
                            </p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Email:</span> {mentor?.userId?.email}</p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Company Name:</span> {mentor?.companyName}</p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Job Title:</span> {mentor?.jobTitle}</p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Phone Number:</span> {mentor?.phoneNumber}</p>
                            <p className="text-blue-600 underline text-lg">
                                <a href={mentor?.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </p>
                            <p className="text-blue-600 underline text-lg">
                                <a href={mentor?.personalWebsite} target="_blank" rel="noopener noreferrer">Personal Website</a>
                            </p>
                            <br />
                            <button className="bg-green-500 px-10 py-2 rounded-xs hover:text-white mr-5 hover:cursor-pointer" onClick={() => handleAccept(mentor?.userId?._id)}>Accept</button>
                            <button className="bg-red-500 px-10 py-2 rounded-xs hover:text-white hover:cursor-pointer" onClick={() => handleReject(mentor?.userId?._id)}>Reject</button>
                        </div>
                    ))}
                </div>
            ) : currentPage === "analytics" ? (
                <div>
                    {/* Cards for Mentees, Mentors, and Total Users */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col items-center">
                            <p className="text-lg font-semibold text-gray-600">Total Mentees</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{menteeCount}</p>
                        </div>
                        <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col items-center">
                            <p className="text-lg font-semibold text-gray-600">Total Mentors</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{mentorCount}</p>
                        </div>
                        <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col items-center">
                            <p className="text-lg font-semibold text-gray-600">Total Users</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{total}</p>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="flex justify-center items-center w-full">
                        <div className="w-80 h-80 flex justify-center items-center">
                            <Pie data={pieData} />
                        </div>
                    </div>


                    {/* Bar Chart */}
                    <h2 className="text-xl font-semibold text-gray-700 my-4 text-center">Monthly User Growth</h2>
                    <div className="flex justify-center items-center w-full">
                        <div className="w-[800px] h-[400px] flex justify-center items-center">
                            <Bar data={getUsersPerMonth()} />
                        </div>
                    </div>

                </div>
            ) : currentPage === "revenue" ? (
                <div>
                    <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col items-center">
                        <p className="text-lg font-semibold text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">₹ {totalRevenue}</p>
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <div className="w-[800px] h-[400px] flex justify-center items-center">
                            <Line data={revenueData} />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
