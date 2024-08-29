import React, {useState, useEffect} from 'react';
import axios from 'axios'
import Modal from 'react-modal'
import Table from 'js/component/Table'
import 'css/domain/admin/MenuMng.css'

const  MenuMng = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };

  
    // useEffect를 사용하여 컴포넌트가 처음 렌더링될 때만 데이터를 가져옴
    useEffect(() => {
        const fetchAllMenuInfo = async () => {
          setError(null);
          setLoading(true);
          try {
            const response = await axios.get('/api/menu/all', {
              params: {
                search: search,
              },
            });
            setData(response.data);
          } catch (error) {
            setError(error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchAllMenuInfo();
    }, [search]); // search 상태가 변경될 때마다 데이터 새로고침
    
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
                      onClick={() => handleEdit(row.original)}
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
        <div className='table_area' >
            <fieldset>
                
                <label>
                  검색
                  <input type='text'/>
                  <button onClick={openModal} className="open-modal-button">메뉴생성</button>
                </label>
            </fieldset>
            <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
            <CreateMenuModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
        </div>
    )
}

const handleEdit = (rowData) => {
  console.log(rowData)
};

const handleDelete = (rowData) => {
  // Delete 버튼 클릭 시의 동작을 정의합니다.
  if (window.confirm(`Are you sure you want to delete ${JSON.stringify(rowData)}?`)) {
      // Perform delete action
      alert(`Deleted ${JSON.stringify(rowData)}`);
  }
};

const CreateMenuModal = ({ modalIsOpen, closeModal }) => {
  const [menuName, setMenuName] = useState('');
  const [comment, setComment] = useState('');
  const [path, setPath] = useState('');
  const [upperMenu, setUpperMenu] = useState('');
  const [order, setOrder] = useState('');
  const [isActive, setIsActive] = useState('true');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 폼 데이터 준비
    const menuData = {
      name:menuName,
      comment:comment,
      path :path,
      usage:isActive,
      upperMenu:upperMenu,
      order:order
    };

    try {
      console.log(menuData)
      // 서버에 요청 보내기
      const response = await axios.post('/api/menu', menuData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Menu created successfully');
        closeModal(); 
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