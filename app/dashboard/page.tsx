'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Spinner, PageLoader } from '@/components/Loaders'
import Link from 'next/link'

interface TrackedProduct {
  _id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
}

const DashboardContent = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        
        // Verify token and get user info
        const authResponse = await fetch('/api/auth/check', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (authResponse.ok) {
          const authData = await authResponse.json();
          setUser({ email: authData.email });
        }

        // Load user's tracked products (implementation coming later)
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem('auth-token');
    
    // Clear cookie via API
    await fetch('/api/auth/logout', {
      method: 'POST'
    });
    
    router.push('/');
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10xl mx-auto px-6 md:px-20 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Price<span className="text-teal-500">Fries</span> Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.email}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-teal-500 mb-2">0</div>
            <p className="text-gray-600">Products Tracked</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-green-500 mb-2">$0</div>
            <p className="text-gray-600">Total Savings</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-blue-500 mb-2">0</div>
            <p className="text-gray-600">Price Alerts</p>
          </div>
        </div>

        {/* Tracked Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Your Tracked Products</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products tracked yet.</p>
              <Link 
                href="/" 
                className="inline-block px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
              >
                Start Tracking
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  <img src={product.image} alt={product.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{product.title}</h3>
                    <p className="text-teal-500 font-bold mt-2">
                      {product.currency} {product.currentPrice}
                    </p>
                    <p className="text-gray-400 line-through text-sm">
                      {product.currency} {product.originalPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default Dashboard;
