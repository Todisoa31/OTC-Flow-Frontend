type Props = {
    title: string
}

function SubmitFileBanner(props: Props) {
    const {title} = props
    return (
        <div className="relative w-full h-[150px] justify-start items-start self-stretch gap-2.5 inline-flex bg-[url('/images/submit-file.png')] bg-cover">
            <div className="left-[30px] top-[67px] absolute text-white text-2xl font-bold ">
                {title}
            </div>
            <div className="grow shrink basis-0 self-stretch bg-black/30" />
        </div>
    )
}

export default SubmitFileBanner