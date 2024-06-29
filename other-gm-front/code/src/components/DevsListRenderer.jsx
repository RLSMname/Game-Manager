import { useState } from "react";
import { useDevsContext } from "../state/context";
import { DevTile } from "./DevTile";
import { DevEditForm } from "./ui/DevEditForm";
import Popup from 'reactjs-popup';
import { DevAddForm } from "./ui/DevAddForm";

export const DevsListRenderer = () => {
    const { devs, handleDelete } = useDevsContext();

    const handleDeleteClick = (id) => {
        console.log("delete button clicked");
        handleDelete(id);
    };


    const [editDeveloperId, setEditDeveloperId] = useState(null);

    const handleEditClick = (id) => {
        console.log("edit button clicked");
        setEditDeveloperId(id);
    };

    const handleCloseEdit = () => {
        console.log("close edit modal");
        setEditDeveloperId(null);
    };


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddClick = () => {
        console.log("add button clicked");
        setIsAddModalOpen(true);
    };

    const handleCloseAdd = () => {
        console.log("close add modal");
        setIsAddModalOpen(false);
    };

    return (
        <div>
            <h2>Developers</h2>
            <button className="button-style-2" onClick={handleAddClick}>Add Developer</button>
            <div className='infinite-scroll-container'>
                <ul>
                    {devs.map(
                        developer =>
                            <li style={{ marginBottom: '10px' }} key={developer.id}>
                                <div className='wrapper-card'>
                                    <DevTile id={developer.id} name={developer.name} />

                                    <div style={{ display: 'flex', alignItems: '' }} >
                                        <div className='img-wrapper-tile'>
                                            <img src="https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg?size=338&ext=jpg&ga=GA1.1.1141335507.1719273600&semt=sph"></img>
                                        </div>
                                        <div className='btn-wrapper-list-2'>
                                            <button className='button-style-1' onClick={() => handleEditClick(developer.id)}>Edit</button>
                                            <br></br>
                                            <button className='button-style-1' onClick={() => handleDeleteClick(developer.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                    )}
                </ul>
            </div>


            <Popup open={editDeveloperId !== null} onClose={handleCloseEdit}>
                <div className='popup'>
                    <h2>Edit Developer</h2>
                    <DevEditForm
                        developerId={editDeveloperId}
                        initialData={devs.find(dev => dev.id === editDeveloperId)}
                        onClose={handleCloseEdit}
                    />
                </div>
            </Popup>

            <Popup open={isAddModalOpen} onClose={handleCloseAdd}>
                <div className='popup'>
                    <h2>Add Developer</h2>
                    <DevAddForm onClose={handleCloseAdd} />
                </div>
            </Popup>
        </div>
    )
}
