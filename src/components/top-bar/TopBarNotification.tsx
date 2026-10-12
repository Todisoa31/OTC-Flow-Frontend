import React, { Dispatch, SetStateAction } from 'react'
import BellIcon from '@/assets/icons/BellIcon'
type Props = {
    setShowNotification: Dispatch<SetStateAction<boolean>>
    hasNotification: boolean;
}

function TopBarNotification(props: Props) {
    const { setShowNotification, hasNotification } = props

    const handleToogleNotification = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowNotification((prev: boolean) => !prev)
    }

    return (
        <div className="w-[30px] h-[30px] px-[10px] py-[10px] bg-white rounded-[10px] backdrop-blur-[42px] flex-col justify-center items-center gap-2.5 inline-flex">
            <div data-svg-wrapper className="relative cursor-pointer" onClick={handleToogleNotification}>
                <BellIcon />
                <span className={`w-2 h-2 right-[6px] top-[5px] absolute rounded-full ${!hasNotification ? "bg-[#BFC6D5]":"bg-[#C80043]"}`}></span>
            </div>
        </div>
    )
}

export default TopBarNotification