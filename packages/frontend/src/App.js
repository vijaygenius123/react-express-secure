import {BrowserRouter as Router} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import {FetchContext} from "./context/FetchContext";

function App() {
    return (
        <Router>
            <AuthProvider>
                <FetchContext>
                    <div className="bg-gray-100">
                        <AppRoutes />
                    </div>
                </FetchContext>
            </AuthProvider>
        </Router>
    );
}

export default App;
