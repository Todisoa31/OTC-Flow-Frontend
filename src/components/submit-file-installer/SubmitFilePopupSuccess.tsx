import Modal from '../popup/Modal';
import DocumentIcon2 from '@/assets/icons/DocumentIcon2';
import Button from '../inputs/Button';
import AddFolderIcon from '@/assets/icons/AddFolderIcon';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    loading?: boolean;
}

function SubmitFilePopupSuccess({ isOpen,loading, onClose, onConfirm}: Props) {
    return (
        <Modal
            title=''
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="w-[500px] h-[409px] relative bg-white rounded-[40px] overflow-hidden">
                <div className="w-[500px] h-[231px] left-0 top-0 absolute bg-[#c3d6e9]/30 inline-flex flex-col justify-center items-center gap-5">
                    <div className="w-[120px] h-[120px] relative overflow-hidden">
                        <DocumentIcon2 />
                    </div>
                    <div className="relative justify-start text-[#65a5bf] text-base font-bold leading-[18px]">Dossier soumis avec succès !</div>
                    <div onClick={onClose} className="w-[40px] h-[40px]  left-[440px] cursor-pointer top-[20px] absolute bg-white rounded-[60px] inline-flex justify-center items-center gap-2.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.96974 0.337953C1.51913 -0.112651 0.788559 -0.112651 0.337953 0.337953C-0.112651 0.788558 -0.112651 1.51913 0.337953 1.96974L3.36823 5.00002L0.337986 8.03026C-0.112619 8.48087 -0.112619 9.21144 0.337986 9.66205C0.788592 10.1127 1.51917 10.1127 1.96977 9.66205L5.00002 6.6318L8.03023 9.66201C8.48083 10.1126 9.21141 10.1126 9.66201 9.66201C10.1126 9.21141 10.1126 8.48083 9.66201 8.03023L6.6318 5.00002L9.66205 1.96977C10.1127 1.51916 10.1127 0.78859 9.66205 0.337985C9.21144 -0.11262 8.48087 -0.11262 8.03026 0.337985L5.00002 3.36823L1.96974 0.337953Z" fill="#101828" />
                        </svg>
                    </div>
                </div>
                <div className="w-[500px] h-[178px] px-[30px] py-10 left-0 top-[231px] absolute inline-flex flex-col justify-center items-center gap-[30px]">
                    <div className="relative text-center justify-start text-dark-blue text-sm font-medium leading-[18px]">
                        Votre dossier a été envoyé pour validation.<br />Vous serez notifié dès qu&apos;il aura été traité.
                    </div>
                    <div className="self-stretch h-[40px] inline-flex justify-center items-start gap-5">
                        {/* <Button
                                label="Soumettre un dossier"
                                iconLeft={<AddFolderIcon active={true} />}
                                onClick={() => router.push(SUBMIT_FILE_ROUTE)}
                                width='w-auto'
                            />
                            <Button
                                label="Suivre mes dossiers"
                                iconLeft={<MoveToFolderIcon active={true} />}
                                onClick={() => router.push(PROGRESS_TRACKING)}
                                bg='bg-black'
                                width='w-auto p-[10px]'
                            /> */}
                        <Button
                            label="Télecharger le fichier JSON"
                            iconLeft={<AddFolderIcon active={true} />}
                            onClick={onConfirm}
                            className='w-auto'
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default SubmitFilePopupSuccess