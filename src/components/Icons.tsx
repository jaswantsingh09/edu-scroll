type P = { filled?: boolean };
export const Heart = ({ filled }: P) => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill={filled ? '#ff3b5c' : 'none'} stroke={filled ? '#ff3b5c' : 'currentColor'} strokeWidth="2">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" strokeLinejoin="round" />
  </svg>
);
export const Bookmark = ({ filled }: P) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12v18l-6-4.5L6 21z" strokeLinejoin="round" />
  </svg>
);
export const Share = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 3 11 14M22 3l-7 19-4-8-8-4z" strokeLinejoin="round" />
  </svg>
);
export const Book = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM4 21V5" strokeLinejoin="round" />
  </svg>
);
export const Home = ({ filled }: P) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" strokeLinejoin="round" />
  </svg>
);
export const User = ({ filled }: P) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7z" strokeLinejoin="round" />
  </svg>
);
