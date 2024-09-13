import React, {useState,useEffect} from 'react'
import axios from 'axios'
import {Loading,Error,Vacuum} from 'js/component/LoadingError'
import Table from 'js/component/Table'
import Modal from 'react-modal'
import 'css/domain/board/Board.css'

const CodingBoard = ()=>{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] =useState(null);


    const fetchData = async ()=>{
        setError(null);
        setLoading(true);
        try {
            const response =await axios.get('/api/board/coding');    
            setData(response.data);
        } catch (err) {
            setError(err)
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchData();
    },[])

    const columns = [
        {
          Header: '제목',
          accessor: 'title',
        },
        {
            Header: '난이도',
            accessor: 'level',
        },
        {
            Header: '수정일',
            accessor: 'writeDate',
        },
    ]
    const onRowClick = (rowData)=>{
        console.log(rowData)
        setModalIsOpen(true)
        setModalData(rowData)

    }
    return (
        <React.Fragment>
            {loading && <Loading />}
            {error && <Error error={error}/>}
            {!loading && data.length > 0 &&<Table data={data} columns={columns} onRowClick={onRowClick}/>}
            {!loading && data.length === 0 && <Vacuum/>}
            <SolutionModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} data={modalData} />
        </React.Fragment>
        
    )
}

const SolutionModal = ({modalIsOpen,setModalIsOpen, data}) =>{
    const closeModal = () => {
        setModalIsOpen(false);
      };
    return  (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="modal"
            overlayClassName="modal-overlay"
            contentLabel="coding-solution"
            appElement={document.getElementById('root')} 
        >
            <div className='question'>
                <h5 className='title'>문제</h5>
                {data && data.question && (
                    <pre className='content'>
                        {data.question}
                    </pre>
                )}
            </div>
            <div className='solution'>
                <h5 className='title'>풀이</h5>
                {data && data.content && (
                    <pre className='content'>
                        {data.content}
                    </pre>
                )}
            </div>
             
     
     
        </Modal>
    )
}

export default CodingBoard;