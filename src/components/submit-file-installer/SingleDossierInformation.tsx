import SubmitFileStepFourDetail, { Section } from './stepComponent/SubmitFileStepFourDetail';
import DetailIcon from '@/assets/icons/DetailIcon';
import WorkIcon from '@/assets/icons/WorkIcon';
import CostsIcon from '@/assets/icons/CostsIcon';
import DocumentIcon from '@/assets/icons/DocumentIcon';
import { useRecords } from '@/providers/CreateRecordProvider';
import { ExtractedDataItem } from '@/types/recordType';

const SingleDossierInformation = () => {
  const { payload, uploadPayload, extractedData } = useRecords();
    const {
        company_name,
        siret,
        work_address,
        address,
        form_type,
        date_of_quote_signature,
        date_of_invoice_issue,
        date_of_honor_statement_signature,
        reference,
        brand,
        quantity_length
    } = payload

    const {
        file_facture,
        file_devis,
        file_attestation,
        file_attestation_pose
    } = uploadPayload

    const detail1 = {
        title: 'Identification du bénéficiaire',
        icon: <DetailIcon />,
        items: [
            {
                title: 'Raison sociale :',
                value: company_name
            },
            {
                title: 'Numéro SIRET :',
                value: siret
            },
            {
                title: 'Adresse des travaux :',
                // value: `${work_address}, ${work_postal_code} ${work_city}`
                value: `${work_address}`
            },
            {
                title: 'Adresse du siège :',
                value: `${address}`
                // value: `${address}, ${postal_code} ${city}`
            }
        ]
    };

    const detail2: Section = {
        title: 'Détails des travaux',
        icon: <WorkIcon />,
        items: [
            {
                title: 'Type de dossier :',
                value: form_type
            },
            {
                title: 'Date de signature du devis :',
                value: date_of_quote_signature
            },
            {
                title: "Date d'émission de la facture :",
                value: date_of_invoice_issue
            },
            {
                title: "Date de signature de l'attestation :",
                value: date_of_honor_statement_signature
            },
            {
                title: 'Marque :',
                value: brand
            },
            {
                title: 'Référence :',
                value: reference
            },
            {
                title: 'Quantité/longueur :',
                value: quantity_length.toString()
            }
        ]
    };

    let detailDocuments: Section = {
        title: 'Documents soumis',
        icon: <DocumentIcon />,
        items: [
            {
                title: '',
                value: "Facture de l'installateur",
                isSubmitted: file_facture
            },
            {
                title: '',
                value: 'Devis signé',
                isSubmitted: file_devis
            },
            {
                title: '',
                value: "Attestation sur l'honneur",
                isSubmitted: file_attestation
            },
            // {
            //     title: '',
            //     value: 'Photos Avant / Après',
            //     isSubmitted: file_photos
            // },
            /*{
                title: '',
                value: 'Certificat de conformité',
                isSubmitted: file_certificat
            }*/
        ]
    };

    if(form_type === 'RES_EC_104'){
        detailDocuments.items.push({
            title: '',
            value: 'Attestation de pose',
            isSubmitted: file_attestation_pose
        });
    }

    const detail4: Section =
    {
        title: 'Montants et coûts',
        icon: <CostsIcon />,
        items: [
            {
                title: 'Total HT :',
                value: String(extractedData?.file_devis?.find((item: ExtractedDataItem) => item.variables === 'montant_ht')?.devis || '')
            },
            {
                title: 'TVA :',
                value: String(extractedData?.file_devis?.find((item: ExtractedDataItem) => item.variables === 'tva')?.devis || '')
            },
            {
                title: 'Total TTC:',
                value: String(extractedData?.file_devis?.find((item: ExtractedDataItem) => item.variables === 'montant_ttc')?.devis || '')
            }
        ]
    };

    return (
        <div className="px-[30px] justify-start items-start gap-[30px] flex flex-col self-stretch grow">
            <div className="px-[30px] justify-start items-start gap-[30px] inline-flex self-stretch">
                <SubmitFileStepFourDetail data={detail1} />
                <SubmitFileStepFourDetail data={detail2} />
            </div>
            <div className="px-[30px] justify-start items-start gap-[30px] inline-flex self-stretch">
                <SubmitFileStepFourDetail data={detailDocuments} />
                <SubmitFileStepFourDetail data={detail4} />
            </div>

        </div>
    )
}

export default SingleDossierInformation;
