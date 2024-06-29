/* eslint-disable react-refresh/only-export-components */
import {createContext, useContext} from 'react'
import { deleteDeveloper, updateDeveloper } from '../utils/devs/deleteeditDev';
import { useGetDevs } from '../utils/devs/useGetDevs';
export const DevsContext = createContext(undefined);

export const DevsProvider = ({ children }) => {
    const { devs, setDevs } = useGetDevs();
 
    const handleDelete = async (id) => {
        try {
            await deleteDeveloper(id);
            setDevs(prevDevs => prevDevs.filter(dev => dev.id !== id));
        } catch (error) {
            console.error('Error deleting developer:', error);
        }
    };
 
    const handleEdit = async (id, updatedData) => {
        try {
            await updateDeveloper(id, updatedData);
            setDevs(prevDevs =>
                prevDevs.map(dev =>
                    dev.id === id ? { ...dev, ...updatedData } : dev
                )
            );
        } catch (error) {
            console.error('Error updating developer:', error);
        }
    };
 
     const contextValue = {
         devs,
         setDevs,
         handleDelete,
         handleEdit
     };
 
     return (
         <DevsContext.Provider value={contextValue}>
             {children}
         </DevsContext.Provider>
     );
 };
 
 export const useDevsContext = () => useContext(DevsContext);
 

