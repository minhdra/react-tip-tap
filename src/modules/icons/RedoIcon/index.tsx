export const RedoIcon = ({ size = 16 }: { size?: number }): JSX.Element => {
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
      className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-forward-up"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 14l4 -4l-4 -4" />
      <path d="M19 10h-11a4 4 0 1 0 0 8h1" />
    </svg>
  );
};
