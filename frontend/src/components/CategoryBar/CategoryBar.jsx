import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useSearchStore from '../../store/searchStore';
import './CategoryBar.css';

// Airbnb-style SVG icon components
const Icons = {
  All: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179v.185l-.014.324c-.05.49-.191.9-.436 1.181l-.187.194-.212.193c-.654.57-1.488.866-2.441.866-1.07 0-2.116-.421-3.073-1.163l-.208-.17-.191-.164a5.15 5.15 0 0 1-.172-.154l-.174-.173-1.006-.927-.009-.001c-2.2 2.11-4.4 3.167-6.491 3.167-3.47 0-6.347-2.416-6.347-6.478v-.175c.012-1.064.227-2.014.748-3.306l.278-.662.121-.285c.983-2.297 5.236-11.12 7.163-14.893l.489-.94C12.53 1.963 13.986 1 16 1zm0 2c-1.239 0-2.053.539-3.048 2.421l-.527 1.017c-1.966 3.85-6.177 12.65-7.16 14.944l-.145.353-.122.295c-.432 1.071-.62 1.759-.635 2.623l-.007.289v.165c0 2.917 1.97 4.478 4.347 4.478 1.709 0 3.646-.93 5.604-2.7l.226-.213.244-.237-1.067-1.177c-1.517-1.72-2.374-3.376-2.374-4.73 0-2.215 1.515-3.702 3.573-3.702 2.02 0 3.573 1.431 3.573 3.702 0 1.354-.857 3.01-2.374 4.73l-1.006 1.107.257.252c2.1 2.012 4.2 3.068 6.201 3.068 2.377 0 4.357-1.56 4.357-4.478 0-.16-.007-.325-.02-.498l-.036-.327-.084-.449c-.162-.666-.427-1.384-.88-2.354l-.176-.372c-.977-2.295-5.178-11.094-7.127-14.893l-.533-1.025C18.053 3.539 17.239 3 16 3zm0 11.427c1.004 0 1.573.619 1.573 1.702 0 .709-.569 1.99-1.573 3.281-1.004-1.29-1.573-2.572-1.573-3.281 0-1.083.568-1.702 1.573-1.702z" fill="currentColor"/>
    </svg>
  ),
  Trending: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M1 24h30v2H1zm14.2-6.2l6.3-8.7 1.6 1.2-7.5 10.3-5.4-5.4-6.7 9.2-1.6-1.2 8-11z" fill="currentColor"/>
    </svg>
  ),
  Beach: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M5 30h22v-2H5v2zm0-4h22v-2H5v2zm2-4h8v-2H7v2zm6-4h6v-2h-6v2zm8-8c0-3.86-3.13-7-6.99-7C8.14 3 5 6.14 5 10c0 .34.04.68.08 1H5v2h11.97A7.01 7.01 0 0 0 21 10zm-7 5H7.13A5 5 0 0 1 7 10a5 5 0 0 1 10 0 5.01 5.01 0 0 1-.87 2.84L14 15z" fill="currentColor"/>
    </svg>
  ),
  Cabins: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M27 18v11H5V18L16 7zM25 18l-9-9-9 9v9h18zM16 3L2 17l1.5 1.5L16 6l12.5 12.5L30 17z" fill="currentColor"/>
    </svg>
  ),
  'Amazing pools': () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M28 22c-1.2 0-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8 4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1s-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8 4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1s-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8V26a4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1s1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8 4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1s1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8 4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1v-2zM28 16c-1.2 0-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8 4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1s-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8 4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1s-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8V20a4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1s1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8 4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1s1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8 4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1v-2zM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM21 5v2h4v10h2V5z" fill="currentColor"/>
    </svg>
  ),
  Countryside: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2a7 7 0 1 1 0 14A7 7 0 0 1 16 2zm0 2a5 5 0 1 0 0 10A5 5 0 0 0 16 4zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-5.06 9.45L16 26.5l5.06-10.05a9 9 0 0 1 1.82 1.01L16 30 9.12 17.46a9 9 0 0 1 1.82-1.01z" fill="currentColor"/>
    </svg>
  ),
  Castles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M7 1v6H5V1H3v6H1v8h4v16h22V15h4V7h-2V1h-2v6h-2V1h-2v6h-2V1zm2 8h14v4H9zm0 6h6v12H9zm8 0h6v12h-6zm-6 6h6v2h-6z" fill="currentColor"/>
    </svg>
  ),
  OMG: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2zm0 2c6.64 0 12 5.36 12 12s-5.36 12-12 12S4 22.64 4 16 9.36 4 16 4zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4 10c3.31 0 6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H10c0 3.31 2.69 6 6 6z" fill="currentColor"/>
    </svg>
  ),
  Design: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M6 2h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v10h20V4zm2 14h16v2H8zm-2 4h20v2H6zm2 4h16v2H8z" fill="currentColor"/>
    </svg>
  ),
  Arctic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M17 3v4.56l3.25-3.25 1.41 1.41-4.66 4.66V12h1.56l4.66-4.66 1.41 1.41L21.44 12H26v2h-4.56l3.25 3.25-1.41 1.41L18.62 14H17v1.56l4.66 4.66-1.41 1.41L17 18.44V23h-2v-4.56l-3.25 3.25-1.41-1.41L14.38 16H13v-1.56l-4.66 4.66-1.41-1.41L10.56 14H6v-2h4.56L7.31 8.75l1.41-1.41L13 11.56V10h1.38L9.72 5.34l1.41-1.41L14.38 7 15 7.56V3zm-1 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM6 26h20v2H6z" fill="currentColor"/>
    </svg>
  ),
  'Tiny homes': () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2L2 14h4v16h9V20h2v10h9V14h4zm0 3l12 11H4z" fill="currentColor"/>
    </svg>
  ),
  Tropical: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2C8.28 2 2 8.28 2 16c0 7.73 6.28 14 14 14s14-6.27 14-14c0-7.72-6.28-14-14-14zm-2 23.93V22h4v3.93a12.1 12.1 0 0 1-4 0zm6-1.39V22h1a12.1 12.1 0 0 0 6.84-8H24v-2h4.93c.05.66.07 1.32.07 2 0 5.65-3.8 10.41-9 11.54zM4 14h4.93A12.1 12.1 0 0 0 15 22h1v2.54C9.8 23.41 6 18.65 6 13c0-.67.02-1.34.07-2zm8.6-10.93A12.1 12.1 0 0 1 20 10h4v2h-4v2h8.93A12.1 12.1 0 0 0 16 4h-1V2.07c1.2.13 2.37.4 3.42.82zM15 4.07V8h-1a12.1 12.1 0 0 0-8.93 4H9v2H4.07A12.1 12.1 0 0 1 15 4.07z" fill="currentColor"/>
    </svg>
  ),
  Lakefront: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M28 22a4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1s-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8 4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1s-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8 4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1v2c1.2 0 1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8 4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1s1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8 4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1s1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8v-2zM16 2a8 8 0 0 1 8 8c0 4.4-8 18-8 18S8 14.4 8 10a8 8 0 0 1 8-8zm0 2a6 6 0 0 0-6 6c0 3.1 6 14.8 6 14.8S22 13.1 22 10a6 6 0 0 0-6-6zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="currentColor"/>
    </svg>
  ),
  'Ski-in/out': () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="m27.41 18-2.42-6.89A2 2 0 0 0 23.09 10H21V8h4V6h-4V4h-2v6h-2.09a2 2 0 0 0-1.9 1.38L12.59 18H10v2h2l-2 8h2.18l2-8h7.64l2 8H26l-2-8h2v-2zM14.91 18l2.44-6h3.3l2.44 6z" fill="currentColor"/>
    </svg>
  ),
  Farms: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M24 28V14h2V12L16 3 6 12v2h2v16h16zm-8 0v-8h4v8zm-6 0V14h4v6h-4v8zm10-10h-4v-4h4z" fill="currentColor"/>
    </svg>
  ),
  Caves: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M26 30H6L2 16C2 8.27 8.27 2 16 2s14 6.27 14 14l-4 14zM7.76 28h16.48l3.63-12.73A11.97 11.97 0 0 0 16 4 11.97 11.97 0 0 0 4.13 15.27L7.76 28z" fill="currentColor"/>
    </svg>
  ),
  Islands: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2a7 7 0 0 1 7 7c0 5.25-7 15-7 15S9 14.25 9 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 3.54 5 11.14 5 11.14S21 12.54 21 9a5 5 0 0 0-5-5zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 26h26v2H3z" fill="currentColor"/>
    </svg>
  ),
  Domes: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2C8.27 2 2 8.27 2 16h2C4 9.37 9.37 4 16 4s12 5.37 12 12h2C30 8.27 23.73 2 16 2zm0 6c-4.42 0-8 3.58-8 8h2c0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.42-3.58-8-8-8zm-7 10H7v4h18v-4h-2v2H9z" fill="currentColor"/>
    </svg>
  ),
  Treehouses: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2C9.37 2 4 7.37 4 14c0 4.43 2.41 8.31 6 10.38V30h2v-5h8v5h2v-5.62A12 12 0 0 0 28 14c0-6.63-5.37-12-12-12zm0 2c5.52 0 10 4.48 10 10 0 3.69-2 6.92-5 8.66V22H11v.66A10 10 0 0 1 6 14C6 8.48 10.48 4 16 4zm-3 9h6v7h-6z" fill="currentColor"/>
    </svg>
  ),
  Houseboats: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M27 18a4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1-1.2 0-1.9.5-2.6 1a4.3 4.3 0 0 1-2.4.8 4.3 4.3 0 0 1-2.4-.8c-.7-.5-1.4-1-2.6-1-1.2 0-1.9.5-2.6 1A4.3 4.3 0 0 1 7 18H5v2h2a4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1 1.2 0 1.9.5 2.6 1a4.3 4.3 0 0 0 2.4.8 4.3 4.3 0 0 0 2.4-.8c.7-.5 1.4-1 2.6-1 1.2 0 1.9.5 2.6 1A4.3 4.3 0 0 0 27 20h2v-2zM3 8l5-4h16l5 4H3zm2.62 2h20.76L24 8H8l-2.38 2zM7 10v8h18v-8z" fill="currentColor"/>
    </svg>
  ),
  Luxe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 2l3.09 9.26H29l-7.88 5.73 3 9.01L16 20.7l-8.12 5.3 3-9.01L2.9 11.26H12.9z" fill="currentColor"/>
    </svg>
  ),
};

