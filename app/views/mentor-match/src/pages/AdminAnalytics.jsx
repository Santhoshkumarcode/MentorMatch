import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Link } from "react-router-dom";

export default function AdminAnalytics() {
    const userData = [
        { name: "Mentees", value: 400 },
        { name: "Mentors", value: 200 },
        { name: "Admins", value: 50 }
    ];

    const revenueData = [
        { month: "Jan", revenue: 500 },
        { month: "Feb", revenue: 800 },
        { month: "Mar", revenue: 1200 },
        { month: "Apr", revenue: 1500 },
        { month: "May", revenue: 1800 }
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-950 text-white p-5">
                <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
                <nav className="space-y-4">
                    <Link to="/admin-dashboard" className="block px-4 py-2 rounded hover:bg-blue-700">Dashboard</Link>
                    <Link to="/admin-analytics" className="block px-4 py-2 rounded bg-blue-700">Analytics</Link>
                    <Link to="/manage-users" className="block px-4 py-2 rounded hover:bg-blue-700">Manage Users</Link>
                    <Link to="/manage-payments" className="block px-4 py-2 rounded hover:bg-bleu-700">Manage Payments</Link>
                </nav>
            </aside>

            {/* Main Content */}
            
            <div className="flex-1 p-6 bg-gray-100">
                <h2 className="text-2xl font-semibold mb-6">Admin Analytics Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Pie Chart for User Distribution */}
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h3 className="text-lg font-medium mb-4">User Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={userData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                                    {userData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart for Monthly Revenue */}
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
