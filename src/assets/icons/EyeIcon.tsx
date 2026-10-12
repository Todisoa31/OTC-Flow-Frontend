import { colors } from '@/constants/colors'
import React from 'react'

type Props = {
    active?: boolean
}


function EyeIcon(props: Props) {
    const { active } = props
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="18" fill={active ? colors.primaryBlue : 'white'} />
        <g transform="translate(2, 4)">
          <path d="M6.3125 6C6.3125 5.06802 7.06802 4.3125 8 4.3125C8.93198 4.3125 9.6875 5.06802 9.6875 6C9.6875 6.93198 8.93198 7.6875 8 7.6875C7.06802 7.6875 6.3125 6.93198 6.3125 6Z" fill={active ? 'white' : colors.grey}/>
          <path fillRule="evenodd" clipRule="evenodd" d="M0.5 6C0.5 7.22953 0.818723 7.64361 1.45617 8.47175C2.72897 10.1253 4.86359 12 8 12C11.1364 12 13.271 10.1253 14.5438 8.47175C15.1813 7.64361 15.5 7.22953 15.5 6C15.5 4.77047 15.1813 4.35639 14.5438 3.52825C13.271 1.87467 11.1364 0 8 0C4.86359 0 2.72897 1.87467 1.45617 3.52825C0.818723 4.3564 0.5 4.77047 0.5 6ZM8 3.1875C6.4467 3.1875 5.1875 4.4467 5.1875 6C5.1875 7.5533 6.4467 8.8125 8 8.8125C9.5533 8.8125 10.8125 7.5533 10.8125 6C10.8125 4.4467 9.5533 3.1875 8 3.1875Z" fill={active ? 'white' : colors.grey}/>
        </g>
      </svg>
    )
}

export default EyeIcon