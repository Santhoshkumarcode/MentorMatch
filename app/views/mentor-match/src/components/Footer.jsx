import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer class="bg-blue-950 text-white py-8 mt-10">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between items-center">
                    <div class="text-2xl font-bold">
                        <span>MentorMatch</span>
                    </div>
                    <div class="flex space-x-6">
                        <Link to="/" class="hover:text-gray-400">Home</Link>
                        <Link to="/" class="hover:text-gray-400">About</Link>
                        <Link to="/" class="hover:text-gray-400">Services</Link>
                        <Link to="/" class="hover:text-gray-400">Contact</Link>
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <p>&copy; 2025 MentorMatch. All rights reserved.</p>
                </div>
            </div>
        </footer>

    )
}