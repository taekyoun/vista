import React, { Suspense} from 'react';
import { Link } from 'react-router-dom';
import {Menu} from 'js/component/Menu';
import style from 'css/tiles/Portal.module.css'

const Home = ()=> {
    return (
        <React.Fragment>
            <header className={style.header}>
                <GoAdminPage/>
            </header>
            <nav className={style.nav}>
                <Menu sort='portal'menuClass={style.menu_item}/>
            </nav>
            <div className={style.content_body}>
                    <Suspense fallback={<div>로딩 중...</div>}>
                        <div>홈엥홈</div>
                    </Suspense>
            </div>
            <footer className={style.footer}></footer>
        </React.Fragment>
    )
}

const GoAdminPage = ()=>(
    <div>
        <Link to='/admin'>관리자</Link>
    </div>
)

export default Home