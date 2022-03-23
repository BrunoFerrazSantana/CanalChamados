import { FiX } from 'react-icons/fi';
import './modal.css';

export default function Modal({conteudo, close}){
    return(
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={close}>
                    <FiX size={23} color="#fff"/>
                </button>

                <div>
                    <h2>Detalhe do chamado</h2>

                    <div className='row'>
                        <span>
                            Cliente: <i>{conteudo.cliente}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Assunto: <i>{conteudo.assunto}</i>
                        </span>
                        <span>
                            Criado em: <i>{conteudo.createdFormated}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Status: <i style={{color: '#000', backgroundColor: conteudo.status === 'Aberto' ? '#00FA9A' : '#DC143C'}}>{conteudo.status}</i>
                        </span>
                    </div>

                    {conteudo.complemento !== '' &&(
                        <>
                            <h3>Complemento</h3>
                            <p>
                                <i>
                                    {conteudo.complemento}
                                </i>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}