import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { format, toDate } from 'date-fns';
import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import firebase from '../../services/firebaseConnection';
import './dashboard.css';

export default function(){
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDoc, setLastDoc] = useState();
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    const listRef = firebase.firestore().collection('chamados').orderBy('created','desc');

    useEffect(() => {

        async function loadChamados(){
            await listRef.limit(3)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch(() => {
                setLoadingMore(false);
            })
    
            setLoading(false);
        }

        loadChamados();

        return() => {

        }
    }, []);

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];

            snapshot.forEach((doc) =>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length -1];

            setChamados(chamados => [...chamados, ...lista]);
            setLastDoc(lastDoc);
        }
        else{
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore(){
        setLoadingMore(true);

        await listRef.startAfter(lastDoc).limit(3)
        .get()
        .then((snapshot) => {
            updateState(snapshot);
        })
    }

    function togglePostModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item);
    }

// Para deixar com efeito de "Buscando chamados"

    if(loading){
        return(
            <div>
                <Header />

                <div className='content'>
                    <Title>
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className='container dashboard'>
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div>
            <Header />
            <div className='content'>
                <Title name="Chamados">
                    <FiMessageSquare size={25}/>
                </Title>

                {chamados.length === 0 ? (
                    <div className='container dashboard'>
                        <span>Nenhum chamado cadastrado...</span>

                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#fff"/>
                            Novo chamado
                        </Link>
                    </div>
                ) : (
                   <>
                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#fff"/>
                            Novo chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope='col'>Cliente</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Criado em</th>
                                    <th scope='col'>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index) => {
                                    return(
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                            <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#00FA9A' : '#FF0000'}}>{item.status}</span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className='action' style={{backgroundColor : '#00FFFF'}} onClick={() => togglePostModal(item)}>
                                                    <FiSearch color='#000' size={17}/>
                                                </button>
                                                <Link className='action' style={{backgroundColor : '#FFFF00'}} to={`/new/${item.id}`}>
                                                    <FiEdit2 color='#000' size={17}/>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando chamados...</h3>}
                        { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais...</button>}
                   </> 
                )}
            </div>

            {showPostModal &&(
                <Modal 
                    conteudo={detail}
                    close={togglePostModal}
                />
            )}

        </div>
    )
}