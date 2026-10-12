import { colors } from "@/constants/colors";
import { ALL_STATUSES_OPTIONS } from "@/constants/records";
import { Statuses, StatusesLabel } from "@/types/recordType";

export function getColorByStatus(status: Statuses, isCofrac?: boolean): { bgClass: string; colorClass: string; iconColor: string, borderClass: string; label: StatusesLabel } {
    let bgClass = "";
    let colorClass = "";
    let borderClass = "";
    let iconColor="";
    let label: StatusesLabel = "Brouillon";

    const getLabel = (status: Statuses) => {
        return ALL_STATUSES_OPTIONS.find((option) => option.value === status)?.label as StatusesLabel;
    }

    switch (status) {
        case "draft":
            bgClass = "bg-[#646d81]/10";
            borderClass = "outline-grey";
            colorClass = "text-dark-blue";
            label = getLabel(status);
            break;
        case "inprocess":
        case "in_control":
        case 'service_request':
            bgClass = "bg-primary-orange";
            borderClass = "outline-primary-blue";
            colorClass = "text-white";
            iconColor = "white";
            label = getLabel(status);
            break;
        case "approved":
            bgClass = isCofrac ? "bg-grey-transparent" : "bg-primary-green";
            borderClass = "outline-primary-green";
            colorClass = isCofrac ? "text-dark-blue" : "text-white";
            iconColor = isCofrac? colors.darkBlue : "white";
            label = getLabel(status);
            break;
        case "satisfactory":
        case "fully_validated":
            bgClass = "bg-primary-green";
            borderClass = "outline-primary-green";
            colorClass = "text-white";
            iconColor = "white";
            label = getLabel(status);
            break;
        case "tocorrect":
            bgClass = "bg-primary-orange";
            borderClass = "outline-primary-orange";
            colorClass = "text-white";
            iconColor = "white";
            label = getLabel(status);
            break;
        case "corrected":
            bgClass = "bg-[#65A5BF]";
            borderClass = "outline-primary-orange";
            colorClass = "text-white";
            iconColor = "white";
            label = getLabel(status);
            break;
        case "refused":
        case "unsatisfactory":
        case "refused_control":
            bgClass = "bg-pink-500";
            borderClass = "outline-pink-500";
            colorClass = "text-white";
            iconColor = "white";
            label = getLabel(status);
            break;
        case "tobeprocessed":
            bgClass = "bg-grey";
            borderClass = "outline-grey";
            colorClass = "text-white";
            iconColor = "white";
            label = getLabel(status);
            break;
        default:
            bgClass = "!bg-[#65A5BF]";
            borderClass = "outline-grey";
            colorClass = "text-white";
            iconColor = "white";
            label = getLabel(status);
            break;           
    }

    return {
        bgClass,
        colorClass,
        borderClass,
        iconColor,
        label,
    }
}

export function getColorByScore(score: number | null): { bgClass: string; colorClass: string; borderClass: string } {
        if(score && score >= 90) {
            return {
                bgClass: "bg-primary-green",
                colorClass: "text-white",
                borderClass: "outline-primary-green",
            };
        } else if(score && score >= 60) {
            return {
                bgClass: "bg-primary-orange",
                colorClass: "text-white",
                borderClass: "outline-primary-orange",
            }
        }
        return {
            bgClass: "bg-pink-500",
            colorClass: "text-white",
            borderClass: "outline-pink-500",
        };
}