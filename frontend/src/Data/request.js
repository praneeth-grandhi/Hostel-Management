import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';


// Get user permissions from backend (single source of truth)
export const FETCH_USER_PERMISSIONS = async () => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.get(`${API_BASE_URL}me/permissions/`, {
        headers: {
            Authorization: `Bearer ${auth?.access}`
        }
    });
    return response.data;
}

// Manage users
export const REGISTER_USER = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}register/`, userData);
    return response.data;
}

export const LOGIN_USER = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}login/`, userData);
    console.log(response);
    return response.data;
}

export const FETCH_USER_PROFILE = async () => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.get(`${API_BASE_URL}me/profile/`, {
        headers: {
            Authorization: `Bearer ${auth?.access}`
        }
    });
    return response.data;
}

export const UPDATE_USER_PROFILE = async (profileData) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    
    // Check if it's FormData (for file uploads) or regular object
    const isFormData = profileData instanceof FormData
    
    const response = await axios.put(`${API_BASE_URL}me/profile/`, profileData, {
        headers: {
            Authorization: `Bearer ${auth?.access}`,
            // Don't set Content-Type for FormData - axios will set it with boundary
            ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        }
    });
    return response.data;
}

export const CHANGE_PASSWORD = async (currentPassword, newPassword) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.put(`${API_BASE_URL}me/change-password/`, {
        current_password: currentPassword,
        new_password: newPassword
    }, {
        headers: {
            Authorization: `Bearer ${auth?.access}`
        }
    });
    return response.data;
}

// Manage hostels
export const CREATE_HOSTEL = async (hostelData) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.post(`${API_BASE_URL}hostels/`, hostelData, {
        headers: {
            Authorization: `Bearer ${auth?.access}`
        }
    });
    return response.data;
}

export const FETCH_HOSTELS = async () => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.get(`${API_BASE_URL}hostels/`, {
        headers: {
            Authorization: `Bearer ${auth?.access}`
        }
    });
    return response.data;
}

export const EDIT_HOSTEL = async (hostelId, hostelData) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.put(`${API_BASE_URL}hostels/${hostelId}/`, hostelData, {
        headers: {
            Authorization: `Bearer ${auth?.access}`
        }
    });
    return response.data;
}

export const DELETE_HOSTEL = async (hostelId) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.delete(`${API_BASE_URL}hostels/${hostelId}/`, {
        headers: {
            Authorization: `Bearer ${auth?.access}`
        }
    });
    return response.data;
}

export const CREATE_ADMIN_WITH_HOSTEL = async (adminHostelData) => {
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Add user fields
    formData.append('first_name', adminHostelData.first_name);
    formData.append('last_name', adminHostelData.last_name);
    formData.append('email', adminHostelData.email);
    formData.append('phone_number', adminHostelData.phone_number);
    formData.append('country_code', adminHostelData.country_code);
    formData.append('address', adminHostelData.address);
    formData.append('country', adminHostelData.country);
    formData.append('city', adminHostelData.city);
    formData.append('state', adminHostelData.state);
    formData.append('zip_code', adminHostelData.zip_code);
    formData.append('password', adminHostelData.password);
    formData.append('confirm_password', adminHostelData.confirm_password);
    
    // Add hostel fields
    formData.append('name', adminHostelData.hostel_name);
    formData.append('hostel_address', adminHostelData.hostel_address);
    formData.append('hostel_city', adminHostelData.hostel_city);
    formData.append('hostel_state', adminHostelData.hostel_state);
    formData.append('hostel_country', adminHostelData.hostel_country);
    formData.append('hostel_zip_code', adminHostelData.hostel_zip_code);
    formData.append('contact_phone', adminHostelData.contact_phone || '');
    formData.append('rooms', adminHostelData.rooms);
    formData.append('floors', adminHostelData.floors);
    formData.append('business_hours', adminHostelData.business_hours || '');
    
    // Add verification/document fields
    formData.append('hostel_type', adminHostelData.hostel_type || '');
    formData.append('food_provided', adminHostelData.food_provided || false);
    formData.append('police_verification', adminHostelData.police_verification || false);
    formData.append('police_verification_reference', adminHostelData.police_verification_reference || '');
    formData.append('gst_number', adminHostelData.gst_number || '');
    formData.append('fssai_license', adminHostelData.fssai_license || '');
    
    // Add file uploads if they exist
    if (adminHostelData.owner_id_proof) {
        formData.append('owner_id_proof', adminHostelData.owner_id_proof);
    }
    if (adminHostelData.property_proof) {
        formData.append('property_proof', adminHostelData.property_proof);
    }
    if (adminHostelData.trade_license) {
        formData.append('trade_license', adminHostelData.trade_license);
    }
    
    const response = await axios.post(`${API_BASE_URL}admin-register/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

// Manage co-admin
export const FETCH_CO_ADMINS = async () => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.get(`${API_BASE_URL}co-admins/`, {
        headers: { Authorization: `Bearer ${auth?.access}` }
    });
    return response.data;
}

export const CREATE_CO_ADMIN = async (data) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.post(`${API_BASE_URL}co-admins/`, data, {
        headers: { Authorization: `Bearer ${auth?.access}` }
    });
    return response.data;
}

export const DELETE_CO_ADMIN = async (id) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.delete(`${API_BASE_URL}co-admins/${id}/`, {
        headers: { Authorization: `Bearer ${auth?.access}` }
    });
    return response.data;
}

export const UPDATE_CO_ADMIN = async (id, data) => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    const response = await axios.put(`${API_BASE_URL}co-admins/${id}/update/`, data, {
        headers: { Authorization: `Bearer ${auth?.access}` }
    });
    return response.data;
}