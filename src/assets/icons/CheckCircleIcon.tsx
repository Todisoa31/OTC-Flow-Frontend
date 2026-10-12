
type Props = {
    size?: string;
}

function CheckCircleIcon({ size }: Props) {
    return (
        <svg width={size ? size : "18"} height={size ? size : "18"} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_323_943)">
                <path d="M9 0C4.03725 0 0 4.03725 0 9C0 13.9628 4.03725 18 9 18C13.9628 18 18 13.9628 18 9C18 4.03725 13.9628 0 9 0ZM13.65 7.884L10.3305 11.1427C9.74325 11.7188 8.98725 12.006 8.2305 12.006C7.482 12.006 6.7335 11.724 6.1485 11.1593L4.72425 9.759C4.42875 9.46875 4.425 8.994 4.71525 8.6985C5.00475 8.40225 5.481 8.3985 5.77575 8.6895L7.1955 10.0852C7.7775 10.6477 8.69625 10.6447 9.28125 10.0717L12.6 6.81375C12.8947 6.52275 13.368 6.528 13.6605 6.8235C13.9508 7.119 13.9463 7.59375 13.65 7.884Z" fill="#65A5BF" />
            </g>
            <defs>
                <clipPath id="clip0_323_943">
                    <rect width="18" height="18" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default CheckCircleIcon