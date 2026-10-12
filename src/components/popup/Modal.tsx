import ClosePopupIcon from '@/assets/icons/ClosePopupIcon';
import { cn } from '@/utils/tailwind';
import ReactModal from 'react-modal';

type Props = {
    title: string;
    isOpen: boolean;
    onClose?: () => void
    className?: string
    titleClassName?: string
    children?: React.ReactNode
    footer?: React.ReactNode
    footerClassName?: string
}

function Modal(props: Props) {
    const { title, isOpen, onClose, className, children, footer, titleClassName, footerClassName } = props

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={true}
            contentLabel={title}
            className={cn(["relative bg-white overflow-hidden rounded-[40px] w-auto mx-auto flex flex-col max-h-[calc(100vh-200px)]", className])}
            overlayClassName="fixed inset-0 bg-black/60 flex justify-center items-center"
        >
            <div className={cn(["self-stretch px-[30px] py-5 bg-[#c3d6e9]/30 inline-flex justify-start items-center gap-5", titleClassName])}>
                <div className="flex-1 justify-start text-black-secondary text-lg font-bold leading-[18px] flex-wrap">
                    {title}
                </div>
                <div onClick={onClose} className="w-[40px] h-[40px]  cursor-pointer top-[20px] bg-white rounded-[60px] inline-flex justify-center items-center gap-2.5">
                    <ClosePopupIcon />
                </div>
            </div>
            <div className="grow self-stretch overflow-y-scroll">
                {children}
            </div>
            {footer && 
                <div className={cn(["self-stretch px-[30px] py-5 bg-[#c3d6e9]/30 inline-flex justify-start items-center gap-5", footerClassName])}>
                    {footer}

                </div>
            }

        </ReactModal>
    )
}

export default Modal