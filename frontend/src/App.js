import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000")  // Fetch data from Express backend
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error("Error:", error));
    }, []);

    return <h1>{message}</h1>;
}

export default App;
