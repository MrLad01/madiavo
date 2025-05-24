import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

		const backendRes = await fetch(
			`${process.env.BACKEND_API_URL}/auth/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			}
		);

		const responseData = await backendRes.json();

		if (!backendRes.ok) {
			return NextResponse.json(
				{ error: responseData.message || "Login failed" },
				{ status: backendRes.status }
			);
		}

		const { token } = responseData.data;

		const res = NextResponse.json(
			{ data: responseData.data },
			{ status: 200 }
		);

		// Set HttpOnly secure cookie
		res.cookies.set("auth_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return res;
	} catch (error:unknown) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
