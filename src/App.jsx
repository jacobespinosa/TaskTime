import { Routes, Route, BrowserRouter } from "react-router-dom";
import TaskTimeApp from "./pages/TaskTimeApp";

import { useEffect } from "react";

function App() {
    useEffect(() => {
        async function checkBackend() {
            try {
                const response = await fetch("http://localhost:3001/api/health");

                if (!response.ok) {
                    throw new Error("Failed to fetch data.");
                }

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error)
            }
        }
        checkBackend();
    }, []); 

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<TaskTimeApp />} />
                <Route path="/demo/*" element={<TaskTimeApp demoMode={true} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
