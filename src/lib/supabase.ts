import { createServerClient, type CookieOptionsWithName } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const cookieOptions: CookieOptionsWithName = {
	path: '/',
};

export function createSupabaseServerClient(cookies: AstroCookies, request: Request) {
	return createServerClient(
		import.meta.env.PUBLIC_SUPABASE_URL,
		import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
		{
			cookieOptions,
			cookies: {
				getAll() {
					return request.headers
						.get('cookie')
						?.split(';')
						.map((c) => {
							const [name, ...rest] = c.trim().split('=');
							return { name, value: rest.join('=') };
						}) ?? [];
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookies.set(name, value, options);
					});
				},
			},
		},
	);
}