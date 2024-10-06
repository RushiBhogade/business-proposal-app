import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import BusinessInput from "./BusinessInput";
import Signup from "./Signup";
import History from "./History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business-input" element={<BusinessInput />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
