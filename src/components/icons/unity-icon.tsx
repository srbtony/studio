import type { SVGProps } from "react";

export function UnityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2 L4 6 L4 18 L12 22 L20 18 L20 6 Z" />
      <path d="M4 6 L12 10 L20 6" />
      <path d="M12 22 L12 10" />
      <path d="M8 12l-4-2" />
      <path d="M16 12l4-2" />
    </svg>
  );
}
