export default function PdfIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#EF4444" />
      <path
        d="M6.75 15V9H8.5C9.6 9 10.25 9.75 10.25 11C10.25 12.25 9.6 13 8.5 13H7.5V15H6.75ZM7.5 12.3H8.4C8.975 12.3 9.25 11.95 9.25 11C9.25 10.05 8.975 9.7 8.4 9.7H7.5V12.3ZM11.5 15V9H13.25C14.35 9 15 9.75 15 11C15 12.25 14.35 13 13.25 13H12.25V15H11.5ZM12.25 12.3H13.15C13.725 12.3 14 11.95 14 11C14 10.05 13.725 9.7 13.15 9.7H12.25V12.3ZM16 15V9H17.5C18.3 9 18.75 9.45 18.75 10.25V13.75C18.75 14.55 18.3 15 17.5 15H16ZM16.75 14.3H17.3C17.7 14.3 17.95 14.05 17.95 13.6V10.4C17.95 9.95 17.7 9.7 17.3 9.7H16.75V14.3Z"
        fill="white"
      />
    </svg>
  );
}
