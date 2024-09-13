import React, {useState, useEffect,useMemo} from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios'
import 'css/domain/analsis/KeywordAnalsis.css'
import style from 'css/component/Modal.module.css'
import {TextIpt,RadioIpt,SubmitBtn} from 'js/component/InputButton'
import {Loading,Error,Vacuum} from 'js/component/LoadingError'
import {PieChart} from 'js/component/Chart'

const KeywordAnalsis = () => {
    const [newsData, setNewsData] = useState(null);
    const [keywordData, seKeywordtData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedOption, setSelectedOption] = useState('news');

    const fetchData = async ()=>{
        if(!search || search.trim().length===0)return;
        setError(null);
        setLoading(true);
        try{
            const response = await axios.get(`/api/keyword/${selectedOption}`,{
                params:{
                    keyword:search,
                    count: 100
                }
            } );
            if(selectedOption==='news')setNewsData(response.data);
            else if(selectedOption==='info')seKeywordtData(response.data);
        } catch (err){
            setError(err);
        }
        finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchData()
    },[selectedOption])

    const memoizedNewsTable = useMemo(() => {
        if (newsData) {
          return <NewsTable data={newsData} search={search} />;
        }
    }, [newsData, search]);
      
    const memoizedKeywordChart = useMemo(() => {
        if (keywordData) {
          return <KeywordChart data={keywordData} search={search} />;
        }
    }, [keywordData, search]);

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
                {loading && <Loading/>}
                {error && <Error error={error}/>}
                {!loading &&newsData && selectedOption==='news' && memoizedNewsTable}
                {!loading &&keywordData && selectedOption==='info' && memoizedKeywordChart}
                {!loading &&!newsData && !keywordData   && <Vacuum/>}
            </div>
        </div>
    )
}


const NewsTable = ({data,search})=>{
    const [isOpen, SetIsOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [modalData, setModalData] = useState(null);
    const [loading, setLoading] = useState(true);
    

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
    useEffect(()=>{
        if (isOpen && url) {
            setLoading(true);
            axios.get(`/api/keyword/once`, {
                params: {
                    keyword: search,
                    count: 10,
                    url: url,
                    description: description
                }
            })
            .then(response => {
                setLoading(false);
                setModalData(response.data);
            })
            .catch(error => {
                setLoading(false);
                console.error("There was an error with the request:", error);
            });
        }
    },[url,description])
  
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
                                <a dangerouslySetInnerHTML={{__html: news.title }} href={news.linkUrl} target='_blank'  rel="noopener noreferrer"></a>
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
            <ModalNewsInfo data={modalData} loading={loading}  isOpen={isOpen} url={url} description={description} isClose={closeModal}/>
        </React.Fragment>
    )
}
const ModalNewsInfo = ({data,loading,isOpen,url,description,isClose})=>{
    if(!isOpen) return null;
    return ReactDOM.createPortal(
        <div className={style.modal_overlay}>
          <div className={style.modal_content}>
            <table>
                <thead>
                    <tr>
                        <th>긍정</th>
                        <th>부정</th>
                        <th>나머지</th>
                    </tr>
                </thead>
                
                <tbody>
                     {loading ? (
                            <tr>
                                <td colSpan="3"><Loading /></td>
                            </tr>
                        ) : (
                            data ? (
                                <tr>
                                    <td>{data.positiveCnt}</td>
                                    <td>{data.negativeCnt}</td>
                                    <td>{data.restCnt}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="3">데이터가 없습니다.</td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
          
            <button onClick={isClose} className={style.modal_close_button}>취소</button>
          </div>
        </div>,
        document.body
      );
}

const KeywordChart = ({data})=>{
    let positiveTotal =0;
    let negativeTotal =0;
    let restTotal =0;
    data.forEach((keywordInfo)=>{
        if(keywordInfo.sentiment==='긍정')positiveTotal+=keywordInfo.count;
        else if(keywordInfo.sentiment==='부정')negativeTotal+=keywordInfo.count;
        else restTotal+=keywordInfo.count;
    })
    const pieChartData = [
        {   sentiment:'긍정',
            count:positiveTotal },
        {   sentiment:'부정',
            count:negativeTotal }
     
    ]
    const sortedData =data.sort((a,b)=>b.count-a.count);

    const topKeywordList =sortedData.filter(i=>i.sentiment==='keyword').slice(5,15);
        
        
    return (
        <React.Fragment>
            <div className='keyword_analsis_total'>
                <ul>
                    <li>통합 긍정 수 : {positiveTotal}</li>
                    <li>통합 부정 수 : {negativeTotal}</li>
                    <li>나머지 키워드 : {restTotal}</li>
                </ul>
                <PieChart dataList={pieChartData} labelKey='sentiment' value='count'/>
            </div>
            <div className='keyword_top10'>
                {topKeywordList.map((keywordInfo,index)=>(
                    <ul key={index}>
                        <li>
                            <div>{keywordInfo.keyword}</div>
                        </li>
                        <li>
                            <div>{keywordInfo.count}</div>
                        </li>
                    </ul>
                ))}
            </div>
        </React.Fragment>
    )
}


export default KeywordAnalsis;