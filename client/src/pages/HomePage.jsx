import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeletons';

const categories = [
  { id: 'coffee', label: 'Coffee', icon: '☕', desc: 'Espresso, Latte & more' },
  { id: 'cold-drinks', label: 'Cold Drinks', icon: '🧊', desc: 'Iced & refreshing' },
  { id: 'tea', label: 'Tea', icon: '🍵', desc: 'Hot & herbal' },
  { id: 'sandwiches', label: 'Sandwiches', icon: '🥪', desc: 'Fresh & hearty' },
  { id: 'cakes', label: 'Cakes', icon: '🎂', desc: 'Decadent slices' },
  { id: 'pastries', label: 'Pastries', icon: '🥐', desc: 'Fresh baked daily' },
  { id: 'cookies', label: 'Cookies', icon: '🍪', desc: 'Warm & chewy' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳', desc: 'Rise & shine' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'Best cappuccino in the city. The atmosphere is cozy and the staff are incredibly friendly. My morning ritual!', rating: 5, avatar: 'S' },
  { name: 'James T.', text: "The tiramisu cake is absolutely divine. Pairs perfectly with their cold brew. I come here every weekend.", rating: 5, avatar: 'J' },
  { name: 'Priya K.', text: 'The matcha latte is made with genuine ceremonial grade matcha. Finally a café that takes tea seriously!', rating: 5, avatar: 'P' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/products?featured=true&limit=8');
        setFeatured(data.products);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-espresso">
        <div className="absolute inset-0 bg-gradient-to-br from-espresso via-mocha to-brew-900 opacity-95" />
        <div
          className="absolute inset-0 opacity-10 bg-center bg-cover"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600)' }}
        />
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-brew-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-brew-500/10 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-brew-800/60 border border-brew-700 text-brew-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-brew-400 rounded-full animate-pulse" />
                Now Open · 7am – 9pm Daily
              </div>
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-cream-50 leading-tight mb-6">
                Where Every Cup
                <span className="block text-brew-400 font-accent text-6xl lg:text-7xl font-normal italic mt-1">Tells a Story</span>
              </h1>
              <p className="text-cream-300 text-lg leading-relaxed mb-8 max-w-lg">
                Hand-crafted beverages, freshly baked pastries, and a warm atmosphere. Your perfect escape from the everyday.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
                  Explore Menu
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/menu?category=coffee" className="btn-outline border-brew-500 text-brew-400 hover:bg-brew-500 text-base px-8 py-3.5">
                  Our Coffees
                </Link>
              </div>
              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-brew-800">
                {[['20+', 'Menu Items'], ['500+', 'Happy Customers'], ['4.9★', 'Average Rating']].map(([num, label]) => (
                  <div key={label}>
                    <div className="font-display text-2xl font-bold text-brew-400">{num}</div>
                    <div className="text-xs text-cream-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image collage */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px]">
                <img src="https://images.unsplash.com/photo-1534778101976-62847782c213?w=500" alt="Cappuccino"
                  className="absolute top-0 right-0 w-64 h-64 object-cover rounded-2xl shadow-2xl" />
                <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" alt="Pastry"
                  className="absolute bottom-0 right-20 w-52 h-52 object-cover rounded-2xl shadow-2xl" />
                <img src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400" alt="Cake"
                  className="absolute top-24 left-0 w-48 h-48 object-cover rounded-2xl shadow-2xl" />
                <div className="absolute bottom-20 left-0 bg-brew-600 text-white rounded-2xl p-4 shadow-xl">
                  <div className="font-accent text-2xl">Fresh daily</div>
                  <div className="text-xs text-brew-200 mt-1">Baked from scratch every morning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Browse by Category</h2>
            <p className="text-brew-500 mt-2">Find exactly what you're craving</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/menu?category=${cat.id}`}
                className="group flex flex-col items-center p-4 rounded-2xl bg-cream-50 hover:bg-brew-600 border border-cream-200 hover:border-brew-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-bold text-espresso group-hover:text-white transition-colors text-center">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-title">Staff Picks</h2>
              <p className="text-brew-500 mt-2">Our most loved items, hand-selected</p>
            </div>
            <Link to="/menu" className="btn-outline text-sm hidden sm:block">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/menu" className="btn-outline">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">The Brew Haven Difference</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🌱', title: 'Ethically Sourced', desc: 'Every bean is traceable to its farm. We partner with sustainable cooperatives across Colombia, Ethiopia, and Guatemala.' },
              { icon: '👨‍🍳', title: 'Freshly Crafted', desc: 'Our pastries, sandwiches, and cakes are baked and assembled fresh each morning by our in-house team of skilled bakers.' },
              { icon: '❤️', title: 'Community First', desc: "We donate 5% of profits to local community programs and host monthly events to bring people together." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl bg-cream-50 hover:bg-brew-50 transition-colors group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
                <h3 className="font-display text-xl font-bold text-espresso mb-3">{title}</h3>
                <p className="text-brew-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-espresso">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-cream-100">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, text, rating, avatar }) => (
              <div key={name} className="bg-brew-900/50 border border-brew-800 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => <span key={i} className="text-brew-400 text-sm">★</span>)}
                </div>
                <p className="text-cream-300 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brew-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{avatar}</div>
                  <div>
                    <div className="text-cream-200 font-semibold text-sm">{name}</div>
                    <div className="text-brew-500 text-xs">Verified Customer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brew-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-brew-200 mb-8 text-lg">Browse our full menu and enjoy café-quality drinks and food delivered to your door.</p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-white text-brew-700 hover:bg-cream-100 font-bold px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 text-base">
            Shop the Full Menu
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
