import React, { useState, useEffect} from 'react'
import ReactDom from 'react-dom/client'
import axios from 'axios'


const App = (props) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
 
    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const response = await axios.get(`/api/keyword/${selectedOption}`);
                setData(response.data);
                setLoading(false);
            } catch (err){
                setError(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedOption]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value)
        console.log(selectedOption)
    };

    // if(loading) return <div>Loading..</div>;
    // if(error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div>
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
            </div>
            <h1>Data</h1>
            <pre>{JSON.stringify(data,null,2)}</pre>
        </div>
    )
}



const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
   <App/>
)