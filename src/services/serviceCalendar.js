import axios from 'axios';

const calendarApi = axios.create({
    baseURL: 'https://api.kezukastyles.com.br/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const registerCalendar = async (CalendarData, token) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await calendarApi.post('/Calendario', CalendarData, config);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};

export const getCalendarForCollaborator = async (colaboradorId, data, token) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const url = `/Calendario/colaborador/${colaboradorId}/${data}`;

        const response = await calendarApi.get(url, config);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};



// export const updateCalendar = async (id, CalendarData, token) => {
//     try {
//         const config = {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         };

//         const response = await calendarApi.put(`/Calendario/${id}`, CalendarData, config);
//         return response.data;
//     } catch (error) {
//         throw error.response ? error.response.data : new Error("An unexpected error occurred");
//     }
// };

export const deleteCalendar = async (id, token) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await calendarApi.delete(`/Calendario/${id}`, config);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};