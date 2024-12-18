import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../services/api';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';

export const Data = () => {
    const { id } = useParams();
    const [getUser, setDataUser] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    const fetchData = async () => {
        try {
            const response = await api.get(`tickets/data/${id}`);
            const tickets = response.data.data.tickets;
            console.log("Response update status:", response.data.data.tickets);
            if (!tickets || tickets.length === 0) {
                setErrorMessage("Data tiket tidak tersedia");
            } else {
                setDataUser(tickets);
            }
        } catch (error) {
            setErrorMessage(" Data Ticket Belum Tersedia");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (ticketId: string) => {
        try {
            const response = await api.put(`tickets/status/${ticketId}`);
           
            fetchData();
        } catch (error) {
            alert("Gagal memperbarui status tiket");
        }
    };

    // Tentukan kolom tabel berdasarkan status tiket
    const columns = [
        { name: 'No', selector: (row: any) => row.no, sortable: true },
        { name: 'Nama Tiket', selector: (row: any) => row.name, sortable: true },
        { name: 'Kode Tiket', selector: (row: any) => row.code, sortable: true },
        { name: 'Nama Pemesan', selector: (row: any) => row.fullName, sortable: true },
        { name: 'Tanggal', selector: (row: any) => row.createdAt, sortable: true },
        {
            name: "Status",
            cell: (row: any) => (
                <span
                    className={`px-4 py-2 w-36 text-center font-bold rounded-full text-white ${row.status === "USED" ? "bg-red-400" : "bg-secondary"
                        }`}
                >
                    {row.status.toUpperCase()}
                </span>
            ),
            sortable: true,
        },
        ...(getUser.some((ticket) => ticket.status !== "USED")
            ? [
                {
                    name: "Action",
                    cell: (row: any) => (
                        row.status !== "USED" && (
                            <button
                                className="bg-primary hover:bg-sky-800 text-white font-bold  px-3 py-2 rounded-full"
                                onClick={() => updateStatus(row.action)}
                            >
                                Update Status
                            </button>
                        )
                    ),
                }
            ]
            : []),
    ];

    const rows = getUser.map((item, index) => ({
        no: index + 1,
        name: item.name || '-',
        code: item.code || '-',
        fullName: item.payment?.user?.fullName || '-',
        createdAt: new Date(item.createdAt).toLocaleString(),
        status: item.status,
        action: item._id,
    }));

    const filteredRows = rows.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const customStyles = {
        rows: { style: { fontSize: '14px', padding: '10px' } },
        headCells: {
            style: {
                backgroundColor: '#f4f4f4',
                fontWeight: 'bold',
                color: '#333',
                fontSize: '16px',
            },
        },
        pagination: { style: { color: '#000', fontSize: '14px' } },
    };

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (errorMessage) {
        return (
            <div className="text-center text-black font-bold p-4 text-lg">
                {errorMessage}
            </div>
        );
    }

    // Jika data tersedia, tampilkan tabel
    return (
        <div className="container mx-auto px-4 py-5">
            <Link to={`/organizer/event`} className='text-black flex items-center gap-2 mb-5'>
                <IoChevronBackOutline size={24} />
                <span>Back to Events</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-black mb-5">Ticket Management</h1>

            <div className="card shadow-lg border-gray-300 p-4">
                <DataTable
                    columns={columns}
                    data={filteredRows}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    highlightOnHover
                    responsive
                    customStyles={customStyles}
                    fixedHeader
                    subHeader
                    subHeaderComponent={
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="p-2 border border-gray-300 rounded-full w-full max-w-xs bg-white mb-3"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    }
                />
            </div>
        </div>
    );
};
