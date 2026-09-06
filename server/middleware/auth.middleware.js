import jwt from "jsonwebtoken";

function getTokenFromCookies(cookieHeader = "") {
    const tokenCookie = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="));

    return tokenCookie ? decodeURIComponent(tokenCookie.slice("token=".length)) : null;
}

export function requireAuth(req, res, next) {
    const token = getTokenFromCookies(req.headers.cookie);

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);

        if (typeof payload !== "object" || !payload.userId) {
            return res.status(401).json({ message: "Invalid authentication token" });
        }

        req.user = { id: payload.userId };
        return next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired authentication token" });
    }
}