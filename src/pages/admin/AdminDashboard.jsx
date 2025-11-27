import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Calendar, MessageSquare,
  Heart, Mail, Coffee, ArrowUp, ArrowDown, Eye
} from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalVolunteers: 0,
    totalMessages: 0,
    totalNewsletterSubscribers: 0,
    totalSupportRequests: 0,
    totalMenuItems: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const eventsHook = useFirestore('events');
  const volunteersHook = useFirestore('volunteers');
  const messagesHook = useFirestore('contactMessages');
  const newsletterHook = useFirestore('newsletter');
  const supportHook = useFirestore('supportRequests');
  const menuHook = useFirestore('menuItems');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Fetch counts from all collections
    const [events, volunteers, messages, newsletter, support, menu] = await Promise.all([
      eventsHook.getDocuments(),
      volunteersHook.getDocuments(),
      messagesHook.getDocuments(),
      newsletterHook.getDocuments(),
      supportHook.getDocuments(),
      menuHook.getDocuments()
    ]);

    setStats({
      totalEvents: events.data?.length || 0,
      totalVolunteers: volunteers.data?.length || 0,
      totalMessages: messages.data?.length || 0,
      totalNewsletterSubscribers: newsletter.data?.length || 0,
      totalSupportRequests: support.data?.length || 0,
      totalMenuItems: menu.data?.length || 0
    });

    // Combine recent activity
    const activities = [];
    
    if (messages.data) {
      messages.data.slice(0, 3).forEach(msg => {
        activities.push({
          type: 'message',
          title: `New message from ${msg.name}`,
          time: msg.createdAt,
          icon: MessageSquare
        });
      });
    }

    if (volunteers.data) {
      volunteers.data.slice(0, 2).forEach(vol => {
        activities.push({
          type: 'volunteer',
          title: `New volunteer application: ${vol.name}`,
          time: vol.createdAt,
          icon: Users
        });
      });
    }

    setRecentActivity(activities.sort((a, b) => b.time - a.time).slice(0, 5));
    setLoading(false);
  };

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Volunteers',
      value: stats.totalVolunteers,
      icon: Users,
      color: 'bg-green-500',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Contact Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-purple-500',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.totalNewsletterSubscribers,
      icon: Mail,
      color: 'bg-orange-500',
      trend: '+20%',
      trendUp: true
    },
    {
      title: 'Support Requests',
      value: stats.totalSupportRequests,
      icon: Heart,
      color: 'bg-pink-500',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Menu Items',
      value: stats.totalMenuItems,
      icon: Coffee,
      color: 'bg-amber-500',
      trend: '0%',
      trendUp: false
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
          <p className="text-neutral-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800">{stat.value}</h3>
              <p className="text-sm text-neutral-600 mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{activity.title}</p>
                    <p className="text-xs text-neutral-500">
                      {activity.time?.toDate ? activity.time.toDate().toLocaleString() : 'Just now'}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
            <Calendar className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Add New Event</span>
          </button>
          <button className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
            <Coffee className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Add Menu Item</span>
          </button>
          <button className="p-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">
            <MessageSquare className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">View Messages</span>
          </button>
          <button className="p-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Manage Volunteers</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
