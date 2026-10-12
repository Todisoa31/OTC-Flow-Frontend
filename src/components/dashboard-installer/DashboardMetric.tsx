import CalendarBlackIcon from "@/assets/icons/CalendarBlackIcon"
import CalendarPercentIcon from "@/assets/icons/CalendarPercentIcon"

function DashboardMetric() {
    return (
        <div className="h-[278px] max-lg:flex-row flex-col justify-start items-start gap-[30px] inline-flex  max-lg:grow">
            <div className="self-stretch grow shrink basis-0 px-[30px] py-5 bg-white/50 rounded-[15px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex-col justify-center items-center gap-5 flex overflow-hidden">
                <div data-svg-wrapper className="left-[15px] top-[15px] absolute">
                    <CalendarPercentIcon />
                </div>
                <div className="text-center">
                    <span className="text-primary-blue text-[50px] font-bold leading-[18px]">48</span>
                    <sup className="text-primary-blue text-[30px] font-bold leading-[18px]">%</sup>
                </div>
                <div className="text-center text-dark-blue text-sm font-bold leading-[18px]">Taux de validation</div>
            </div>
            <div className="self-stretch  grow shrink basis-0 px-2.5 py-5 bg-white/50 rounded-[15px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex-col justify-center items-center gap-5 flex overflow-hidden">
                <div className="justify-center items-center gap-[7px] inline-flex">
                    <div className="text-center text-primary-blue text-[50px] font-bold leading-[18px]">5</div>
                    <div className="text-center text-primary-blue text-2xl font-bold leading-[18px]">jrs</div>
                </div>
                <div className="text-center text-dark-blue text-sm font-bold leading-[18px]">Temps moyen de traitement</div>
                <div data-svg-wrapper className="left-[15px] top-[15px] absolute">
                    <CalendarBlackIcon />
                </div>
            </div>
        </div>
    )
}

export default DashboardMetric