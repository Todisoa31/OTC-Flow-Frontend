import React from 'react'
type Props = {
    children?: React.ReactNode
}

function ContentLayout({children}: Props) {
  return (
    <div className="self-stretch inline-flex justify-start items-start">
        {children}
    </div>
  )
}

export default ContentLayout