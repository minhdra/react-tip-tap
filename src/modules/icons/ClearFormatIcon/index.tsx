export const ClearFormatIcon = ({ size = 16 }: { size?: number }): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-clear-formatting"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 15l4 4m0 -4l-4 4" />
      <path d="M7 6v-1h11v1" />
      <path d="M7 19l4 0" />
      <path d="M13 5l-4 14" />
    </svg>
  );
};
