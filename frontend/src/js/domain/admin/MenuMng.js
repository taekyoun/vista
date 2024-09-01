import React, {useState, useEffect} from 'react';
import axios from 'axios'
import Modal from 'react-modal'
import Table from 'js/component/Table'
import 'css/domain/admin/MenuMng.css'



const  MenuMng = () => {
  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);

  const fetchAllMenuInfo = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get('/api/menu/all');
      setData(response.data);
    } catch (error) {
      setError(error);  
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllMenuInfo();
  }, []); 

  const openModal = () => {
    setEditData(null)
    setModalIsOpen(true);
  };
  const handleEdit = (rowData) => {
    setEditData(rowData)
    setModalIsOpen(true)
  };
  
  return (
    <div className='table_area' >
        <fieldset>
            <label>
              검색
              <input type='text'/>
              <button onClick={openModal} className="open-modal-button">메뉴생성</button>
            </label>
        </fieldset>
        <MenuTable error={error} loading={loading} data={data} onEdit={handleEdit}/>
        <CreateMenuModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} editData={editData} />
    </div>
  )
}

const  MenuTable = ({error,loading,data, onEdit}) => {

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const columns = [
        {
          Header: 'ID',
          accessor: 'id',
          className:'hidden'
        },
        {
          Header: '메뉴명',    // 컬럼 헤더
          accessor: 'name',  // 데이터에서 이 컬럼이 참조할 키
          Cell: ({ row, value }) => (
            <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? '▼ ' : '▶ '}
                {value}
            </span>
          ),
        },
        {
          Header: '경로',
          accessor: 'path',
        },
        {
          Header: '설명',
          accessor: 'comment',
        },
        {
          Header: '상위메뉴',
          accessor: 'upperMenu',
        },
        {
          Header: '순서',
          accessor: 'order',
        },
        {
          Header: '사용유무',
          accessor: 'usage',
          Cell: ({ value }) => (value ? '✔' : '✘')
        },
        {
          Header: 'Action', // 버튼이 포함될 컬럼
          id: 'action',    // 식별자
          Cell: ({ row }) => (
              <div>
                  <button
                      onClick={() => onEdit(row.original)}
                  >
                      Edit
                  </button>
                  <button
                      onClick={() => handleDelete(row.original)}
                  >
                      Delete
                  </button>
              </div>
          ),
        }
      ];
    return (
      <Table columns={columns} data={data}  onDelete={handleDelete} />
    )
   
}


const handleDelete =  async (rowData) => {
  try {
    console.log(rowData)
    const response = await axios.delete(`/api/menu/${rowData.id}`);
    if (response.status === 200) {
      console.log('Menu deleted successfully');
      window.location.reload();
    } else {
      console.error('Failed to delete menu',response);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const CreateMenuModal = ({ modalIsOpen, setModalIsOpen, editData}) => {
  const [menuName, setMenuName] = useState('');
  const [comment, setComment] = useState('');
  const [path, setPath] = useState('');
  const [upperMenu, setUpperMenu] = useState('');
  const [order, setOrder] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [id,setId] =useState('');

  useEffect(()=>{
    if(editData){
      setId(editData.id || '');
      setMenuName(editData.name || '');
      setComment(editData.comment || '');
      setPath(editData.path || '');
      setUpperMenu(editData.upperMenu || '');
      setOrder(editData.order || '');
      setIsActive(editData.usage ? 'true' : 'false');
    }
    else{
      setId('');
      setMenuName('');
      setComment('');
      setPath('');
      setUpperMenu('');
      setOrder('');
      setIsActive(true);
    }
  },[editData])  

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 폼 데이터 준비
    const menuData = {
      id:id,
      name:menuName,
      comment:comment,
      path :path,
      usage:isActive,
      upperMenu:upperMenu,
      order:order
    };

    try {
      const response = editData?await axios.put('/api/menu', menuData) : await axios.post('/api/menu', menuData);

      if (response.status === 200) {
        console.log('Menu created successfully');
        closeModal(); 
        window.location.reload();
      } else {
        console.error('Failed to create menu');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel="Create Menu"
      appElement={document.getElementById('root')} 
    >
      <h2>메뉴 생성</h2>
      <form onSubmit={handleSubmit}>
        <table className='modal-table'>
          <tbody>
            <tr>
              <td><label>메뉴명</label></td>
              <td><input
                type="text"
                placeholder="메뉴명을 입력하세요"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
              </td>
            </tr>
            <tr>
              <td><label>경로</label></td>
              <td><input
                  type="text"
                  placeholder="경로를 입력하세요"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td><label>상위 메뉴</label></td>
              <td><input
                  type="text"
                  placeholder="상위메뉴를 입력하세요"
                  value={upperMenu}
                  onChange={(e) => setUpperMenu(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td><label>설명</label></td>
              <td><input
                  type="text"
                  placeholder="메뉴에 대한 설명을 입력하세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td><label>메뉴 순서</label></td>
              <td><input
                  type="text"
                  placeholder="메뉴순서를 숫자로 입력하세요"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td><label>사용 유무</label></td>
              <td className='select-td'><select
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                >
                  <option value="true">활성</option>
                  <option value="false">비활성</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='button-container'>
          <button type="submit" className="save-modal-button">저장</button>
          <button onClick={closeModal} className="close-modal-button">닫기</button>
        </div>
      </form>
    </Modal>
  );
};

export default MenuMng