import { useEffect, useState } from 'react';
import { Role } from "@/types/authType";
import { getUserInfo } from '@/api/user';

type Props = {
  type: Role; 
  username: string, 
  userimage: string, 
  // onClick: () => void 
}
const FolderInfoY = (props: Props) => {
    const { type, username, userimage } = props;
    const [userConnected, setUserConnected] = useState<any>(null);
    const getCurrentUserConnected = async () => {
        try {
            const response = await getUserInfo();
            setUserConnected(response);
        } catch (error) {
            console.error("Error fetching user info:", error);
            return null;
        }
    };
    useEffect(() => {
      getCurrentUserConnected();
    },[]);

    return (
        <div className=" flex items-center gap-2 p-[15px] rounded-[10px] bg-[#FFFFFF66] justify-between">
            <div className=" flex items-center gap-2">
                <img src={userimage} alt="avatar" width={30} height={30} className=" !w-[30px] !h-[30px]" />
                <div className=" flex flex-col gap-1">
                    <span className="text-xs font-bold text-dark-blue">{type}</span>
                    <span className="text-xs font-bold text-grey font-bold">{username}</span>
                </div>
            </div>
            {/* { userConnected?.role === "Référent" &&                 
              <button onClick={onClick}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" rx="5" fill="#101828" />
                      <path d="M7.66671 13.0832C7.66671 10.0916 10.0918 7.6665 13.0834 7.6665C14.8191 7.6665 16.3641 8.48509 17.3555 9.75584C13.1275 9.9193 9.75004 13.3985 9.75004 17.6665C9.75004 17.7584 9.75161 17.85 9.75471 17.9412L9.47783 18.0152C8.67255 18.2307 7.93584 17.494 8.1513 16.6887L8.25744 16.292C8.34318 15.9716 8.29164 15.633 8.15381 15.3313C7.84101 14.6465 7.66671 13.8852 7.66671 13.0832Z" fill="white" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M11 17.6665C11 21.3484 13.9848 24.3332 17.6667 24.3332C18.6963 24.3332 19.6714 24.0998 20.5419 23.683C20.8411 23.5398 21.1801 23.4895 21.5006 23.5752L22.5223 23.8486C23.3275 24.064 24.0642 23.3273 23.8488 22.522L23.5754 21.5003C23.4897 21.1799 23.54 20.8409 23.6832 20.5417C24.1 19.6712 24.3334 18.6961 24.3334 17.6665C24.3334 13.9846 21.3486 10.9998 17.6667 10.9998C13.9848 10.9998 11 13.9846 11 17.6665ZM20.5834 18.4998C20.1231 18.4998 19.75 18.1267 19.75 17.6665C19.75 17.2063 20.1231 16.8332 20.5834 16.8332C21.0436 16.8332 21.4167 17.2063 21.4167 17.6665C21.4167 18.1267 21.0436 18.4998 20.5834 18.4998ZM17.6667 18.4998C17.2065 18.4998 16.8334 18.1267 16.8334 17.6665C16.8334 17.2063 17.2065 16.8332 17.6667 16.8332C18.1269 16.8332 18.5 17.2063 18.5 17.6665C18.5 18.1267 18.1269 18.4998 17.6667 18.4998ZM14.75 18.4998C14.2898 18.4998 13.9167 18.1267 13.9167 17.6665C13.9167 17.2063 14.2898 16.8332 14.75 16.8332C15.2103 16.8332 15.5834 17.2063 15.5834 17.6665C15.5834 18.1267 15.2103 18.4998 14.75 18.4998Z" fill="white" />
                  </svg>
              </button>
            } */}
        </div>
    )
};

export default FolderInfoY;
