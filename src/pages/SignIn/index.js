import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import {AuthContext} from '../../contexts/auth';
import logo from '../../assets/logo.png';
import './signin.css';

function SignIn(){
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();
    
    if(email !== '' && password !== ''){

      signIn(email, password)
    }
  }

    return(

      <div className='container-center'>
        <div className='login'>
          <div className='logo-area'>
            <img src = {logo} alt='Logo do Sistema'/>
          </div>

          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" placeholder='Insira seu e-mail' value ={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='Insira sua senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit'>{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
          </form>

          <Link to = '/register'>Inscreva-se</Link>
        </div>
      </div>
    );
  }
  
  export default SignIn;