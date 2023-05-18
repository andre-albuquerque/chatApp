import { useEffect, useState, useContext } from 'react';
import { Users2Icon } from 'lucide-react';
import { RoomContext  } from '../app/context/page';

const Sidebar = () => {
    
    const [rooms, setRooms] = useState([]);
    
    const [messages, setMessages] = useState([]);

    const { setRoomSelected, roomSelected } = useContext(RoomContext);

    useEffect(() => {
        
        let dataRooms = [];

        getRooms().then((data) => {

            if (data) {
                dataRooms = data.rooms;
                dataRooms && dataRooms.length > 0 && setRooms(dataRooms.reverse());
            }
            
        })
    },[]);

    const getChat = () => {

        let dataMessages = [];

        rooms.map((room) => {
                getMessages(room.room).then((data) => {
                if (data.chatMessages.length > 0) {
                    dataMessages.push(data);
                }
            })
        })
        
        setMessages(dataMessages);

    };

    useEffect(() => {
        getChat()
    },[rooms]);


    const roomSelectedHandler = (room) => {
        setRoomSelected(room);
    }


    return (
        <>
        <div>
            { rooms ? rooms.map((room) => {
                return <div key={room._id} onClick={()=>roomSelectedHandler(room.room)}>
                    <div className={roomSelected === room.room ? (
                                    "flex flex-row w-[100%] border-b-2 items-center \
                                    border-gray-100 p-2 hover:bg-gray-200 cursor-pointer \
                                    lg:h-16 bg-gray-200") :
                                     ("flex flex-row w-[100%] border-b-2 items-center \
                                     border-gray-100 p-2 hover:bg-gray-200 cursor-pointer \
                                    lg:h-16")}>
                        <Users2Icon className="h-6 w-[10%]" />
                        <div className="flex flex-col ml-2 w-[90%]">
                            <span className="ml-2 text-base font-bold">{room.room}</span>
                            
                            {messages && messages.map((message, index) => {
                                return(
                                    (
                                        <div className='grid grid-cols-2' key={index.toString()}>                                        
                                            {message.chatMessages[0].group === room.room &&
                                                <>
                                                <span className="ml-2 text-sm truncate">
                                                    {message.chatMessages[0].name}: {message.chatMessages[0].message}
                                                </span>
                                            
                                                <span className='self-center hidden text-xs
                                                                md:block justify-self-end'> 
                                                    {formatDate(message.chatMessages[0].time)}
                                                </span>
                                                </>
                                            }
                                        </div>
                                    )
                                )
                            })}
                        </div>
                    </div>
                </div>
            }): <div className='text-center'>
                Nenhuma sala encontrada</div>}
        </div>
        </>
    )
}


const formatDate = (date) => {
    const d = new Date(date);
    const time = d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) + ' - ' + 
                d.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: '2-digit' });
    return time;
}

const getRooms = async () => {
    const url = "http://localhost:8000/rooms/rooms";

    const auth = localStorage.getItem('auth');

    const headers = {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${auth}`
    }
    const response = await fetch(url, { headers });
    
    return response.json();

}   

const getMessages = async (room) => {
    const url = `http://localhost:8000/chat/getRecentChat/?group=${room}`;

    const auth = localStorage.getItem('auth');

    const headers = {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${auth}`
    }

    const response = await fetch(url, { headers });

    return response.json();
}

export default Sidebar;