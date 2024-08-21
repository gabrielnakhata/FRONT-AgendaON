import axios from 'axios';

const clientApi = axios.create({
    baseURL: 'https://api.kezukastyles.com.br/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const registerClient = async (clientData) => {
    try {
        const response = await clientApi.post('/Clientes', clientData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};

export const getClientId = async (token, id) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await clientApi.get(`/Clientes/${id}`, config);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};

export const getClient = async (token, page = 1, pageSize = 8) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page,
                pageSize
            }
        };

        const response = await clientApi.get('/Clientes', config);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};

export const updateClient = async (id, clientData, token) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await clientApi.put(`/Clientes/${id}`, clientData, config);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};