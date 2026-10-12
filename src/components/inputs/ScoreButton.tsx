import CheckMarkIcon from "@/assets/icons/CheckMarkIcon";
import { getColorByScore } from "@/utils/record";

type Props = {
    readonly score: number | null,
    readonly corrected?: boolean, 
}

function ScoreButton({ score, corrected }: Props) {
    const _score = corrected ? 100 : score
    const { bgClass } = getColorByScore(_score);

    return (
        <div className={`w-9 h-9 p-2.5 ${bgClass} text-white text-xs rounded-[5px] flex justify-center items-center cursor-pointer`}>
            <span className="text-white font-bold">
                {corrected ? <CheckMarkIcon /> : score}
            </span>
        </div>
    )
}

export default ScoreButton