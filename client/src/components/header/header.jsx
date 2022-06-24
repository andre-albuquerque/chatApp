import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import './Header.css';
import { AuthContext } from '../../providers/auth';


const Header = () =>{

    const { user, admin, handleLogout } = useContext(AuthContext);

    console.log(admin)

    let navigate = useNavigate();

    const handleAdmin = () =>{
        navigate("/admin")
    }

    return (
        <header>
            <session class="container--header">
                <AccountCircleIcon className="item" fontSize="large" />
                <span class="item" className="item" id="name">{user.username}</span>
                {
                    user.admin===true ? <AdminPanelSettingsIcon className="item" id="adminicon"  fontSize="large" onClick={handleAdmin}/> :
                    admin === true && <AdminPanelSettingsIcon className="item" id="adminicon"  fontSize="large" onClick={handleAdmin}/> 
                }
                {
                    user.admin===true ? <a className="item" id="admin" onClick={handleAdmin}>Administrador</a> : 
                    admin === true && <a className="item" id="admin" onClick={handleAdmin}>Administrador</a>
                }
            </session>
            <span id="text" onClick={handleLogout}>Logout</span>
            <LogoutIcon className="logout" fontSize="large" onClick={handleLogout}/>
        </header>
    )
}

export default Header