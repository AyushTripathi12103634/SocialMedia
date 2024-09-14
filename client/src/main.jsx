import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.Server_URL || "http://localhost:5000";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
