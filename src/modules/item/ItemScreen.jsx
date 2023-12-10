import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/authContext';
import AxiosClient from '../../shared/plugins/axios';
import { Badge, Button } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import DataTable from 'react-data-table-component';
import ItemForm from './components/ItemForm';

const ItemScreen = () => {
    const user = useContext(AuthContext)
    const { token } = user;
    const [items, setItems] = useState([]);
    const [showModalForm, setShowModalForm] = useState(false);

    const getAllItems = async () => {
        try {
            const response = await AxiosClient({
                url: "/item/",
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            })
            setItems(response);
        } catch (error) {
            console.log(error)
        }
    }
    const changeStatus = async (id) => {
        try {
            const response = await AxiosClient({
                url: `/item/status/${id}`,
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (error) {
            console.log(error)
        } finally {
            getAllItems();
        }
    }
    useEffect(() => {
        getAllItems();
    }, []);
    const columns = React.useMemo(() => [
        {
            name: "ID",
            selector: (row) => row.id,
        },
        {
            name: "Plataforma",
            selector: (row) => row.plataforma,
            sortable: true,
            fixed: true,
        },
        {
            name: "titulo",
            selector: (row) => row.titulo,
            sortable: true,
            fixed: true,
        },
        {
            name: "descripcion",
            selector: (row) => row.descripcion,
            sortable: true,
            fixed: true,
        },
        {
            name: "Estado de renta",
            selector: (row) => {
                switch (row.estado) {
                    case 1:
                        return "Disponible";
                    case 2:
                        return "Rentado";
                    default:
                        return "Desconocido";
                }
            },
            sortable: true,
            fixed: true,
        }
        ,
        {
            name: "Estatus",
            cell: (row) =>
                row.status ? (
                    <Badge bg="success"> ACTIVO </Badge>
                ) : (
                    <Badge bg="danger">INACTIVO</Badge>
                ),
        },
        {
            name: "ACCIONES",
            cell: (row) => (
                <>
                    <Button
                        variant='warning'
                        type="btn btn-outline-warning btn-circle me-1"
                        size={16}
                    // onClick={() => {
                    //   setIsEditting(true);
                    //   setSelectedFamily(row);
                    // }}
                    ><FeatherIcon icon={'edit'}/></Button>
                    {row.status ? (
                        <Button
                            variant='danger'
                            size={15}
                            onClick={() => changeStatus(row.id)}
                        ><FeatherIcon icon={'trash'} /></Button>
                    ) : (
                        <Button
                            variant='success'
                            size={15}
                            onClick={() => changeStatus(row.id)}
                        ><FeatherIcon icon={'save'} /></Button>
                    )}
                </>
            ),
        },
    ])
    return (
        < >
            <div style={{ justifyContent: 'ceneter', alignItems: "center", backgroundColor: "transparent", height: "92vh", padding: 20 }}>
                <div>
                    <div className="App">
                        <DataTable


                            title={

                                <div style={{ display: "flex", flexDirection: "row" }}>

                                    <div style={{ width: "95%", paddingTop: 3 }}>
                                        Items
                                    </div>

                                    <div >
                                        <FeatherIcon className='DataIcon' icon={'plus'} onClick={() => setShowModalForm(true)} style={{ height: 40, width: 40 }} />
                                    </div>
                                </div>
                            }
                            columns={columns}
                            data={items}
                            pagination
                            highlightOnHover
                            paginationPerPage={8}
                            paginationComponentOptions={{
                                rowsPerPageText: '',
                                noRowsPerPage: true,
                            }}
                        />
                    </div>
                </div>
            </div>
            <ItemForm 
            isOpen={showModalForm}
            data={getAllItems}
            onClose={() => setShowModalForm(false)}
            token={token}/>
        </>
    );
}

export default ItemScreen;
