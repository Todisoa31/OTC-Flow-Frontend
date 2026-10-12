import { useRouter } from 'next/navigation';
import CaretLeftIcon from '../assets/icons/CaretLeftIcon';

type Props = Readonly<{
    title: string
    selectPage?: string
}>

function TitleWithBack({ title, selectPage }: Props) {
    const router = useRouter();
    return (
        <div className="self-stretch inline-flex justify-start items-center gap-[15px]">
            <div
                onClick={() => {
                    selectPage ?
                        router.push(selectPage) :
                    router.back()
                }}
                className="cursor-pointer w-[30px] h-[30px] bg-white rounded-[5px] flex justify-center items-center gap-2.5">
                <div className="relative w-[18px] h-[18px] origin-top-left Rotate-180 overflow-hidden">
                    <div data-svg-wrapper className="cursor-pointer left-[6.19px] top-[3.19px] absolute">
                        <CaretLeftIcon />
                    </div>
                </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
                <div className="justify-start text-dark-blue text-sm font-bold leading-[18px]">{title}</div>
            </div>
        </div>
    )
}

export default TitleWithBack