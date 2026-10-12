import { colors } from '@/constants/colors'
import React from 'react'

type Props = {
    active?: boolean
}

function InfoSquareIcon(props: Props) {
    const { active } = props
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill={active ? colors.primaryBlue : 'white'} xmlns="http://www.w3.org/2000/svg">
            <path fill={active ? colors.primaryBlue : 'white'} d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z" />
            <path fill={active ? 'white' : colors.grey} fillRule="evenodd" clipRule="evenodd" d="M18 25.5C14.4645 25.5 12.6967 25.5 11.5983 24.4017C10.5 23.3033 10.5 21.5355 10.5 18C10.5 14.4645 10.5 12.6967 11.5983 11.5983C12.6967 10.5 14.4645 10.5 18 10.5C21.5355 10.5 23.3033 10.5 24.4017 11.5983C25.5 12.6967 25.5 14.4645 25.5 18C25.5 21.5355 25.5 23.3033 24.4017 24.4017C23.3033 25.5 21.5355 25.5 18 25.5ZM18 22.3125C18.3107 22.3125 18.5625 22.0607 18.5625 21.75V17.25C18.5625 16.9393 18.3107 16.6875 18 16.6875C17.6893 16.6875 17.4375 16.9393 17.4375 17.25V21.75C17.4375 22.0607 17.6893 22.3125 18 22.3125ZM18 14.25C18.4142 14.25 18.75 14.5858 18.75 15C18.75 15.4142 18.4142 15.75 18 15.75C17.5858 15.75 17.25 15.4142 17.25 15C17.25 14.5858 17.5858 14.25 18 14.25Z" />
        </svg>
    )
}

export default InfoSquareIcon