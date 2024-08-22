import React, { useState } from 'react';
import { Link, useLocation} from 'react-router-dom';

const menuList =[
    {title:'기본페이지',path:'/', subMenu :null},
    {title:'분석페이지',path:null, subMenu:[
        {title:'키워드분석',path:'/analsis/keywordAnalsis', subMenu :null},
        {title:'지도분석',path:'/analsis/mapAnalsis', subMenu :null}
    ]}
];

const findPageTitle = (menus, currentPath) => {
    for (const menu of menus) {
        if (menu.path === currentPath) {
            return menu.title;
        }
        if (menu.subMenu) {
            const foundTitle = findPageTitle(menu.subMenu, currentPath);
            if (foundTitle) {
                return foundTitle;
            }
        }
    }
    return null;
};

const PageTitle = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // 현재 경로에 맞는 제목 찾기
    const pageTitle = findPageTitle(menuList, currentPath) 

    return <h1>{pageTitle}</h1>;
};
const MenuItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);

    return (
        <li
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {item.subMenu ? (
                <span>{item.title}</span>
            ) : (
                <Link to={item.path || '#'}>{item.title}</Link>
            )}
            {item.subMenu && isOpen && (
                <ul>
                    {item.subMenu.map((subItem, index) => (
                        <li key={index}>
                          <MenuItem key={index} item={subItem} />
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};
const Menu = () => {
    return (
            <ul className='menu-item'>
                {menuList.map((item, index) => (
                    <MenuItem key={index} item={item} />
                ))}
            </ul>
    );
};

export {Menu,PageTitle}