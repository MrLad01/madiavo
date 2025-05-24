import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { name, email, password } = await req.json();

		const backendRes = await fetch(
			`${process.env.BACKEND_API_URL}/auth/signup`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			}
		);

		const data = await backendRes.json();

		if (!backendRes.ok) {
			return NextResponse.json(
				{ error: data.message || "Signup failed" },
				{ status: backendRes.status }
			);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}