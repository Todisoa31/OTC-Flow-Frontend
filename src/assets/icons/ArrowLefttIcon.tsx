import React from 'react'
type Props = {    
  fill?: string;
}
function ArrowLeftIcon(props: Props) {
    const {fill} = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.6161 14.6771C11.3802 14.8792 11.0251 14.8519 10.8229 14.6161L6.32291 9.36606C6.14235 9.15541 6.14235 8.84457 6.32291 8.63392L10.8229 3.38392C11.0251 3.14805 11.3802 3.12073 11.6161 3.32291C11.8519 3.52508 11.8792 3.88019 11.6771 4.11606L7.49085 8.99999L11.6771 13.8839C11.8792 14.1198 11.8519 14.4749 11.6161 14.6771Z" fill={fill?fill:"#3A5F6E"}/>
        </svg>
    )
}

export default ArrowLeftIcon