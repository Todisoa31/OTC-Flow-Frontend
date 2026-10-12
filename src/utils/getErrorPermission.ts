"use client";

import { toast } from "react-toastify";

export function getErrrorMessage(error: any) {
    if ((error as any)) {
        if (error?.response?.data?.detail === "You do not have permission to perform this action.") {
            // toast.error("Vous n'avez pas le droit d'effectuer cette action.");
            toast.info("Vous n'avez pas le droit d'effectuer cette action. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.", {
                autoClose: 6000,
            });
            return;
        }
    }
}