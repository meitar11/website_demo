const stack = [
  'React 18 + Vite',
  'React Router',
  'TanStack Query',
  'Zustand',
  'Express + Helmet',
  'JWT auth',
  'Jest + Vitest',
  'GitHub Actions CI',
];

export default function About() {
  return (
    <div className="about">
      <h1>About ShopDemo</h1>
      <p>
        ShopDemo is an intentionally realistic demo web application. It exists
        to exercise a continuous-integration pipeline and to act as a test
        target for dependency and malware scanning across a typical set of npm
        packages.
      </p>
      <h2>Tech stack</h2>
      <ul className="about__stack">
        {stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
