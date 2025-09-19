import React, { useState, useEffect } from 'react';

const NOTIFICATION_TYPES = {
  exhibitions: { icon: '🎨', color: 'purple' },
  markets: { icon: '🛒', color: 'green' },
  competitions: { icon: '🏆', color: 'yellow' },
  workshops: { icon: '📚', color: 'blue' },
  networking: { icon: '🤝', color: 'pink' }
};

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Local Art Fair — Downtown Gallery',
    type: 'exhibitions',
    date: 'Saturday, 2:00 PM',
    location: 'City Art Center',
    description: 'Annual showcase featuring emerging local artists',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Gallery Call: Open Submissions',
    type: 'exhibitions',
    date: 'Deadline: Next Friday',
    location: 'Modern Art Gallery',
    description: 'Accepting submissions for contemporary art exhibition',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Online Art Market Live',
    type: 'markets',
    date: 'Today, 6:00 PM',
    location: 'Virtual Platform',
    description: 'Live online marketplace with instant bidding',
    priority: 'high'
  },
  {
    id: 4,
    title: 'Digital Art Workshop',
    type: 'workshops',
    date: 'Monday, 10:00 AM',
    location: 'Creative Hub',
    description: 'Learn advanced digital art techniques',
    priority: 'low'
  },
  {
    id: 5,
    title: 'Artist Networking Mixer',
    type: 'networking',
    date: 'Thursday, 7:00 PM',
    location: 'Café Artisan',
    description: 'Connect with fellow artists and collectors',
    priority: 'medium'
  },
  {
    id: 6,
    title: 'Photography Competition',
    type: 'competitions',
    date: 'Submissions due: Dec 15',
    location: 'Online',
    description: 'Annual photography contest with cash prizes',
    priority: 'medium'
  }
];

export default function Notifications() {
  const [subscribed, setSubscribed] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['exhibitions', 'markets']);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (subscribed) {
      const filtered = MOCK_EVENTS.filter(event => 
        selectedTypes.includes(event.type)
      );
      setFilteredEvents(filtered);
      
      // Simulate real-time notifications
      if (filtered.length > 0) {
        const timer = setTimeout(() => {
          setNotifications(prev => [...prev, {
            id: Date.now(),
            message: `New ${filtered[0].type} opportunity available!`,
            timestamp: new Date(),
            type: 'success'
          }]);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setFilteredEvents([]);
      setNotifications([]);
    }
  }, [subscribed, selectedTypes]);

  const toggleSubscription = () => {
    setSubscribed(!subscribed);
    if (!subscribed) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: 'Successfully subscribed to notifications!',
        timestamp: new Date(),
        type: 'success'
      }]);
    }
  };

  const toggleEventType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-700',
      green: 'bg-green-100 text-green-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      blue: 'bg-blue-100 text-blue-700',
      pink: 'bg-pink-100 text-pink-700'
    };
    return colors[NOTIFICATION_TYPES[type]?.color] || 'bg-gray-100 text-gray-700';
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            🔔 Exhibition & Market Alerts
          </h2>
          <p className="text-indigo-100 mt-1">
            Stay updated with local exhibitions, markets, and opportunities
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Live Notifications */}
          {notifications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">🔔 Live Notifications</h3>
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg animate-fadeIn"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-green-600">✅</span>
                    <span className="text-green-800 text-sm">{notification.message}</span>
                  </div>
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Subscription Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex gap-3">
                <button
                  onClick={toggleSubscription}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    subscribed 
                      ? 'bg-green-500 text-white shadow-lg hover:bg-green-600' 
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {subscribed ? (
                    <>
                      <span>🔔</span> Subscribed
                    </>
                  ) : (
                    <>
                      <span>🔕</span> Subscribe
                    </>
                  )}
                </button>
                
                {subscribed && (
                  <button
                    onClick={() => setSubscribed(false)}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Unsubscribe
                  </button>
                )}
              </div>

              <div className={`text-sm font-medium flex items-center gap-2 ${
                subscribed ? 'text-green-600' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  subscribed ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                {subscribed ? 'Active - We will notify you!' : 'Not subscribed'}
              </div>
            </div>

            {/* Event Type Filters */}
            {subscribed && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Select notification types:</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(NOTIFICATION_TYPES).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => toggleEventType(type)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 capitalize text-sm font-medium ${
                        selectedTypes.includes(type)
                          ? `border-${config.color}-400 ${getTypeColor(type)}`
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{config.icon}</span>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Events List */}
          {subscribed && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  📅 Upcoming Events ({filteredEvents.length})
                </h3>
                {filteredEvents.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Showing {selectedTypes.length} categories
                  </div>
                )}
              </div>

              {filteredEvents.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredEvents.map(event => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getPriorityColor(event.priority)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl">{NOTIFICATION_TYPES[event.type].icon}</span>
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{event.location}</span>
                            </div>
                            <p className="text-gray-700 mt-2">{event.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            event.priority === 'high' ? 'bg-red-100 text-red-700' :
                            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {event.priority} priority
                          </span>
                          
                          <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>No events found for selected categories</p>
                  <p className="text-sm">Try selecting different notification types</p>
                </div>
              )}
            </div>
          )}

          {!subscribed && (
            <div className="text-center py-12 text-gray-500 space-y-4">
              <div className="text-6xl">🔔</div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Stay in the loop!</h3>
                <p>Subscribe to receive notifications about exhibitions, markets, and opportunities in your area.</p>
              </div>
            </div>
          )}

          {/* Information Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span>ℹ️</span> About Notifications
            </h4>
            <div className="text-blue-700 text-sm space-y-2">
              <p>• Get real-time updates about local art exhibitions and markets</p>
              <p>• Filter notifications by event type to match your interests</p>
              <p>• Receive priority alerts for high-demand opportunities</p>
              <p>• Stay connected with the local art community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}