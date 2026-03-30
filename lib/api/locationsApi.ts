import {api} from "./api";
import { Location, NewLocation} from "../../types/location";


export const fetchLocationByID = async (id: string): Promise<Location> => {
    const endPoint = `/locations/${id}`;

    const response = await api.get<Location>(endPoint);
        
    return response.data;
}


export const createLocation = async (location: NewLocation): Promise<Location> => {
    const endPoint = `/locations`;

    const response = await api.post<Location>(endPoint, location);

    return response.data;
}



