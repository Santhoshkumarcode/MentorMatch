export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                <h1 className="text-4xl font-bold text-red-500">403</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-2">Unauthorized Access</h2>
                <p className="text-gray-500 mt-4">You don’t have permission to view this page.</p>
                <button 
                    onClick={() => window.location.href = "/"}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
    )
}