import React from 'react'
import style from 'css/component/InputButton.module.css'

const TextIpt = ({value,title,onKeyDown,onChange}) =>{
    return (
        <label>
            {title}
            <input 
                className={style.search_input}
                type='text'
                value={value}
                placeholder='검색어를 입력하세요'
                onKeyDown={onKeyDown}
                onChange={onChange}
            />
        </label>
    )
}
const RadioIpt = ({radioList}) =>{
    return (
        <React.Fragment>
            {radioList.map((iptInfo,index)=>{
                return (
                    <label key={index}>
                        {iptInfo.title}
                        <input 
                        type='radio' 
                        value={iptInfo.value}
                        checked={iptInfo.selectedOption === iptInfo.value}
                        onChange={iptInfo.onChange}
                        />
                    </label>
                )
            })}
        </React.Fragment>
        
    )

}
const SubmitBtn =({onClick}) =>{
    return (
        <button onClick={onClick}>검색</button>
    )
}

export{
    TextIpt,RadioIpt,SubmitBtn
}
