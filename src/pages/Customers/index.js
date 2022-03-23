import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import './customers.css';

export default function Customers(){

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e){
        e.preventDefault();
        
        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(() => {
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.success('Empresa cadastrada com sucesso.');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Erro ao cadastrar a empresa');
            })
        }
        else{
            toast.error('Preencha todos os campos!');
        }
    }

    return(
        <div>
            <Header />

            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile customers' onSubmit={handleAdd}>
                        <label>NOME FANTASIA</label>
                        <input type="text" placeholder='INFORME O NOME FANTASIA' value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)}/>

                        <label>CPNJ</label>
                        <input type="text" placeholder='INFORME O CNPJ' value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>

                        <label>ENDEREÇO</label>
                        <input type="text" placeholder='INFORME O ENDEREÇO' value={endereco} onChange={(e) => setEndereco(e.target.value)}/>

                        <button type='submit'>Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}