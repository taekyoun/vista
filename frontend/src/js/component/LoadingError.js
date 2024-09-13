const Loading = ()=>{
    return (
        <div>로딩중 입니다...</div>
    )

}
const Error = ({error})=>{
    return (
        <div>에러 발생 :{error.message}</div>
    )
}
const Vacuum = () =>{
    return (
        <div>검색결과가 없습니다..</div>
    )
}
export{
    Loading,Error,Vacuum
}