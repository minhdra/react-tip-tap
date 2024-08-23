export const MLetterIcon = ({ size = 16 }: { size?: number }): JSX.Element => {
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
      className="icon icon-tabler icons-tabler-outline icon-tabler-letter-m"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 20v-16l6 14l6 -14v16" />
    </svg>
  );
};
