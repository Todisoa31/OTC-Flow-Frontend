import Modal from './Modal';
import DocumentIcon2 from '@/assets/icons/DocumentIcon2';

export type PopupInfoType = 'success' | 'success-1' | 'warning' | 'error'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    footer?: React.ReactNode;
    text: string | React.ReactNode;
    title: string;
    icon?: React.ReactNode;
    type: PopupInfoType;
}

const textColor = (type: PopupInfoType = 'success-1') => {
    switch (type) {
        case 'success':
            return 'text-primary-blue';
        case 'warning':
            return 'text-primary-orange';
        case 'error':
            return 'text-pink-500';
        default:
            return 'text-primary-green';
    }
}

const bgColor = (type: PopupInfoType = 'success-1') => {
    switch (type) {
        case 'success':
            return 'bg-[#c3d6e9]/30';
        case 'warning':
            return 'bg-[#fbc467]/10';
        case 'error':
            return 'bg-pink-500/10';
        default:
            return 'bg-[#c3d6e9]/30';
    }
}



function InfoPopup({ isOpen, footer, icon, title, text, type, onClose }: Props) {
    return (
        <Modal
            title=''
            isOpen={isOpen}
            onClose={onClose}
            titleClassName={bgColor(type)}
        >
            <div className="w-[500px] absolute top-0 h-auto pb-[20px] flex flex-col relative bg-white  overflow-hidden gap-[20px]">
                <div className={`w-full h-[200px] ${bgColor(type || 'success-1')} inline-flex flex-col justify-start items-center gap-5`}>
                    <div className="w-[120px] h-[120px] relative overflow-hidden">
                        {icon ?? <DocumentIcon2 />}
                    </div>
                    <div className={`${textColor(type || 'success-1' )} relative justify-start text-base font-bold `}>
                        {title}
                    </div>
                </div>
                <div className="w-full px-[30px] inline-flex flex-col justify-center items-center gap-[30px]">
                    <div className="relative text-[#3a5f6e] flex w-full text-center justify-center items-center text-dark-blue text-sm font-medium ">
                       {text}
                    </div>
                    <div className="self-stretch h-[40px] inline-flex justify-center items-start gap-5">
                        {footer}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default InfoPopup