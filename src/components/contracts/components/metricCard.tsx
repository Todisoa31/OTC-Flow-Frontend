
type MetricCardType = {
    title: string;
    value: number | string;
    icon: React.ReactNode;
};

export default function MetricCard({ title, value, icon }: MetricCardType) {
    return (
        <div className=" p-[20px] rounded-[15px] bg-black bg-opacity-50 flex flex-col border-2 border-grey backdrop-blur-sm ">
            <div className=" flex gap-3 justify-start items-center">
                <div>{icon}</div>
                <div>
                    <div className=" text-[30px] text-white font-bold ">{value}</div>
                    <div className=" text-white text-[14px] font-bold">{title}</div>
                </div>
            </div>
        </div>
    )
}