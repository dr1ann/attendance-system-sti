import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/auth";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

export const authenticated = (
  handler: (
    req: AuthenticatedRequest,
    res: NextResponse
  ) => Promise<NextResponse | void>
) => {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
          status: 401,
        });
      }

      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return new NextResponse(JSON.stringify({ message: "User not found" }), {
          status: 404,
        });
      }

      (req as AuthenticatedRequest).user = user;
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error("Authentication error:", error);
      return new NextResponse(
        JSON.stringify({ message: "Authentication failed" }),
        { status: 401 }
      );
    }
  };
};
