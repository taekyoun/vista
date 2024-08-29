import React, { Suspense} from 'react';
import { Link } from 'react-router-dom';
import {Menu, PageTitle} from 'js/component/Menu';
import ComponentRoute from 'js/component/Route';

import style from 'css/tiles/Admin.module.css'

const Admin = ()=>{
    return (
        <React.Fragment>
            <header className={style.header}>
                <GoPortalPage/>
                <PageTitle/>
            </header>
            <nav className={style.nav}>
                <Menu sort='admin' menuClass={style.menu_item}/>
            </nav>
            <div className={style.content_body}>
                    <Suspense fallback={<div>로딩 중...</div>}>
                        <ComponentRoute />
                    </Suspense>
            </div>
            <footer className={style.footer}></footer>
        </React.Fragment>
    )
}

const GoPortalPage = ()=>(
    <div>
        <Link to='/'>포털</Link>
    </div>
)

export default Admin