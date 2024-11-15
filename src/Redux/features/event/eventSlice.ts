import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteEventApi, getDataEventApi, getEventByIdApi, getEventByOrganizerApi, tambahEventApi, updateEventApi } from "./eventApi";
import { eventType, Events } from "../type";
import { RootState } from "../../store";

const initialState: eventType = {
    events: [],
    selectedEvent: null,
    isEvent: false,
    message: '',
    loading: false,
    pagination: {
        total: 0,
        page: 1,
        lastPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
    },
}

// 1. State untuk mendapatkan data event
export const EventState = (state: RootState) => state.event;

// 2. Selector untuk error dan loading
export const EventErrorAndLoading = createSelector(
    [EventState], (eventState: eventType) => ({
        error: eventState.message,
        loading: eventState.loading
    })
);

// 3. Selector untuk pesan
export const EventMessage = createSelector(
    [EventState], (eventState: eventType) => eventState.message
);

// 4. Membuat Function Tambah Event 
export const tambahEvent = createAsyncThunk(
    'event/tambah',
    async ({ id, data }: { id: string; data: Events }, { rejectWithValue }) => {
        try {
            const response = await tambahEventApi(id, data);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message);
            }
        } catch (error) {
            return rejectWithValue('Terjadi kesalahan saat menambah event');
        }
    }
);

// 5. Function Untuk Menampilkan Semua Data Event
export const getDataEvent = createAsyncThunk(
    'event/getData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getDataEventApi();
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message);
            }
        } catch (error) {
            return rejectWithValue('Terjadi kesalahan saat mengambil data');
        }
    }
);

// 6. Function Untuk Menampilkan Event Berdasarkan Organizer
export const getEventsByOrganizer = createAsyncThunk(
    "event/getByOrganizer",
    async ({ organizerId, page }: { organizerId: string; page: number }, { rejectWithValue }) => {
        try {
            const response = await getEventByOrganizerApi(organizerId, page);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message);
            }
        } catch (error) {
            return rejectWithValue("Terjadi kesalahan saat mengambil data event");
        }
    }
);

// 7. Function Untuk Menampilkan Event Berdasarkan Id
export const getEventById = createAsyncThunk(
    'event/getById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await getEventByIdApi(id);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message);
            }
        } catch (error) {
            return rejectWithValue('Terjadi kesalahan saat mengambil data event');
        }
    }
);

// 8. Function Untuk Menghapus Data Event
export const deleteEventById = createAsyncThunk(
    'delete/event',
    async (id: string, { rejectWithValue }) => {
        try {
            const respon = await deleteEventApi(id)
            if (respon.success) {
                return respon.data
            } else {
                return rejectWithValue(respon.message)
            }
        } catch (error) {
            return rejectWithValue('Terjadi kesalahan Saat Hapus Event')
        }
    }
)

// 9. Function Untuk Mengupdate Data Event
export const updateEventById = createAsyncThunk(
    'update/event',
    async ({ id, data }: { id: string, data: Events }, { rejectWithValue }) => {
        try {
            const respon = await updateEventApi(id, data)
            if(respon.success){
                return respon.data
            }else{
                return rejectWithValue(respon.message)
            }
        }catch(error){
            return rejectWithValue('Terjadi kesalahan Saat Update Event')
        }
    }
)


// 8. Membuat Sebuah Redux Untuk Membuat / Menangani Sebuah State dan Untuk Membuat Action Pada Function
const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(tambahEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
                state.message = "Berhasil Menambahkan Event";
                state.isEvent = true;
                state.loading = false;
            })
            .addCase(tambahEvent.rejected, (state, action) => {
                state.message = action.payload as string;
                state.message = "Gagal menambahkan event";
                state.loading = false;
            })
            .addCase(getDataEvent.fulfilled, (state, action) => {
                state.events = action.payload;
                state.message = "Berhasil Mengambil Data";
                state.isEvent = true;
                state.loading = false;
            })
            .addCase(getDataEvent.rejected, (state, action) => {
                state.message = action.payload as string;
                state.loading = false;
                state.isEvent = false;
            })
            .addCase(getEventsByOrganizer.fulfilled, (state, action) => {
                state.events = action.payload.data;
                state.pagination = action.payload.pagination;
                state.message = "Berhasil Mengambil Data Event";
                state.isEvent = true;
                state.loading = false;
            })
            .addCase(getEventsByOrganizer.rejected, (state, action) => {
                state.message = action.payload as string;
                state.loading = false;
                state.isEvent = false;
            })
            .addCase(getEventById.fulfilled, (state, action) => {
                state.selectedEvent = action.payload;
                state.message = "Berhasil Mengambil Data Berdasarkan Event ID";
                state.isEvent = true;
                state.loading = false;
            })
            .addCase(getEventById.rejected, (state, action) => {
                state.message = action.payload as string;
                state.loading = false;
                state.isEvent = false;
            })
            .addCase(deleteEventById.fulfilled, (state, action) => {
                state.message = action.payload as string
                state.isEvent = true;
                state.events = state.events.filter((events) => events._id !== action.payload)
            })
            .addCase(deleteEventById.rejected, (state, action) => {
                state.message = action.payload as string
                state.isEvent = false;
            })
            .addCase(updateEventById.fulfilled, (state, action) => {
                const index = state.events.findIndex((event) => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                state.message = 'Data Event Berhasil Diupdate'
                state.isEvent = true
            })
            .addCase(updateEventById.rejected, (state, action) => {
                state.message = action.payload as string
                state.isEvent = false
            })
    }
});

export const { setMessage } = eventSlice.actions;
export default eventSlice.reducer;
