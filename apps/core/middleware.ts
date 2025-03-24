export const onRequest = (context) => {
  const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'zh', 'ar']
  const DEFAULT_LOCALE = 'en'

  // Get the pathname of the request
  const url = new URL(context.request.url)
  const pathname = url.pathname

  // Check if the pathname already starts with a locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return context.next()

  // Get user's country from Vercel geo data
  const country = context.request.headers.get('x-vercel-ip-country')?.toLowerCase() || ''

  // Map countries to locales (extend this mapping as needed)
  let locale = DEFAULT_LOCALE
  if (['fr', 'be', 'ch'].includes(country)) {
    locale = 'fr'
  } else if (['de', 'at', 'ch', 'pl'].includes(country)) {
    locale = 'de'
  } else if (['cn', 'hk', 'tw'].includes(country)) {
    locale = 'zh'
  } else if (['sa', 'ae', 'eg', 'iq', 'jo', 'kw', 'lb', 'om', 'qa', 'sy'].includes(country)) {
    locale = 'ar'
  }

  // Redirect to the appropriate locale
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/${locale}${pathname === '/' ? '' : pathname}${url.search}`
    }
  })
}

