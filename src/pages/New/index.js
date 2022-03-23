import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiPlus } from 'react-icons/fi';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

import firebase from '../../services/firebaseConnection';
import './new.css';

export default function New(){

    const {id} = useParams();
    const history = useHistory();

    const[loadCustomers, setLoadCustomers] = useState(true);
    const[customers, setCustomers] = useState([]);
    const[customerSelected, setCustomerSelected] = useState(0);

    const[assunto, setAssunto] = useState('Formatação');
    const[status, setStatus] = useState('Aberto');
    const[complemento, setComplemento] = useState('');
    
    const[idCustomer, setIdCustomer] = useState(false);
    const{ user } = useContext(AuthContext);

    useEffect(() =>{
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let lista = [];

                snapshot.forEach((doc) =>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(lista.length === 0){
                    console.log('Nenhuma empresa encontrada');
                    setCustomers([{id: '1', nomeFantasia: ''}]);
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomers(false);

                if(id){
                    loadId(lista);
                }
            })
            .catch((error) => {
                console.log('Deu algum erro!', error);
                setLoadCustomers(false);
                setCustomers([{id:'1', nomeFantasia: ''}]);
            })
        }

        loadCustomers();
    }, []);

    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((err) => {
            console.log('ERRO NO ID PASSADO: ', err);
            setIdCustomer(false);
        })
    }

    async function handleRegister(e){
        e.preventDefault();

        if(idCustomer){
        await firebase.firestore().collection('chamados')
        .doc(id)
        .update({
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid 
        })
        .then(() => {
            toast.success('Chamado alterado com sucesso!');
            setCustomerSelected(0);
            setComplemento('');
            history.push('/dashboard');
        })
        return;
        }

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(() => {
            toast.success('Chamado criado com sucesso!');
            setComplemento('');
            setCustomerSelected(0);
            history.push('/dashboard');
        })
        .catch(() => {
            toast.error('Ops...erro ao registrar, tente mais tarde!')
        })
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }

    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    function handleChangeCustomers(e){
        setCustomerSelected(e.target.value);
    }

    return(
        <div>
            <Header />

            <div className='content'>
                <Title name="Novo Chamado">
                    <FiPlus size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type='text' disabled={true} value='Carregando clientes...'/>
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) =>{
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                )
                            })}
                        </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Formatação">Formatação</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Pedido de Compra">Pedido de Compra</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Aberto</span>
                    
                            <input
                                type="radio"
                                name="radio"
                                value="Fechado"
                                onChange={handleOptionChange}
                                checked={status === 'Fechado'}
                            />
                            <span>Fechado</span>
                            
                            </div>
                            
                            <label>Descrição</label>
                            <textarea 
                                type="text"
                                placeholder='Descreva seu problema (Opcional).'
                                value={complemento}
                                onChange={(e) => setComplemento(e.target.value)}
                            />

                            <button type='submit'>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}