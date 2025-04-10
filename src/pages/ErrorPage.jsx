import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-xl mb-6">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-600 mb-6">
          {error?.statusText || error?.message || "Unknown error"}
        </p>
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}