import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="font-display text-9xl font-bold text-brew-200 mb-2">404</div>
        <div className="text-6xl mb-6">☕</div>
        <h1 className="font-display text-3xl font-bold text-espresso mb-3">Oops! Page Not Found</h1>
        <p className="text-brew-500 mb-8 text-lg">
          Looks like this page went missing, just like the last cup of our Monday cold brew. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary text-base px-8 py-3.5">Go Home</Link>
          <Link to="/menu" className="btn-outline text-base px-8 py-3.5">Browse Menu</Link>
        </div>
      </div>
    </div>
  );
}
