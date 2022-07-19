import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import './Header.css';
import { AuthContext } from '../../providers/auth';
import { Navigate } from 'react-router';


const Header = () =>{

    const { user, admin, handleLogout } = useContext(AuthContext);

    let navigate = useNavigate();

    const handleAdmin = (e) =>{
        e.preventDefault()
        return navigate("/admin")
    }

    return (
        <header>
            <div className="container--header">
                <AccountCircleIcon className="item" fontSize="large" />
                <span className="item" id="name">{user.username}</span>
                {
                    user.admin===true ? <AdminPanelSettingsIcon className="item" id="adminicon"  fontSize="large" onClick={(e)=>handleAdmin(e)}/> :
                    admin === true && <AdminPanelSettingsIcon className="item" id="adminicon"  fontSize="large" onClick={(e)=>handleAdmin(e)}/> 
                }
                {
                    user.admin===true ? <a href="/admin" className="item" id="admin" onClick={handleAdmin}>Administrador</a> : 
                    admin === true && <a href="/admin" className="item" id="admin" onClick={handleAdmin}>Administrador</a>
                }
            </div>
            <span id="text" onClick={handleLogout}>Logout</span>
            <LogoutIcon className="logout" fontSize="large" onClick={handleLogout}/>
        </header>
    )
}

export default Header