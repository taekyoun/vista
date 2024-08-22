import {lazy} from 'react';
import { Route, Routes,useLocation} from 'react-router-dom';

const KeywordAnalsis = lazy(() => import  ('domain/analsis/keywordAnalsis'));
const MapAnalsis = lazy(() => import  ('domain/analsis/mapAnalsis'));

const BasicPage = ()=>{
    return (
        <h1>기본페이지</h1>
    )
}

const componentMap = {
    '/': BasicPage,
    '/analsis/keywordAnalsis': KeywordAnalsis,
    '/analsis/mapAnalsis': MapAnalsis,
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