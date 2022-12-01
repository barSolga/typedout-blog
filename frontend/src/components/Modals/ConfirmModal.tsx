import {motion} from 'framer-motion';
import styled from 'styled-components'

const ConfirmModal = ({ openState, onLogout, text}: any) => {

  const formAnimSettings = {
    initial: { scale: 0},
    animate: { scale: 1}
  };

  const handleAction = (e:any) => {
    const element = e.target.id;
    if(element === 'confirm') onLogout();
    else if(element === 'popup') openState(false);
  }

  return (
    <Container id='popup' onClick={(e) => handleAction(e)}>
        <motion.div className="card shadow modal" {...formAnimSettings}>
            <p className='h3'>Are you sure? 🧐</p>
            <p>{text}</p>
            <br />
            <button id='confirm' className='btn btn-primary modal__btn' >
              Confirm
            </button>
        </motion.div>
    </Container>
  )
}

const Container = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 1rem;
    background-color: var(--dimmer);
    .modal {
      max-width: 700px;
      &__btn {
        width: 100%;
      }
    }
`

export default ConfirmModal