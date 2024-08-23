export const EnterDownIcon = ({ size = 16 }: { size?: number }): JSX.Element => {
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
      className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-bar-down"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 20l0 -10" />
      <path d="M12 20l4 -4" />
      <path d="M12 20l-4 -4" />
      <path d="M4 4l16 0" />
    </svg>
  );
};
