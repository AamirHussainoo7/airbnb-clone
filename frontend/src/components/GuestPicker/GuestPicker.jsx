import { Minus, Plus } from 'lucide-react';
import useSearchStore from '../../store/searchStore';
import './GuestPicker.css';

const GUEST_TYPES = [
  { key: 'adults', label: 'Adults', desc: 'Ages 13 or above', min: 1 },
  { key: 'children', label: 'Children', desc: 'Ages 2–12', min: 0 },
  { key: 'infants', label: 'Infants', desc: 'Under 2', min: 0 },
  { key: 'pets', label: 'Pets', desc: 'Bringing a service animal?', min: 0 },
];

export default function GuestPicker() {
  const { guests, updateGuests } = useSearchStore();

  return (
    <div className="guest-picker">
      {GUEST_TYPES.map(({ key, label, desc, min }) => (
        <div key={key} className="guest-picker__row">
          <div className="guest-picker__info">
            <div className="guest-picker__label">{label}</div>
            <div className="guest-picker__desc">{desc}</div>
          </div>
          <div className="guest-picker__controls">
            <button
              className="guest-picker__btn"
              onClick={() => updateGuests(key, guests[key] - 1)}
              disabled={guests[key] <= min}
              aria-label={`Decrease ${label}`}
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            <span className="guest-picker__count">{guests[key]}</span>
            <button
              className="guest-picker__btn"
              onClick={() => updateGuests(key, guests[key] + 1)}
              disabled={guests[key] >= 16}
              aria-label={`Increase ${label}`}
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
