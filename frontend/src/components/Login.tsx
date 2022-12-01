import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login, reset } from '../features/auth/auth.slice';
import Loader from './Loader';

const Login = () => {
    // Variables
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const [errorMessage, setErrorMessage] = useState('');
    const [passVisibility, setPassVisibility] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state: any) => state.auth
    );
        
    useEffect(() => {
        if (isError) {
            // console.error(message);
            setErrorMessage(message);
        };
    
        if (isSuccess || user) navigate('/')
    
        dispatch(reset())
      }, [user, isError, isSuccess, message, navigate, dispatch])
    
    const onChange = (e: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: any) => {
        e.preventDefault()

        
        const userData = {
            email,
            password,
        }
        
        dispatch(login(userData))
    };

    return (
        <Form className='form' onSubmit={onSubmit}>
            <div className="form__header">
                <h2>Welcome back!</h2>
                <p>What is on your mind today?</p>
            </div>
            <div className="form__group">
                <input name="email" type="text" className="form__input" autoComplete='off' placeholder='' value={email} onChange={onChange}/>
                <label htmlFor="email" className="form__label">Email</label>
            </div>
            <div className="form__group">
                <input name="password" type={passVisibility ? 'text' : 'password'} className="form__input" autoComplete='off' placeholder='' value={password} onChange={onChange}/>
                <label htmlFor="password" className="form__label">Password</label>
                <button className='btn form__showpass' type='button' onClick={() => setPassVisibility(!passVisibility)} >
                {
                    passVisibility ? <i className='bx bxs-show' ></i> : <i className='bx bxs-hide' ></i>
                }
                </button>
            </div>
            <div className="form__group form__group-submit">
                {
                    !isLoading ? <button className="btn btn-primary form__submit" type="submit" >Sign In</ button> : <Loader />
                }
            </div>
            {
                errorMessage && <div className="alert alert-error"><p className="alert-error__text">{errorMessage}</p></div>
            }
        </Form>
    );
}

const Form = styled.form`
    


`

export default Login