const Board = (props)=>{
    const { boardDataList, colName, colVal } = props;

    
   
    return (
        <div className="board">
            <h3 className="board_title">board_title</h3>
            <table className="board_list"> 
                <thead>
                    <tr>
                        <th>제목</th>
                        {
                            colName && <th>{colName}</th>
                        }
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        boardDataList.map((boardData,index)=>(
                            <tr key={index}>
                                <td>{boardData.title}</td>
                                {colVal && <td>{boardData[colVal]}</td>}
                                <td>{boardData.writeDate}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Board