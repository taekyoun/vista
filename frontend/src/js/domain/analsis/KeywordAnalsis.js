import React, {useState, useEffect} from 'react';
import axios from 'axios'

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
    },[selectedOption])

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value)
        console.log(selectedOption)
    };
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };
    
    const handelSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const Content = () =>{
        if(loading) return <div>Loading..</div>;
        if(error) return <div>Error: {error.message}</div>;
        if(data){
            return (
                <React.Fragment>
                    <h1>Data</h1>
                    <pre>{JSON.stringify(data,null,2)}</pre>
                </React.Fragment>
            );
        }
        else{
            return (
                <React.Fragment>
                    <h5>검색어를 입력해주세요..</h5>
                </React.Fragment>
            );
        }
       
        
        
    }
    return (
        <div>
            <div>
                <label>
                    키워드 검색
                    <input 
                        type='text'
                        value={search}
                        onChange={handleSearchChange}
                    />
                </label>
                <br/>
                <label>
                    뉴스 정보
                    <input 
                        type='radio' 
                        value="news"
                        checked={selectedOption === 'news'}
                        onChange={handleOptionChange}
                    />
                </label>
                <label>
                    키워드 정보
                    <input 
                        type='radio' 
                        value="info"
                        checked={selectedOption === 'info'}
                        onChange={handleOptionChange}
                    />
                </label>
                <br/>
                <button onClick={handelSubmit}>검색</button>
            </div>
            <div>
                <Content/>
            </div>
           
        </div>
    )
}


export default KeywordAnalsis;