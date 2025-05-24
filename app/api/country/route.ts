import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value; // replace "token" with your actual cookie name

        const response = await fetch(`${process.env.BACKEND_API_URL}/countries`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        const responseData = await response.json();


        if (!response.ok) {
            return NextResponse.json(
                { error: responseData.message || "Failed to fetch countries" },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { data: responseData },
            { status: 200 }
        );
    } catch (error:unknown) {
        console.error("Error fetching countries:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
