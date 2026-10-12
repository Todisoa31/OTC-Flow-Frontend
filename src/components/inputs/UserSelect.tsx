import React, { useEffect, useState } from 'react';
import Select from './Select';
import { getUsersV2 } from '@/api/user';
import { UserTypeOutput } from '@/types/userType';
import { getFile } from '@/utils/getFile';
import isEqual from 'lodash.isequal';
import { Role } from '@/types/authType';

type Props = {
    value: number[];
    setUser?: React.Dispatch<React.SetStateAction<number[]>>;
    onChange?: (value: number[]) => void;
    role: Role,
    label?: string
}

type UserOption = { value: number; label: string; image: string }

function UserSelect(props: Props) {
    const { value, setUser, onChange, role, label } = props
    const [installateurOption, setInstallateurOption] = useState<UserOption[]>([]);

    const handleGetTeamReferent = async () => {
        try {
            const response = await getUsersV2({ role });
            const user = response.users;
            const itemsPage: { value: number; label: string; image: string }[] =
                user.map((item: UserTypeOutput) => ({
                    value: item.id,
                    label: `${item.firstname} ${item.lastname}`,
                    image: item.photo_profil
                        ? getFile(item.photo_profil)
                        : "/images/usProfil.jpg",
                }));

            setInstallateurOption((prev) => {
                // Comparer rapidement la longueur et les IDs (ou stringify si petit)
                const same = isEqual(prev, itemsPage);

                if (!same) {
                    return itemsPage;
                }
                return prev;
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        handleGetTeamReferent();
    }, []);

    return (
        <div className="flex-1 max-w-[500px] min-w-[300px] min-h-10 h-auto pl-3.5 bg-white rounded-[10px] flex justify-start items-center gap-2.5 w-fit">
            <div className="justify-start text-dark-blue text-xs font-bold whitespace-nowrap">
                {label ?? "Installateur"} :
            </div>

            <Select
                multiple={true}
                search={false}
                value={value}
                onChange={(value) => {
                    setUser?.((value as string[]).map(Number));
                    onChange?.((value as string[]).map(Number));
                }}
                options={installateurOption}
                placeholder="Aucun"
                width="w-full"
                className="bg-transparent w-full"
            />
        </div>
    )
}

export default UserSelect