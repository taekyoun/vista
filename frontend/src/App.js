import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Admin from 'js/tiles/Admin';
import Portal from 'js/tiles/Portal';




const App = () => {
    return (
        <Router>
            <Routes>
                    <Route path='/admin/*' element={<Admin/>}></Route>
                    <Route path='*' element={<Portal/>}></Route>
            </Routes>
        </Router>
    )    
};
export default App

