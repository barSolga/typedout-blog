import { useEffect, useState } from 'react';
import {motion} from 'framer-motion';
import styled from 'styled-components';

// Components
import Login from '../components/Login';
import Register from '../components/Register';


// ? Page for handling user register / login processes
const Signer = () => {
    const [haveAccount, setHaveAccount] = useState<boolean>(false);
    const [allowAnimations] = useState<boolean>(window.innerWidth >= 998);
    
    useEffect(() => {

        // add animation
        const form = document.querySelector('.signer__form-box');
        form?.classList.add('fadeOnChange');
        setTimeout(() => {
            form?.classList.remove('fadeOnChange');
        }, 300);

    }, [haveAccount])

    const formAnimSettings = allowAnimations && {
        initial: { x: "100%"},
        animate: { x: `calc(50vw ${!haveAccount ? '- 100%' : '- 0%'})`}
    };
    

    return (
        <Container className='container'>
            <main className=" signer">

                <motion.div className='signer__form'
                    {...formAnimSettings}
                >
                    <img className={!haveAccount ? 'signer__form-logo' : 'signer__form-logo align-right'} src="/assets/typedout-logo.svg" alt="typedout-logo" width="250"/>

                    <div className="signer__form-box">
                        {
                            haveAccount ? <Register/> : <Login />
                        }
                        
                        <div className="form-footer">
                            {
                                haveAccount 
                                ? <p>Already have account?  <span onClick={() => setHaveAccount(!haveAccount)} className='form-footer__link'>Log in here</span></p>
                                : <p>Don`t have account?    <span onClick={() => setHaveAccount(!haveAccount)} className='form-footer__link'>Register here</span></p>
                            }
                        </div>
                    </div>

                    <div className="signer__footer">
                        <p>Created by Niffler00</p>
                    </div>

                </motion.div>

                <motion.div className={!haveAccount ? 'signer__image' : 'signer__image flex-right'}
                    initial={allowAnimations && { x: "100%" }}
                    animate={allowAnimations && { x: `calc(50vw ${!haveAccount ? '- 100%' : '- 200%'})` }}
                >
                    <button className={!haveAccount ? 'btn signer__donate align-right' : 'btn signer__donate'}>
                        <i className='bx bxs-coin-stack'></i>
                        <span>Donate</span>
                    </button>
                    <div className={!haveAccount ? 'signer__laws' : 'signer__laws text-right'} >
                        <h2 className='signer__laws-text'>We are here for you</h2>
                        <h2 className='signer__laws-text'>We respect your privacy</h2>
                        <h2 className='signer__laws-text'>We don`t share your data</h2>
                        <h2 className='signer__laws-text'>We exist to serve, not to use</h2>
                    </div>
                </motion.div>

            </main>
        </Container>
    )
}

const Container = styled.div`
    .signer {
        display: flex;
        padding: 0;
        &__form {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            min-width: 100vw;
            min-height: 100vh;
            padding: 1rem;
            background-color: var(--strong-color);
            &-box {
                width: 100%;
                max-width: 450px;
            }
            &-box.fadeOnChange {
                animation: fadeOnChange .3s ease-in;
            }
        }
        &__image {
            display: none;
        }
        &__donate {
            position: relative;
            align-self: flex-start;
            background-color: var(--strong-color);
            .bx {
                color: var(--act2-color);
                transition: transform .3s;
            }
            &:hover {
                background-color: var(--primary-color);
                color: var(--strong-color);
            }
        }
        &__donate.align-right {
            align-self: flex-end;
        }
    }


    @media screen and (min-width: 998px){
        .signer {
            &__form {
                min-width: 50vw;
                padding: 2rem;
                &-logo {
                align-self: flex-start;
                }
                &-logo.align-right {
                    align-self: flex-end;
                }
            }
            &__image {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                min-width: 50vw;
                min-height: 100vh;
                padding: 2rem;
                background-image: url('/assets/signer-image-dsk.png');
                background-position: bottom;
                background-size: cover;
                background-repeat: no-repeat;
            }
            &__image.flex-right {
                align-items: flex-end;
            }
            &__laws {
                color: var(--strong-color);
                &-text {
                    line-height: 1.3;
                    font-size: 2rem;
                }
            }
            &__laws.text-right {
                text-align: right;
            }
        }
    }

    @media screen and (min-width: 1500px) {
        .signer {
            &__laws {
                &-text {
                    font-size: 3rem;
                }
            }
        }
    }

    @media screen and (min-width: 1950px){
        .signer {
            &__laws {
                &-text {
                    font-size: 4rem;
                }
            }
        }
    }
`

export default Signer



