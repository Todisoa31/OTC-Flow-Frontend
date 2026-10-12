import BellIcon2 from '@/assets/icons/BellIcon2'

function DashboardNotification() {
    return (
        <div className="relative self-stretch md:min-w-[300px] md:grow max-md:w-full h-[278px] rounded-[15px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white flex-col justify-start items-start gap-2.5 inline-flex overflow-hidden">
            <div className="self-stretch grow left-[15px] top-[15px] absolute justify-center items-center gap-[15px] inline-flex">
                <div data-svg-wrapper>
                    <BellIcon2/>
                </div>
                <div className="grow shrink basis-0">
                    <span className="text-white text-sm font-medium leading-[18px]">Dernières<br /></span>
                    <span className="text-white text-2xl font-bold">Notifications</span></div>
            </div>
            <div className="w-full h-[140px] px-[15px] left-0 top-[121px] absolute flex-col justify-start items-start gap-[15px] flex">
                <div className="w-full self-stretch p-[15px] bg-black/30 rounded-[10px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[10px] justify-start items-center gap-2.5 inline-flex">
                    <div data-svg-wrapper className="relative">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5138 5.71249L11.5447 3.04032C10.6988 2.27901 10.2759 1.89836 9.75692 1.69922L9.75 3.75008C9.75 5.51785 9.75 6.40173 10.2992 6.95091C10.8483 7.50008 11.7322 7.50008 13.5 7.50008H16.1851C15.9131 6.97191 15.4263 6.53373 14.5138 5.71249Z" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.5 16.5H7.5C4.67157 16.5 3.25736 16.5 2.37868 15.6213C1.5 14.7426 1.5 13.3284 1.5 10.5V7.5C1.5 4.67157 1.5 3.25736 2.37868 2.37868C3.25736 1.5 4.67902 1.5 7.52234 1.5C7.97685 1.5 8.34105 1.5 8.64751 1.5125C8.63742 1.57244 8.63213 1.6336 8.63192 1.69542L8.625 3.82123C8.62493 4.64405 8.62487 5.37123 8.70368 5.95737C8.7891 6.59271 8.98523 7.22795 9.50368 7.7464C10.0221 8.26485 10.6574 8.46098 11.2927 8.5464C11.8789 8.62521 12.606 8.62515 13.4289 8.62508L13.5 8.62508H16.4681C16.5 9.02578 16.5 9.51757 16.5 10.1722V10.5C16.5 13.3284 16.5 14.7426 15.6213 15.6213C14.7426 16.5 13.3284 16.5 10.5 16.5ZM7.87371 10.8296C8.1059 11.036 8.12681 11.3915 7.92042 11.6237L5.92042 13.8737C5.81367 13.9938 5.66067 14.0625 5.5 14.0625C5.33933 14.0625 5.18633 13.9938 5.07958 13.8737L4.07958 12.7487C3.87319 12.5165 3.89411 12.161 4.1263 11.9546C4.35849 11.7482 4.71403 11.7691 4.92042 12.0013L5.5 12.6533L7.07958 10.8763C7.28597 10.6441 7.64152 10.6232 7.87371 10.8296Z" fill="white" />
                        </svg>
                    </div>
                    <div className="grow shrink basis-0 text-white text-xs font-bold leading-[18px]">Dossier validé</div>
                    <div className="text-white text-xs font-medium">30 min</div>
                </div>
                <div className="w-full self-stretch p-[15px] bg-black/30 rounded-[10px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[10px] justify-start items-center gap-2.5 inline-flex">
                    <div data-svg-wrapper className="relative">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.98378 8.07112C6.17255 4.19037 7.26694 2.25 9 2.25C10.7331 2.25 11.8274 4.19037 14.0162 8.07112L14.289 8.5547C16.1078 11.7796 17.0172 13.392 16.1953 14.571C15.3734 15.75 13.3398 15.75 9.27275 15.75H8.72725C4.66017 15.75 2.62663 15.75 1.80469 14.571C0.982757 13.392 1.89218 11.7796 3.71104 8.5547L3.98378 8.07112ZM9 5.4375C9.31066 5.4375 9.5625 5.68934 9.5625 6V9.75C9.5625 10.0607 9.31066 10.3125 9 10.3125C8.68934 10.3125 8.4375 10.0607 8.4375 9.75V6C8.4375 5.68934 8.68934 5.4375 9 5.4375ZM9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z" fill="white" />
                        </svg>
                    </div>
                    <div className="grow shrink basis-0 text-white text-xs font-bold leading-[18px]">Corrections</div>
                    <div className="text-white text-xs font-medium">1 j</div>
                </div>
                <div className="self-stretch h-3.5 flex-col justify-start items-end gap-2.5 flex">
                    <div className="justify-center items-center gap-[5px] inline-flex">
                        <div className="text-white text-xs font-medium">Toutes les notifications</div>
                        <div data-svg-wrapper className="relative">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.33333 6.56251C2.0917 6.56251 1.89583 6.75839 1.89583 7.00001C1.89583 7.24164 2.0917 7.43751 2.33333 7.43751H7.72916V10.5C7.72916 10.677 7.83576 10.8365 7.99924 10.9042C8.16272 10.9719 8.3509 10.9345 8.47602 10.8094L11.976 7.30937C12.0581 7.22732 12.1042 7.11604 12.1042 7.00001C12.1042 6.88398 12.0581 6.7727 11.976 6.69065L8.47602 3.19065C8.3509 3.06553 8.16272 3.0281 7.99924 3.09582C7.83576 3.16353 7.72916 3.32306 7.72916 3.50001V6.56251H2.33333Z" fill="white" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="self-stretch grow shrink basis-0 bg-[url('/images/notification-bg.png')] bg-cover" />
        </div>
    )
}

export default DashboardNotification