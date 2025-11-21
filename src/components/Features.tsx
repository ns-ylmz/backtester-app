export default function Features() {
    const features = [
      {
        icon: '🧠',
        title: 'AI-Powered Optimization',
        description: 'Get intelligent strategy suggestions and parameter tuning using advanced AI algorithms'
      },
      {
        icon: '⚡', 
        title: 'Historical Backtesting',
        description: 'Test your strategies against historical data with real-time performance metrics and analytics'
      },
      {
        icon: '📊',
        title: 'Performance Analytics',
        description: 'Detailed reports with Sharpe ratio, maximum drawdown, and comprehensive risk analysis'
      }
    ];
  
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Powerful Trading Features
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Everything you need to build, test, and optimize trading strategies
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}