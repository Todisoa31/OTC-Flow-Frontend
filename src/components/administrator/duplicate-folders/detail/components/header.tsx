import DownloadIcon from "@/assets/icons/DownloadIcon";
import { ROLE_CONTROLLER, ROLE_INSTALLER } from "@/constants/userConst";

export default function HeaderDuplicateFolderDetail() {
    // Data for project details
    const projectDetails = [
        {
            label: "Type de dossier :",
            value: "BAR-TH-160",
        },
        {
            label: "Référence :",
            value: "0123456789",
        },
        {
            label: "Montant :",
            value: "15 000 €",
        },
        {
            label: "Soumission :",
            value: "11 mars 2025",
        },
        {
            label: "Mise à jour :",
            value: "15 mars 2025",
        },
    ];

    // Data for team members
    const teamMembers = [
        {
            role: ROLE_CONTROLLER,
            name: "Hugo Holmgren",
            image: "/images/usProfil.jpg",
        },
        {
            role: "Référent",
            name: "Linnea Johansson",
            image: "/images/usProfil.jpg",
        },
        {
            role: ROLE_INSTALLER,
            name: "Lisa Ahmed",
            image: "/images/usProfil.jpg",
        },
    ];

    return (
        <div className="flex flex-col w-full items-start gap-5 p-[30px] relative bg-[#fefefe66] border border-solid border-[#ffffffb2]">
            <header className="flex items-center justify-center gap-5 relative self-stretch w-full flex-[0_0_auto] z-[2]">
                <div className="flex items-center gap-2.5 relative flex-1 grow">
                    <h2 className="relative w-fit mt-[-1.00px] text-[24px] font-bold text-[#646E81] tracking-[var(--24-bold-letter-spacing)] leading-[var(--24-bold-line-height)] whitespace-nowrap [font-style:var(--24-bold-font-style)]">
                        Maison Dupont
                    </h2>
                </div>

                <div className="inline-flex h-10 items-center justify-center gap-2.5 px-[15px] py-2.5 relative flex-[0_0_auto] bg-[#65bfaa] rounded-[10px]">
                    <span className="relative w-fit [font-family:'Roboto-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                        Validé
                    </span>
                </div>

                <button
                    className="inline-flex h-10 items-center gap-2.5 px-5 py-0 relative flex-[0_0_auto] bg-black rounded-[10px] shadow-[0px_10px_40px_#00000066] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    aria-label="Télécharger les documents"
                >
                    <DownloadIcon />
                    <span className="relative w-fit [font-family:'Roboto-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                        Télécharger les documents
                    </span>
                </button>
            </header>

            <section
                className="flex items-start gap-5 relative self-stretch w-full flex-[0_0_auto] z-[1]"
                aria-label="Détails du projet"
            >
                {projectDetails.map((detail, index) => (
                    <div
                        key={index}
                        className={`text-[12px] text-[#3A5F6E] flex flex-col items-start justify-center gap-2.5 p-[15px] relative flex-1 grow mt-[-1.00px] mb-[-1.00px] ${index === 0 ? "ml-[-1.00px]" : ""} ${index === projectDetails.length - 1 ? "mr-[-1.00px]" : ""} bg-[#fefefe66] rounded-[10px] border border-solid border-[#ffffffb2] shadow-[0px_4px_15px_#0000000d] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]`}
                    >
                        <div className="relative w-fit  text-bleu-fonc text-[length:var(--12-medium-font-size)] tracking-[var(--12-medium-letter-spacing)] leading-[var(--12-medium-line-height)] whitespace-nowrap [font-style:var(--12-medium-font-style)]">
                            {detail.label}
                        </div>
                        <div className="relative font-bold w-fit  text-black text-[length:var(--12-bold-font-size)] tracking-[var(--12-bold-letter-spacing)] leading-[var(--12-bold-line-height)] whitespace-nowrap [font-style:var(--12-bold-font-style)]">
                            {detail.value}
                        </div>
                    </div>
                ))}
            </section>

            <section
                className="flex items-start gap-5 relative self-stretch w-full flex-[0_0_auto] z-0"
                aria-label="Équipe du projet"
            >
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className={` text-[12px] flex items-center gap-2.5 p-[15px] relative flex-1 grow  ${index === 0 ? "ml-[-1.00px]" : ""} ${index === teamMembers.length - 1 ? "mr-[-1.00px]" : ""} bg-[#fefefe66] rounded-[10px] border border-solid border-[#ffffffb2] shadow-[0px_4px_15px_#0000000d] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]`}
                    >
                        <img
                            className="relative w-[30px] h-[30px] z-[1] object-cover rounded-full"
                            alt={`Photo de ${member.name}`}
                            src={member.image}
                        />
                        <div className="inline-flex flex-col items-start gap-2relative flex-[0_0_auto] z-0">
                            <div className=" text-[#3A5F6E] relative w-fit mt-[-1.00px] font-14-medium font-[number:var(--14-medium-font-weight)] text-bleu-fonc text-[length:var(--14-medium-font-size)] tracking-[var(--14-medium-letter-spacing)] leading-[var(--14-medium-line-height)] whitespace-nowrap [font-style:var(--14-medium-font-style)]">
                                {member.role}
                            </div>
                            <div className="relative font-bold w-fit  text-black text-[length:var(--14-bold-font-size)] tracking-[var(--14-bold-letter-spacing)] leading-[var(--14-bold-line-height)] whitespace-nowrap [font-style:var(--14-bold-font-style)]">
                                {member.name}
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};
