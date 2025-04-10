import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-4">Error</h1>
      <p className="text-red-600 mb-4">
        {error?.statusText || error?.message || "An unexpected error occurred."}
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        Return to homepage
      </Link>
    </div>
  );
}