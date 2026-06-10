import dayjs from 'dayjs';

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {dayjs().year()} ShopDemo. A demo project for CI and dependency
        scanning.
      </p>
    </footer>
  );
}
