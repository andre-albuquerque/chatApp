import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import './Header.css';
import { AuthContext } from '../../providers/auth';

const Header = () =>{
    let name = localStorage.getItem("username")
    const { user, handleLogout } = useContext(AuthContext);

    let navigate = useNavigate();

    const handleAdmin = () =>{
        navigate("/admin")
    }    
    return (
        <header>
            <session class="container">
                <AccountCircleIcon className="item" fontSize="large" />
                <span class="item" className="item" id="name">{name}</span>
                {user.admin===true && <AdminPanelSettingsIcon className="item" id="adminicon"  fontSize="large" onClick={handleAdmin}/>}
                {user.admin===true && <a className="item" id="admin" onClick={handleAdmin}>Administrador</a>}
            </session>
            <span id="text" onClick={handleLogout}>Logout</span>
            <LogoutIcon className="logout" fontSize="large" onClick={handleLogout}/>
        </header>
    )
}

export default Header