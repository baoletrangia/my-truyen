import { env } from "@/lib/env";
import { NextResponse } from "next/server";

type TokenRequest = {
  code: string;
  redirectUri: string;
  codeVerifier: string;
};

export async function POST(request: Request) {
  if (!env.googleClientId) {
    return NextResponse.json(
      { error: "Missing Google client ID" },
      { status: 500 },
    );
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientSecret) {
    return NextResponse.json(
      { error: "Missing Google client secret" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as TokenRequest;
  if (!body.code || !body.redirectUri || !body.codeVerifier) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.googleClientId,
      client_secret: clientSecret,
      code: body.code,
      code_verifier: body.codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: body.redirectUri,
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!tokenResponse.ok || !tokenData.access_token) {
    return NextResponse.json(
      { error: tokenData.error_description ?? "OAuth error" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    accessToken: tokenData.access_token,
    expiresIn: tokenData.expires_in ?? 3600,
  });
}
