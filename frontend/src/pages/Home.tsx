import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import Navbar from '../components/Navbar';
import Main from './Main';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: any) => state.auth);

    useEffect(() => {

        // check if user logged in
        if (!user) navigate('/auth');

    }, [user])
   
    return (
        <div className="container">
            <Navbar />
            <main className='wrapper'>
                <Routes>
                    <Route path='/' element={<Main />} />
                </Routes>
            </main>
        </div>
    )
}

export default Home