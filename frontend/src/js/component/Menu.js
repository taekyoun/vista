import React, { useState } from 'react';
import { Link, useLocation} from 'react-router-dom';
import axios from 'axios';

let menuList =[];
try{
    const {data} = await axios.get(`/api/menu/use`);
    if(data) menuList =data;
    console.log(menuList)
  
} catch (err){
    console.log('메뉴정보를 가져오는데 실패하였습니다')
}

const findPageTitle = (menus, currentPath) => {
    for (const menu of menus) {
        if (menu.path === currentPath) {
            return menu.name;
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
       <div onMouseEnter={handleMouseEnter}  
            onMouseLeave={handleMouseLeave}>
            {item.subMenu ? (
                <span>{item.name}</span>
            ) : (
                <Link to={item.path || '#'}>{item.name}</Link>
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
       </div>
    );
};
const Menu = (props) => {
    let viewMenuList =[];
    if(menuList.length>0){
        viewMenuList =props.sort ==='admin'?
            menuList.filter(menu=>menu.path.startsWith('/admin')):
            menuList.filter(menu=>!menu.path.startsWith('/admin'));
    }
    return (
        <ul className={props.menuClass} >
            {viewMenuList.map((item, index) => (
                <li key={index}>
                    <MenuItem item={item} />
                </li>
            ))}
        </ul>
    );
};



export {Menu,PageTitle}