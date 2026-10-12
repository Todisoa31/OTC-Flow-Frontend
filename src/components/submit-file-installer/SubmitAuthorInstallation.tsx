import { useRecords } from "@/providers/CreateRecordProvider";
import { AuthorInstallation } from './stepComponent/SubmitFileStepOne';

type Props = Readonly<{
    authorTypes: AuthorInstallation[];
}>;

function SubmitAuthorInstallation(props: Props) {
    const { authorTypes  } = props;
    const { payload, setPayload } = useRecords();
    const { installed_by } = payload;

    const handleSelectAuthorType = (authInstallation: string) => {
        setPayload((prev) => ({
            ...prev,
            installed_by: authInstallation
        }));
    }

    return (
        <div className="self-stretch h-[125px] flex-col justify-start items-start gap-[15px] flex">
            <div className="text-dark-blue text-sm font-medium leading-[18px]">Les équipements sont installés par le :</div>
            <div className="self-stretch justify-start items-start gap-5 inline-flex">
                {authorTypes.map((item, index) => (
                    <div 
                        onClick={() => handleSelectAuthorType(item.code)}
                        key={index}
                        className={`${item.code === installed_by ? 'border-[3px] border-primary-blue' : ''} grow cursor-pointer shrink basis-0 h-[80px] px-[15px] bg-white rounded-[10px] justify-center items-center gap-2.5 flex`}
                    >
                        <div className={`text-center ${item.code === installed_by ? 'text-primary-blue' : 'text-dark-blue'} text-base font-bold leading-[18px]`}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubmitAuthorInstallation