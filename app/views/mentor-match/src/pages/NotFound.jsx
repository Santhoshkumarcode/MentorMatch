import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                <h1 className="text-4xl font-bold text-gray-800">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-2">There's nothing to see here!</h2>
                <p className="text-gray-500 mt-4">Don't get lost! The link you followed isn't leading anywhere, sorry!</p>
                <Link 
                    to="/" 
                    className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
}
