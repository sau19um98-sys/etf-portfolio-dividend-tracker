import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          ETF Dashboard Test
        </h1>
        <div className="space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            If you can see this, React and TailwindCSS are working!
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Count: {count}
          </button>
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Next Steps:
            </h2>
            <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
              <li>✅ React is working</li>
              <li>✅ TailwindCSS is working</li>
              <li>✅ Dark mode classes are working</li>
              <li>🔄 Loading full dashboard...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
