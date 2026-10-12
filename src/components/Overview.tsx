import CloseSquareWhiteIcon from "@/assets/icons/CloseSquareWhiteIcon";
import BeingProcessedIcon from "@/assets/icons/dashboard/BeingProcessedIcon";
import NewFolderIcon from "@/assets/icons/dashboard/NewFolderIcon";
import RefusedIcon from "@/assets/icons/dashboard/RefusedIcon";
import ToBeCorrectedIcon from "@/assets/icons/dashboard/ToBeCorrectedIcon";
import ValidatedIcon from "@/assets/icons/dashboard/ValidateIcon";

type IconType =
  | React.ReactElement<typeof NewFolderIcon>
  | React.ReactElement<typeof BeingProcessedIcon>
  | React.ReactElement<typeof RefusedIcon>
  | React.ReactElement<typeof ToBeCorrectedIcon>
  | React.ReactElement<typeof ValidatedIcon>
  | React.ReactElement<typeof CloseSquareWhiteIcon>;

export type OverviewItemProps = {
  title: string;
  code?: string;
  count: number;
  icon: IconType;
};

type OverviewProps = {
  data: OverviewItemProps[];
  label?: string;
};

function OverviewItem(props: OverviewItemProps) {
  const { title, count, icon } = props;
  return (
    <div className="h-[106px] min-w-[185.71px] max-w-[185.71px] px-3.6 py-5 gap-5 relative bg-black/50 rounded-15 shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline-white/50 backdrop-blur-[10px] flex flex-col justify-center items-center border-[1.5px] border-white/50">
      <div className="left-3.6 top-3.6 absolute">{icon}</div>
      <div className="justify-start text-white leading-[36px] text-[50px] font-bold">{count}</div>
      <div className="mt-auto text-white text-sm/4.5 font-bold leading-[18px]">{title}</div>
    </div>
  );
}

function Overview(props: OverviewProps) {
  const { data, label } = props;

  return (
    <div className="relative w-full min-h-fit rounded-30 flex flex-col justify-start items-start gap-7.5 overflow-hidden bg-[url('/images/record-dashboard-bg.png')] bg-cover p-7.5 gap-7.5">
      <div className="justify-start text-white text-2xl font-bold">{label ?? "Vue d’ensemble"}</div>
      <div className="flex flex-wrap justify-start items-start gap-7.5">
        {data.map((item: OverviewItemProps) => (
          <OverviewItem
            key={item.code}
            title={item.title}
            count={item.count}
            code={item.code}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default Overview;
