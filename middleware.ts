import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For now, allow all requests through
  // Authentication will be handled by the pages themselves using getServerSession
  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/chats/:path*"],
};

