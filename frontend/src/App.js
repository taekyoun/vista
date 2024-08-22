import React, { Suspense} from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import {Menu, PageTitle} from 'component/menu';
import ComponentRoute from 'component/route';

const Tiles = ()=> {
    return (
        <React.Fragment>
            <header><PageTitle/></header>
                <nav>
                  <Menu />
                </nav>
                <div class='content_body'>
                        <Suspense fallback={<div>로딩 중...</div>}>
                            <ComponentRoute />
                        </Suspense>
                </div>
            <footer></footer>
        </React.Fragment>
    )
}

const App = () => (
    <Router>
        <Tiles />
    </Router>
);

export default App

