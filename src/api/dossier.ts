import { Statuses } from '@/types/recordType';
import { ControlAssignType } from '@/types/teamType';
import axios from '@/utils/axiosConfig';
import { txt } from '@/utils/texts';
import { toast } from 'react-toastify';
import { parseErrorMessage } from "@/utils/commonUtils";

export const affectFolderApi = async (payloadAffect: ControlAssignType): Promise<any> => {
    try {
        const response = await axios.post(`/referent/assign_dossier`, payloadAffect);
        toast.success("Dossier affécté avec succées !");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création de l'équipe :", error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}

export const affectFolderConformiteApi = async (payloadAffect: ControlAssignType): Promise<any> => {
    try {
        const response = await axios.post(`/referent/assign_dossier_controlleur_conformite`, payloadAffect);
        toast.success("Dossier affécté avec succées !");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création de l'équipe :", error);        
        throw error;
    }
}

export const updateFolderStatusApi = async (folderId: number, statusCode: Statuses): Promise<any> => {
    try {
        const response = await axios.put(`/dossier/update_status_dossier/${folderId}`, { statusCode });
        toast.success("Statut mis à jour avec succès !");
        return response.data;
    } catch (error) {
                 // Vérifie si c’est une erreur Axios
        if (typeof error === "object" && error !== null && "response" in error) {
            // @ts-ignore
            toast.error(error.response?.data?.error)
        } else {
            console.log(error);
        }
        
        throw error; // si tu veux continuer à propager l’erreur
    }
}

// /dossier/get_comment/419
export const getFolderCommentsApi = async (folderId: number): Promise<any> => {
    try {
        const response = await axios.get(`/dossier/get_comment/${folderId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires du dossier :", error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}

// /dossier/add_comment/419
export const addFolderCommentApi = async (dossier_id: number, comment: string): Promise<any> => {
    try {
        const response = await axios.post(`/dossier/post_commentaire`, { dossier_id, comment });
        toast.success("Commentaire ajouté avec succès !");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire au dossier :", error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}

// /dossier/delete_comment/419/123
export const deleteFolderCommentApi = async (folderId: number, commentId: number): Promise<any> => {
    try {
        const response = await axios.delete(`/dossier/delete_comment/${folderId}/${commentId}`);
        toast.success("Commentaire supprimé avec succès !");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du commentaire du dossier :", error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}
// /dossier/update_comment/419/123
export const updateFolderCommentApi = async (commentId: number, comment: string): Promise<any> => {
    try {
        const response = await axios.put(`/dossier/put_comment/${commentId}`, { comment });
        toast.success("Commentaire mis à jour avec succès !");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du commentaire du dossier :", error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}

// /dossier/add_comment/419
export const addFolderCommentObservationApi = async (dossier_id: number, comment?: string, observation?: string): Promise<any> => {
    try {
        if(!comment && !observation) {
            throw new Error("Aucun commentaire ou observation fourni.");
        }
        const response = await axios.post(`/dossier/save_control_notes`, { dossier_id, comment, observation });
        toast.success("Ajouté avec succès !");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire au dossier :", error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}

export const updateMultipleFolderStatusApi = async (dossier_ids: number[], statusCode: Statuses): Promise<any> => {
    try {
        if(dossier_ids.length === 0) {
            throw new Error("Aucun dossier sélectionné pour la mise à jour.");
        }
        const response = await axios.put(`/dossier/batch_update_status_dossiers`, { dossier_ids, statusCode });
        toast.success("Statuts mis à jour avec succès !");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour des statuts des dossiers :", error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}

