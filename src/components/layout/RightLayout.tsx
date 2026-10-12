import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon"
import { Dispatch, SetStateAction } from "react"
import clsx from "clsx";

type Props = {
    children?: React.ReactNode
    title?: string
    footer?: React.ReactNode
    open?: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
}

function RightLayout(props: Props) {
    const { children, title, footer, open, setOpen } = props
    const isOpen = typeof props.open === 'undefined' || open;
    return (
        <div
            className={clsx(
                "fixed bottom-0 right-0 h-[90%] w-[25%] pb-5 bg-white border-l border-white backdrop-blur-[15px] inline-flex flex-col justify-start items-start gap-[30px] overflow-y-scroll transition-transform duration-500 ease-in-out",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="z-10 sticky top-0 self-stretch  px-[30px] py-8 bg-[#c3d6e9] inline-flex justify-start items-center gap-5">
                <div className="flex-1 justify-start text-[#101828] text-[16px] font-bold ">{title}</div>
                {setOpen ?
                    <button onClick={() => setOpen?.(false)}>
                        <CloseIcon />
                    </button> : null
                }
            </div>
            {children}
            <div className="self-stretch px-[30px] flex flex-col justify-start items-start gap-2.5 sticky bottom-0">
                {footer}
            </div>
        </div>
    )
}

export default RightLayout