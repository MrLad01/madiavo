import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;

	const { pathname } = request.nextUrl;

	// Extract locale from pathname: /en/admin, /fr/dashboard, etc.
	const localeMatch = pathname.match(/^\/(en|fr|de|it|lt)(\/|$)/);
	const locale = localeMatch?.[1];

	const cleanedPath = pathname.replace(/^\/(en|fr|de|it|lt)/, "");

	const protectedPaths = ["/dashboard", "/admin"];
	const isProtected = protectedPaths.some((path) =>
		cleanedPath.startsWith(path)
	);

	if (isProtected && !token) {
		return NextResponse.redirect(
			new URL(`/${locale ?? "en"}`, request.url)
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/(en|fr|de|it|lt)/dashboard/:path*",
		"/(en|fr|de|it|lt)/admin/:path*",
	],
};
