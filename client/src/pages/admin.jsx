import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/auth';
import { useNavigate } from "react-router-dom";
import Api from '../api/api'

import "./styles/Admin.css"

import { Box, Container, Typography, TextField, Button, Alert  } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

export default function Admin(){
    
    const { handleLogout } = useContext(AuthContext);

    const [hasError, setError] = useState(false);
    const [getError, setGetError] = useState(false)
    const [errorValue, setErrorValue] = useState([])
    const [roomName, setRoomName] = useState([''])

    const [prevName, setPrevName] = useState([''])
    const [updateName, setUpdateName] = useState([''])
    const [deleteName, setDeleteName] = useState([''])
    
    const [groups, handleGroups] = useState([])

    const [success, setSuccess] = useState(false);
    const [updateValue, setUpdate] = useState(false);
    const [deleteValue, setDelete] = useState(false);


    const [openDeleteDialog, setDeleteDialog] = useState(false);

    const [openChangeDialog, setChangeDialog] = useState(false);

    const handleClickDelete = () => {
        setDeleteDialog(true);
    };

    const handleCloseDelete = () => {
        setDeleteDialog(false);
        setAnchorEl(null);  
    };

    const handleClickChange = () => {
        setChangeDialog(true);
      };

    const handleCloseChange = () => {
        setChangeDialog(false);
        setAnchorEl(null);
    };
    

    let navigate = useNavigate();

    const handleBack = () => {
        navigate("../chat")
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomName({
          ...roomName,
          [name]: value
        })
    };    
       

    const UpdateName = (e) => {
        const { name, value } = e.target;
        setUpdateName({
            ...updateName,
            [name]: value
        })

    };

    const DeleteName = (e) => {
        setDeleteName(e)

    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };


    const postRooms = async (e) =>{

        try {
            const addGroup = await Api.post('/rooms/createRoom',{
                room: roomName.room
            })
            if (addGroup){
                setSuccess(true);
                setError(false);
                setRoomName("")
                setTimeout(() => {
                    setSuccess(false)
                }, 4000);                         
            }

        } catch (error) {
            setError(true)
            setErrorValue(error.response.data.message)
        }
        
    }


    useEffect(()=>{
        async function getRooms (){
            try {
                await Api.get('/rooms/rooms').then(response=>handleGroups(response.data.rooms))

            } catch (error) {
                setGetError(true)
            }
        }
        getRooms();

    },[groups, updateValue]);


    const updateRoom = async (e) =>{  

        try {
            const updateGroup = await Api.patch('/rooms/updateRoom', {
                prevRoom: prevName,
                room: e
            })
            if (updateGroup){
                setUpdate(true);
                setError(false);
                setPrevName("")
                setUpdateName("");
                setTimeout(() => {
                    setUpdate(false)
                }, 4000)   
            }

        } catch (error) {
            setError(true)
            setErrorValue(error.response.data.message)
        }       
        
    }

    const deleteRoom = async (e) =>{  

        if ( window.confirm(`Exluir grupo ${e}?`)){
            try {
                const delGroup = await Api.delete('/rooms/deleteRoom', {
                    data: {room: e}
                })
                if (delGroup){
                    setDelete(true);
                    setError(false);
                    setDeleteName("");
                    setTimeout(() => {
                        setDelete(false)
                    }, 4000)   
                }

            } catch (error) {
                setError(true)
                setErrorValue(error.response.data.message)
            }       
        }
    }   


    return(
        <div className="app--admin">
            <div className="body--admin">
            <Container component="main" maxWidth="xs"
            sx={{
                position: 'center',
                mr: '750px',
                whidth: 20
            }}>
                
                <Box component="form" noValidate
                    sx={{
                        mt: 4,
                        mb: 1,
                        mr: 9,
                        padding: 10,
                        paddingBottom: "20px",
                        height: 'auto',
                        width: '800px',
                        position: 'center',
                        display: 'block',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        zIndex: 'modal'
                        }}
                    >
                    
                    <div className="header--admin">
                        <ArrowBackIcon fontSize="large" onClick={handleBack}/>
                        
                        <Typography component="h1" variant="h4">
                            Administrador
                        </Typography> 

                        <LogoutIcon className="logout--admin" fontSize="large" onClick={handleLogout}/>
                    </div>


                    {hasError && <Alert severity="error">{errorValue}</Alert>}

                    <Box component="form" noValidate 
                        sx={{
                            border: 1,
                            mt: 8,
                            mb: 3,
                            position: 'relative',
                            margin: '90px auto',
                            padding: 2,
                            display: 'block',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                        
                        <Typography component="h2" variant="h6">
                            Novo Grupo
                        </Typography>                

                        <TextField label="Nome" fullWidth margin="normal" name="room" id={roomName} value={roomName.room || ""} placeholder='Digite o nome do novo grupo' onChange={(e)=>handleChange(e)}/>
                        <Button sx={{ mt: 3, mb: 2 }} variant="contained" type="submit" onClick={(e)=>{e.preventDefault(); postRooms(roomName.room)}}>Salvar</Button>
                        {(success) && <div><Alert severity="success">Grupo cadastrado com sucesso!</Alert></div>} 
                    
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <MenuItem onClick={()=>handleClickChange()}>Alterar</MenuItem>
                            <Dialog open={openChangeDialog} onClose={handleCloseChange}>
                                <DialogTitle>Alterar {deleteName}</DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                    Digite o novo nome do grupo.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Nome do grupo"
                                    type="Name"
                                    fullWidth
                                    variant="standard"
                                    name="updateName" 
                                    id={updateName} 
                                    value={updateName.updateName || ""}
                                    onChange={(e)=>UpdateName(e)}
                                />
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleCloseChange}>Cancelar</Button>
                                <Button onClick={()=>{updateRoom(updateName.updateName); handleClose()}}>Alterar</Button>
                                </DialogActions>
                            </Dialog>


                            <MenuItem onClick={(e)=>handleClickDelete(e)}>Excluir</MenuItem>
                            <Dialog
                                open={openDeleteDialog}
                                onClose={handleCloseDelete}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                {`Excluir ${deleteName}?`}
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Esta ação excluirá todo o histórico de mensagens deste grupo.
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleCloseDelete}>Cancelar</Button>
                                <Button  id={deleteName} value={deleteName || ""} onClick={()=>{deleteRoom(deleteName); handleClose()}} autoFocus>
                                    Excluir
                                </Button>
                                </DialogActions>
                            </Dialog>
                        </Menu>

                    </Box>

                    <Box component="form" noValidate 
                        sx={{
                            border: 1,
                            mt: 8,
                            mb: 3,
                            position: 'relative',
                            margin: '90px auto',
                            padding: 2,
                            display: 'block',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                        
                        <Typography component="h2" variant="h6">
                            Selecione um grupo para alterar
                        </Typography>                

                        {deleteValue && <Alert severity="success">Grupo excluído com sucesso!</Alert>}
                        {updateValue && <Alert severity="success">Grupo atualizado com sucesso!</Alert>}
                        {(getError && !groups)  && <Alert severity="error">Não foi possível carregar os grupos.</Alert>}
                        {(groups.length > 0) ? groups.map(({ room }, index) => (
                            <div>
                                <Button key={index} value={room} sx={{ mt: 3, mb: 2 }} variant="outlined" size="large" type="submit" onClick={(e)=>{e.preventDefault(); handleClick(e); DeleteName(room); setPrevName(room)}} >{room}</Button>
                            </div>
                        )): <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '200px' }}>  <CircularProgress />  </Box>}                                       
                        
                    </Box>
                </Box>
            </Container>
            </div>
        </div>
    )
}
