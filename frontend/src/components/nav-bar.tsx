/**
 * Main navigation bar component.
 */

import React from 'react';
import { navigate } from '@/lib/router';
import styles from './nav-bar.module.css';

interface NavLink {
  label: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Explorar', path: '/explore' },
];

export interface NavBarProps {
  /** Currently active path for highlighting the active link */
  currentPath: string;
}

/**
 * Top navigation bar with logo and primary navigation links.
 */
export function NavBar({ currentPath }: NavBarProps) {
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, path: string) {
    e.preventDefault();
    navigate(path);
  }

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`} aria-label="Navegación principal">
        <a
          href="/"
          className={styles.logo}
          onClick={(e) => handleNavClick(e, '/')}
        >
          <span className={styles.logo__icon} aria-hidden="true">🔍</span>
          <span className={styles.logo__text}>CivicLens</span>
        </a>

        <ul className={styles.links} role="list">
          {NAV_LINKS.map(({ label, path }) => (
            <li key={path}>
              <a
                href={path}
                className={`${styles.link} ${currentPath === path ? styles['link--active'] : ''}`}
                onClick={(e) => handleNavClick(e, path)}
                aria-current={currentPath === path ? 'page' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.disclaimer} aria-label="Descargo de responsabilidad">
          Solo informativo · No constituye acusación legal
        </p>
      </nav>
    </header>
  );
}
