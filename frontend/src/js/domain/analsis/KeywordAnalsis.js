import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios'
import 'css/domain/analsis/KeywordAnalsis.css'
import style from 'css/component/Modal.module.css'
import {TextIpt,RadioIpt,SubmitBtn} from 'js/component/InputButton'
import Chart from 'chart.js/auto';

const KeywordAnalsis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedOption, setSelectedOption] = useState('news');
 
    const fetchData = async ()=>{
        if(!search)return;
        setError(null);
        setLoading(true);
        try{
            const response = await axios.get(`/api/keyword/${selectedOption}`,{
                params:{
                    keyword:search,
                    count: 100
                }
            } );
            setData(response.data);
            setLoading(false);
        } catch (err){
            setError(err);
            setLoading(false);
        }
    };
    useEffect(()=>{
        if(data) fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedOption])

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };
    const handelSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };
    const handleKeyDown =(event) =>{
        if(event.key==='Enter'){
            fetchData();
        }
    }
    const radioInfo =[
        {title :'뉴스정보', value:'news', selectedOption :selectedOption, onChange:handleOptionChange},
        {title :'키워드정보', value:'info', selectedOption :selectedOption, onChange:handleOptionChange}
    ]
    return (
        <div className='keywordAnalsis_body'>
            <div className='search_box'>
                <TextIpt value={search} onChange={handleSearchChange} onKeyDown={handleKeyDown}/>
                <RadioIpt  radioList={radioInfo}/>
                <SubmitBtn onClick={handelSubmit}/>
            </div>
            <div className='news_content_box'>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
                {!loading &&data ? 
                   selectedOption==='news'?(<NewsTable data={data} />):<div>{JSON.stringify(data)}</div>
                 : (
                    <React.Fragment></React.Fragment>
                )}
            </div>
           
        </div>
    )
}


const NewsTable = ({data})=>{
    const [isOpen, SetIsOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 두 자리 수로 포맷팅
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        
        return `${formattedMonth}.${formattedDay}`;
    };
    const HandleClick = (linkUrl,newsDescription) =>{
        setUrl(linkUrl)
        setDescription(newsDescription)
        SetIsOpen(true)
    }
    const closeModal = ()=>{
        SetIsOpen(false)
    }
    
    return (
        <React.Fragment>
            <table className='news_table'>
                <thead>
                    <tr>
                        <th>기사 제목</th>
                        <th>요약</th>
                        {/* <th>link</th> */}
                        <th>일자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(news =>(
                        <tr key={news.id}>
                            <td className='tooltip'>
                                <a dangerouslySetInnerHTML={{__html: news.title }} href={news.linkUrl} target='_blank'></a>
                                {/* <span className="tooltiptext"  dangerouslySetInnerHTML={{__html: news.title }}></span> */}
                            </td>
                            <td className='tooltip'>
                                <div dangerouslySetInnerHTML={{__html: news.description }}></div>
                                <span className="tooltiptext"  dangerouslySetInnerHTML={{__html: news.description }}></span>
                            </td>
                            {/* <td></td> */}
                            <td >{formatDate(news.date)} </td>
                            <td><button onClick={()=>HandleClick(news.linkUrl,news.description)} >분석</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ModalNewsInfo isOpen={isOpen} url={url} description={description} isClose={closeModal}/>
        </React.Fragment>
    )
}
const ModalNewsInfo = ({isOpen,url,description,isClose})=>{
    console.log(url,isOpen,description)
    if(!isOpen) return null;
    if(url && isOpen){
       axios.get(`/api/keyword/once`,{
            params :{
                keyword:'test',
                count: 10,
                url:url,
                description:description
            }
        })
        .then(response=>{
            console.log(response.data)
        });
        
    }
  
    return ReactDOM.createPortal(
        <div className={style.modal_overlay}>
          <div className={style.modal_content}>
            <table>
                <thead>
                    <tr>
                        <th>키워드</th>
                        <th>감성구분</th>
                        <th>갯수</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
            <button onClick={isClose} className={style.modal_close_button}>취소</button>
          </div>
        </div>,
        document.body
      );
}

export default KeywordAnalsis;