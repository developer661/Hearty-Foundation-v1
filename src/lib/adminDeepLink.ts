const REQUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface AdminDeepLink {
  requestId: string | null;
}

export const readAdminDeepLink = (): AdminDeepLink | null => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') !== 'admin') return null;
  const request = params.get('request');
  return { requestId: request && REQUEST_ID_PATTERN.test(request) ? request : null };
};
