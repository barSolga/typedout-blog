import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Pages
import Signer from './pages/Signer';
import Home from './pages/Home';


function App() {
    return (
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path='*' element={<Home />} />
            <Route path='/auth' element={<Signer />} />
          </Routes>
        </Router>
      </Provider>
    );
}

export default App;
