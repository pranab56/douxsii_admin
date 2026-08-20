import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="grid h-screen place-content-center bg-gray-50 px-4 text-center">
            <div className="space-y-4">
                <h1 className="text-6xl font-black text-gray-200">404</h1>
                <p className="text-xl font-bold tracking-tight text-gray-700 sm:text-2xl">Page Not Found</p>
                <p className="text-gray-400 text-sm">We couldn't find the page you were looking for.</p>
                <Link
                    to="/"
                    className="inline-block mt-4 rounded-lg bg-[#286a25] px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity focus:outline-none"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
