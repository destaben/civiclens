/**
 * Root application component.
 *
 * Uses the custom router to render the correct page based on the URL path.
 * The NavBar always renders, and the active page is determined at runtime.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { route, setNotFound, startRouter, navigate, resetRouter } from '@/lib/router';
import { NavBar } from '@/components/nav-bar';
import { HomePage } from '@/pages/home-page';
import { ExplorePage } from '@/pages/explore-page';
import { ContractPage } from '@/pages/contract-page';
import { OrgPage } from '@/pages/org-page';

/** Discriminated union for the current page state. */
type PageState =
  | { page: 'home' }
  | { page: 'explore' }
  | { page: 'contract'; contractId: string }
  | { page: 'org'; orgId: string }
  | { page: 'not-found' };

/**
 * Root SPA shell — sets up routing and renders the active page.
 */
export function App() {
  const [pageState, setPageState] = useState<PageState>({ page: 'home' });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const updatePath = useCallback((state: PageState) => {
    setCurrentPath(window.location.pathname);
    setPageState(state);
  }, []);

  useEffect(() => {
    resetRouter();
    route('/', () => updatePath({ page: 'home' }));
    route('/explore', () => updatePath({ page: 'explore' }));
    route('/contract/:id', (params) =>
      updatePath({ page: 'contract', contractId: params.id ?? '' }),
    );
    route('/org/:id', (params) =>
      updatePath({ page: 'org', orgId: params.id ?? '' }),
    );
    setNotFound(() => updatePath({ page: 'not-found' }));
    startRouter();
  }, [updatePath]);

  function renderPage() {
    switch (pageState.page) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'contract':
        return <ContractPage contractId={pageState.contractId} />;
      case 'org':
        return <OrgPage orgId={pageState.orgId} />;
      case 'not-found':
        return <NotFoundPage />;
    }
  }

  return (
    <>
      <NavBar currentPath={currentPath} />
      {renderPage()}
    </>
  );
}

/** Inline 404 page. */
function NotFoundPage() {
  function handleHome(e: React.MouseEvent) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 3.5rem)',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--color-text-subtle)' }}>
        404
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
        Página no encontrada.
      </p>
      <a
        href="/"
        onClick={handleHome}
        style={{ color: 'var(--color-link)', fontWeight: 500 }}
      >
        ← Volver al inicio
      </a>
    </main>
  );
}
