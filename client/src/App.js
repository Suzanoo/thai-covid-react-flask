import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';

function App() {
  return (
    <>
      <Router>
        <div className="container">
          {/* {<Nav />} */}
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
