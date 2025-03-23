import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5005/test')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <h1>React + Express + MySQL Test</h1>
      {data ? (
        <p>{data.message} | Server Time: {data.serverTime}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
