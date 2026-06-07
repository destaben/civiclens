import { describe, it, expect, beforeEach } from 'vitest';
import { route, navigate, startRouter, setNotFound, resetRouter } from '@/lib/router';

describe('router', () => {
  beforeEach(() => {
    resetRouter();
    // Reset history to root
    window.history.pushState(null, '', '/');
  });

  it('dispatches the correct handler for "/"', () => {
    const handler = vi.fn();
    route('/', handler);
    startRouter();
    expect(handler).toHaveBeenCalledOnce();
  });

  it('extracts named URL parameters', () => {
    const handler = vi.fn();
    route('/contract/:id', handler);
    navigate('/contract/CNT-2024-001');
    expect(handler).toHaveBeenCalledWith({ id: 'CNT-2024-001' });
  });

  it('calls the not-found handler for unknown paths', () => {
    const notFound = vi.fn();
    setNotFound(notFound);
    navigate('/this-path-does-not-exist');
    expect(notFound).toHaveBeenCalledWith({});
  });

  it('navigate updates window.location.pathname', () => {
    navigate('/explore');
    expect(window.location.pathname).toBe('/explore');
  });
});
