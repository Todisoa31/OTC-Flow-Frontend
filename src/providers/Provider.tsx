import React from 'react'
import { TitleProvider } from './TitleProvider'
import { CreateRecordProvider } from './CreateRecordProvider'
import { AuthProvider } from './AuthProvider'
import { FilterProvider } from './FilterProvider'
import { RecordProvider } from './RecordProvider'
import { TeamMemberProvider } from './TeamProvider';
import { StatusDossierProvider } from './StatusDossierProvider'

type Props = {
    children: React.ReactNode
}

function Provider(props: Props) {
    const { children } = props
    return (
        <AuthProvider>
            <TitleProvider>
                <FilterProvider>
                    <CreateRecordProvider>
                        <RecordProvider>
                          <TeamMemberProvider>
                            <StatusDossierProvider>
                              {children}
                            </StatusDossierProvider>
                          </TeamMemberProvider>
                        </RecordProvider>
                    </CreateRecordProvider>
                </FilterProvider>
            </TitleProvider>
        </AuthProvider>
    )
}

export default Provider