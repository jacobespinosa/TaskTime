import { Routes, Route, BrowserRouter } from "react-router-dom";
import TaskTimeApp from "./pages/TaskTimeApp";

function App() {
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