const CATEGORIES = [
  { id: 'all', label: 'All', IconComp: Icons.All },
  { id: 'Trending', label: 'Trending', IconComp: Icons.Trending },
  { id: 'Beach', label: 'Beach', IconComp: Icons.Beach },
  { id: 'Cabins', label: 'Cabins', IconComp: Icons.Cabins },
  { id: 'Amazing pools', label: 'Amazing pools', IconComp: Icons['Amazing pools'] },
  { id: 'Countryside', label: 'Countryside', IconComp: Icons.Countryside },
  { id: 'Castles', label: 'Castles', IconComp: Icons.Castles },
  { id: 'OMG!', label: 'OMG!', IconComp: Icons.OMG },
  { id: 'Design', label: 'Design', IconComp: Icons.Design },
  { id: 'Arctic', label: 'Arctic', IconComp: Icons.Arctic },
  { id: 'Tiny homes', label: 'Tiny homes', IconComp: Icons['Tiny homes'] },
  { id: 'Tropical', label: 'Tropical', IconComp: Icons.Tropical },
  { id: 'Lakefront', label: 'Lakefront', IconComp: Icons.Lakefront },
  { id: 'Ski-in/out', label: 'Ski-in/out', IconComp: Icons['Ski-in/out'] },
  { id: 'Farms', label: 'Farms', IconComp: Icons.Farms },
  { id: 'Caves', label: 'Caves', IconComp: Icons.Caves },
  { id: 'Islands', label: 'Islands', IconComp: Icons.Islands },
  { id: 'Domes', label: 'Domes', IconComp: Icons.Domes },
  { id: 'Treehouses', label: 'Treehouses', IconComp: Icons.Treehouses },
  { id: 'Houseboats', label: 'Houseboats', IconComp: Icons.Houseboats },
  { id: 'Luxe', label: 'Luxe', IconComp: Icons.Luxe },
];

export default function CategoryBar() {
  const { category, setCategory } = useSearchStore();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="category-bar">
      <div className="category-bar__inner">
        <button
          className="category-bar__arrow category-bar__arrow--left"
          onClick={() => scroll('left')}
          aria-label="Scroll categories left"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        <div className="category-bar__list" ref={scrollRef} role="list">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                className={`category-bar__item ${isActive ? 'category-bar__item--active' : ''}`}
                onClick={() => setCategory(cat.id)}
                role="listitem"
                aria-label={`Filter by ${cat.label}`}
                aria-pressed={isActive}
              >
                <span className="category-bar__icon" aria-hidden="true">
                  <cat.IconComp />
                </span>
                <span className="category-bar__label">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <button
          className="category-bar__arrow category-bar__arrow--right"
          onClick={() => scroll('right')}
          aria-label="Scroll categories right"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
