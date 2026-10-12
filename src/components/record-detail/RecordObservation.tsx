import Input from '../inputs/Input';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getRecordByIdApi } from '@/api/recordInstallerApi';

type Props = {
    id: number
    setObservation: Dispatch<SetStateAction<string>>;
    observation: string;
}

function RecordObservation(props: Props) {
    const { id, setObservation, observation } = props;

    const handleObservationChange = (value: string) => {
        setObservation(value);
    }

    const handleGetObservations = async () => {
        try {
            if(!id) return
            const response = await getRecordByIdApi(id);
            setObservation(response.observation_technique)
        } catch (error) {
            console.error('Error fetching observations:', error);
        }
    }

    useEffect(() => {
        handleGetObservations();
    }, [id]);

    return (
        <div className="self-stretch flex flex-col justify-start items-start gap-[15px]">
            <div className="justify-start text-[#101828] text-sm font-bold leading-[18px]">Observations techniques</div>
            <Input
                className="w-full text-xs text-[#646d81] rounded-[20px]"
                placeholder="Ajouter votre correction ..."
                type="text"
                value={observation}
                height="h-auto min-h-[78px]"
                onChange={(value) => handleObservationChange(value)}
                multiline={true}
            />
        </div>
    )
}

export default RecordObservation