import dayjs from 'dayjs';
import { format } from 'date-fns';

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {dayjs().year()} ShopDemo. A demo project for CI and dependency
        scanning.
      </p>
      <p className="footer__meta">Last loaded {format(new Date(), 'PPpp')}</p>
    </footer>
  );
}
