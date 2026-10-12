
import axios from '@/utils/axiosConfig';

export const updateTraApi = async (file_id: string, reqBody: Record<string, any>) => {
   try {
    const response = await axios.put(`/extract/update-file-tra/${file_id}`,  reqBody );
    return response.data;
  } catch (error) {
    console.error('Error updating recap status:', error);    
    throw error;
  }
}