import {lazy} from 'react';
import { Route, Routes,useLocation} from 'react-router-dom';

const KeywordAnalsis = lazy(() => import  ('js/domain/analsis/KeywordAnalsis'));
const MapAnalsis = lazy(() => import  ('js/domain/analsis/MapAnalsis'));
const MenuMng = lazy(() => import  ('js/domain/admin/MenuMng'));
const CodingBoard = lazy(()=> import ('js/domain/board/CodingBoard'));

const BasicPage = ()=>{
    return (
        <h1>기본페이지</h1>
    )
}

const componentMap = {
    '/': BasicPage,
    '/analsis/keywordAnalsis': KeywordAnalsis,
    '/analsis/mapAnalsis': MapAnalsis,
    '/board/coding': CodingBoard,
    '/admin/menuMng': MenuMng,
    // Add more mappings here
};

const ComponentRoute = ()=>{
    const location = useLocation();
    const currentPath = location.pathname;
    const ComponentToRender = componentMap[currentPath] || null;
    return (
        <Routes>
            <Route path="/*" element={ComponentToRender ? <ComponentToRender  /> : <div>Page not found</div>} />
        </Routes>
    )
}

export default ComponentRoute;