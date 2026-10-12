import { uploadRecordFilev2Api } from '@/api/recordInstallerApi';
import { UploadStatus } from '@/components/inputs/DocUploader';
import { useRecords } from '@/providers/CreateRecordProvider';
import { RecordFileJobId } from '@/types/recordType';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import InputsList from './inputsForm/InputsList';

export type FileUploadingStatus = Record<keyof RecordFileJobId, UploadStatus>;
export type FileUploadingTimes = Record<keyof RecordFileJobId, number>;

type Props = Readonly<{
    fileUploadingStatus: FileUploadingStatus;
    setUploadingFileStatus: Dispatch<SetStateAction<FileUploadingStatus>>;
}>;

const DefaultTimes = {
    file_devis: 0,
    file_facture: 0,
    file_attestation: 0,
    file_attestation_pose: 0,
    file_certificat:0,
    file_photos:0,
    file_immatriculation: 0,
    file_cadre_contribution: 0,
    file_attestation_desembouage:0,
    other_file: 0,
    images: 0,
    file_precarite: 0
}

function SingleDossier(props: Props) {
    const { fileUploadingStatus, setUploadingFileStatus } = props;
    const [refDossier, setRefDossier] = useState<string>('');

    const [fileUploadingTime, setFileUploadingTime] = useState<FileUploadingTimes>(DefaultTimes);
    const [imageUploadStatus, setImageUploadStatus] = useState<UploadStatus>('initial');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedImages, setUploadedImages] = useState<{ id: number; url: string; file: File }[]>([]);
    const attestationPoseInputRef = useRef<HTMLInputElement>(null);
    
    const { payload, setPayload, uploadPayload, setUploadPayload, setExtractedData, isAttInsideAttPose, setIsAttInsideAttPose } = useRecords();

    const handleUpdateFileStatus = (key: keyof RecordFileJobId, status: UploadStatus) => {
        setUploadingFileStatus(prevState => ({
            ...prevState,
            [key]: status
        }));
    }

    const handleUploadFile = async (file: File, key: keyof RecordFileJobId) => {
        
        /*const intervale = setInterval(() => {
            setFileUploadingTime(prevState => ({
                ...prevState,
                [key]: prevState[key] + 1
            }));
        }, 1000);*/
        
        try {
            handleUpdateFileStatus(key, 'extracting');
            const response = await uploadRecordFilev2Api(key, file, payload.form_type, payload.job_id);
            if (response.data) {
              
                setPayload(prev => ({
                    ...prev,
                    items: {
                        ...prev.items,
                        [key]: response.data
                    }
                }));
                
                setExtractedData(prev => ({
                    ...prev,
                    [key]: response.data
                }));                
            }
            /*clearInterval(intervale);*/
            handleUpdateFileStatus(key, 'success');
            return true
        } catch (error) {
            console.error(key, 'Error uploading files:', error);
            handleUpdateFileStatus(key, 'error');
            return false
        }
    }

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, key: keyof RecordFileJobId) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadPayload(prev => ({
                ...prev,
                [key]: file
            }));
            handleUploadFile(file, key);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
            setImageUploadStatus('uploading');
            setUploadPayload(prev => ({
              ...prev,
              file_photos: file
            }))
            
            // Simuler un upload réussi pour le moment
            setTimeout(() => {
                setImageUploadStatus('success');
                // Créer une URL pour la prévisualisation
                const imageUrl = URL.createObjectURL(file);
                setUploadedImages(prev => [...prev, { id: Date.now(), url: imageUrl, file }]);
                setUploadedImage(null);
            }, 1000);
        }
    };

    const handleRemoveImage = (id: number) => {
        setUploadedImages(prev => {
            const newImages = prev.filter(img => img.id !== id);
            return newImages;
        });
    };

    //create times function
    const ct = (key: keyof RecordFileJobId ) => {
        return fileUploadingTime[key] != 0 ? `(${fileUploadingTime[key]} sec)` : ''
    }

    useEffect(() => {
        setUploadPayload({
            ...uploadPayload,
            type_formulaire: payload.form_type
        })
        
        return () => {
            setFileUploadingTime(DefaultTimes);
            // Nettoyer les URLs des images lors du démontage du composant
            uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
        };
    }, [payload.form_type])

    // Effect to reset image uploader state when all images are removed
    useEffect(() => {
        if (uploadedImages.length === 0) {
            setImageUploadStatus('initial');
            setUploadPayload(prev => ({
                ...prev,
                file_photos: null
            }));
        }
    }, [uploadedImages, setUploadPayload, setImageUploadStatus]);


    useEffect(() => {
      if (isAttInsideAttPose) {
        // Vider l'input file DOM
        if (attestationPoseInputRef.current) {
          attestationPoseInputRef.current.value = ""; // vide visuellement
        }

        setPayload((prev) => ({
          ...prev,
          items: {
            ...prev.items,
            file_attestation_pose: null,
          },
        }));
        setUploadingFileStatus((prev) => ({
          ...prev,
          file_attestation_pose: 'initial',
        }));
      }
    }, [isAttInsideAttPose]);


 

    return (
        <div className="flex-col justify-center items-center gap-[30px] inline-flex self-stretch">
          <InputsList formType={payload.form_type} fileUploadingStatus={fileUploadingStatus} setUploadingFileStatus={setUploadingFileStatus}/>
        </div>
    )
}

export default SingleDossier