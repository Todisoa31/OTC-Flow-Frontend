import React from 'react'

type Props = {
    active?: boolean
}

function BellIcon(props: Props) {
    const {active} = props
    return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="30" height="30" rx="10" fill="white" />
            {active && <circle cx="22" cy="8" r="5.5" fill="#C80043" stroke="white" /> }
            <path d="M12.2638 21.1814C12.8947 21.9833 13.8856 22.5 15 22.5C16.1144 22.5 17.1053 21.9833 17.7362 21.1814C15.9198 21.4275 14.0802 21.4275 12.2638 21.1814Z" fill="#65A5BF" />
            <path d="M20.0618 12.75V13.2781C20.0618 13.9118 20.2427 14.5314 20.5817 15.0587L21.4122 16.3509C22.1709 17.5311 21.5917 19.1354 20.2722 19.5087C16.8204 20.4851 13.1796 20.4851 9.72777 19.5087C8.40828 19.1354 7.82912 17.5311 8.58777 16.3509L9.41835 15.0587C9.75729 14.5314 9.93815 13.9118 9.93815 13.2781V12.75C9.93815 9.8505 12.2044 7.5 15 7.5C17.7956 7.5 20.0618 9.8505 20.0618 12.75Z" fill="#65A5BF" />
        </svg>
    )
}

export default BellIcon