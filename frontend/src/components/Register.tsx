import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { register, reset } from '../features/auth/auth.slice';
import Loader from './Loader';

const Register = () => {
    // Variables
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();

    const [errorMessage, setErrorMessage] = useState('');
    const [pass1Visibility, setPass1Visibility] = useState(false);
    const [pass2Visibility, setPass2Visibility] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        role_id: 3
    });

    const { username, email, password, password2, role_id } = formData;
    
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
            username,
            email,
            password,
            password2,
            role_id
        }
        
        dispatch(register(userData))
    };

    return (
        <Form className='form' onSubmit={onSubmit}>
            <div className="form__header">
                <h2>Create account</h2>
                <p>Join our most free to speach community</p>
            </div>
            <div className="form__group">
                <input name="username" type="text" className="form__input" autoComplete='off' placeholder='' value={username} onChange={onChange}/>
                <label htmlFor="username" className="form__label">Username</label>
            </div>
            <div className="form__group">
                <input name="email" type="text" className="form__input" autoComplete='off' placeholder='' value={email} onChange={onChange}/>
                <label htmlFor="email" className="form__label">Email</label>
            </div>
            <div className="form__group">
                <input name="password" type={pass1Visibility ? 'text' : 'password'} className="form__input" autoComplete='off' placeholder='' value={password} onChange={onChange}/>
                <label htmlFor="password" className="form__label">Password</label>
                <button className='btn form__showpass' type='button' onClick={() => setPass1Visibility(!pass1Visibility)} >
                {
                    pass1Visibility ? <i className='bx bxs-show' ></i> : <i className='bx bxs-hide' ></i>
                }
                </button>
            </div>
            <div className="form__group">
                <input name="password2" type={pass2Visibility ? 'text' : 'password'} className="form__input" autoComplete='off' placeholder='' value={password2} onChange={onChange}/>
                <label htmlFor="password2" className="form__label">Repeat password</label>
                <button className='btn form__showpass' type='button' onClick={() => setPass2Visibility(!pass2Visibility)} >
                {
                    pass2Visibility ? <i className='bx bxs-show' ></i> : <i className='bx bxs-hide' ></i>
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

export default Register