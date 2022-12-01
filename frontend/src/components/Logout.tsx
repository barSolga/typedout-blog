import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/auth.slice';
import Modal from './Modals/ConfirmModal';

const Logout = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<any>()
    const userData = JSON.parse(localStorage.getItem('user') as string);


    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
        setShowModal(false);
    }    

    return (
        <div>
            {
                showModal 
                && 
                <Modal 
                    openState={setShowModal}
                    onLogout={onLogout} 
                    text={"You are attempting to log out. Click button below if you are sure about it."} 
                />
            }
            <button className="btn btn-primary" onClick={() => setShowModal(!showModal)}>
                Logout
            </button>
        </div>
    )
}

export default Logout