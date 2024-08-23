export const HighlightIcon = ({ size = 16 }: { size?: number }): JSX.Element => {
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
      className="icon icon-tabler icons-tabler-outline icon-tabler-highlight"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 19h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M12.5 5.5l4 4" />
      <path d="M4.5 13.5l4 4" />
      <path d="M21 15v4h-8l4 -4z" />
    </svg>
  );
};
