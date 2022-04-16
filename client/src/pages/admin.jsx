import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/auth';
import { useNavigate } from "react-router-dom";
import Api from '../api/api'

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

    const [sucess, setSucess] = useState(false);
    const [updateValue, setUpdate] = useState(false);
    const [deleteValue, setDelete] = useState(false);

    let navigate = useNavigate();

    const handleBack = () =>{
        navigate("/rooms")
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomName({
          ...roomName,
          [name]: value
        })
      };
    
    
    const PrevName = (e) => {
    const { name, value } = e.target;
        setPrevName({
            ...prevName,
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
        const { name, value } = e.target;
        setDeleteName({
            ...deleteName,
            [name]: value
        })
    };

    const postRooms = async () =>{

        try {
            const addGroup = await Api.post('/rooms/createRoom',{
                room: roomName.room
            })
            if (addGroup){
                setSucess(true);
                setError(false);
                setRoomName("")
                setTimeout(() => {
                    setSucess(false)
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
    }, [groups]);

    const updateRoom = async (e) =>{  
        if ( window.confirm(`Atualizar grupo ${prevName.prevName}?`)){
            try {
                const updateGroup = await Api.patch('/rooms/updateRoom', {
                    prevRoom: prevName.prevName,
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
        <div>
            <button onClick={handleBack}>Lista de grupos</button><br/>
            <button onClick={handleLogout}>Logout</button>
            <br/>
            {hasError && <div>{errorValue}</div>}
            <h2>Novo grupo</h2>
            <input name="room" id={roomName} value={roomName.room || ""} placeholder='Digite o nome do novo grupo' onChange={(e)=>handleChange(e)}/><br/>
            <br/>
            <button onClick={(e)=>{e.preventDefault(); postRooms()}}>Salvar</button>
            <br/>
            {sucess && <div>Grupo cadastrado com sucesso!</div>}

            <h2>Grupos cadastrados</h2>
            {getError && <div>Não foi possível carregar os grupos.</div>}
            <ul>{groups.map(({ room }, index) => (
                            <li key={index} value={room}>{room}</li>
                            ))}
            </ul>
            
            <h2>Atualizar grupo</h2>
            <input name="prevName" id={prevName} value={prevName.prevName || ""} placeholder='Digite um grupo para atualizar' onChange={(e)=>PrevName(e)}/><br/>
            <input name="updateName" id={updateName} value={updateName.updateName || ""} placeholder='Digite o novo nome do grupo' onChange={(e)=>UpdateName(e)}/>
            <br/>
            <button onClick={()=>updateRoom(updateName.updateName)}>Atualizar</button>
            {updateValue && <div>Grupo atualizado com sucesso!</div>}


            <h2>Excluir grupo</h2>
            <input name="deleteName" id={deleteName} value={deleteName.deleteName || ""} placeholder='Digite um grupo para excluir' onChange={(e)=>DeleteName(e)}/>
            <br/>
            <button onClick={()=>deleteRoom(deleteName.deleteName)}>Deletar</button>
            {deleteValue && <div>Grupo excluído com sucesso!</div>}
        </div>
    )
}
