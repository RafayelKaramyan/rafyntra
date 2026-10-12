type IconProps = {
  name: 'arrow' | 'diagonal' | 'pause' | 'play' | 'reset' | 'code';
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const paths = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    diagonal: <path d="M6 18 18 6M6 6h12v12" />,
    pause: (
      <>
        <path d="M8 5v14M16 5v14" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7Z" />,
    reset: (
      <>
        <path d="M5 8a8 8 0 1 1-1 8M5 3v6h6" />
      </>
    ),
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-13-4 16" />,
  };
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
