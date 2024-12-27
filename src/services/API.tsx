import axios from "axios";
import { API_URL } from "@/constants";
import { useSelector } from "react-redux";

export const GetRequest = async (url: string) => {
    const token = localStorage.getItem("VI_token");

    if (!token) {
        console.log("No token found");
        const response = await axios.get(`${API_URL}/${url}`);
        return response;
    }

    const response = await axios.get(`${API_URL}/${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export const AuthorisedPost = async (url: string, data: any) => {
    const token = useSelector((state: any) => state.auth.token);
    const response = await axios.post(`${API_URL}/${url}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}
