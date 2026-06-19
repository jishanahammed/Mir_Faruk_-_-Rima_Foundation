export const ADMIN_SESSION_COOKIE = "mir_admin_session";
export const ADMIN_SESSION_VALUE = "active";
export const ADMIN_REFRESH_TOKEN_COOKIE = "mir_admin_refresh_token";
export const ADMIN_TOKEN_EXPIRY_COOKIE = "mir_admin_token_expiry";
export const ADMIN_USER_COOKIE = "mir_admin_user";

export const ADMIN_STORAGE_KEYS = {
  accessToken: "mir_admin_access_token",
  refreshToken: "mir_admin_refresh_token",
  accessTokenExpiry: "mir_admin_access_token_expiry",
  user: "mir_admin_user",
};

export const adminUser = {
  name: "Foundation Admin",
  role: "Operations Manager",
  email: "admin@mirfoundation.org",
  phone: "+88 01771528299",
  location: "Dhaka, Bangladesh",
};

function normalizeRoleName(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getInitials(name) {
  return String(name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "FA";
}

export function normalizeAdminUser(user = {}) {
  const name = user.fullName ?? user.name ?? adminUser.name;
  const role =
    user.roleName ??
    user.role ??
    user.roleNames?.[0] ??
    adminUser.role;

  return {
    id: user.userId ?? user.id ?? "",
    donorProfileId:
      user.donorProfileId ??
      user.DonorProfileId ??
      user.donorId ??
      user.DonorId ??
      "",
    name,
    role,
    email: user.email ?? user.workEmail ?? adminUser.email,
    phone: user.mobile ?? user.phone ?? adminUser.phone,
    location: user.location ?? adminUser.location,
    designation: user.designationName ?? "",
    department: user.departmentName ?? "",
    photoUrl: user.photoUrlWithPath ?? "",
    initials: getInitials(name),
    raw: user,
  };
}

export function isDonorRole(role) {
  const normalizedRole = normalizeRoleName(role);
  return normalizedRole === "donor" || normalizedRole === "doner";
}

export function isAdminRole(role) {
  const normalizedRole = normalizeRoleName(role);

  return (
    normalizedRole.includes("admin") ||
    normalizedRole.includes("manager") ||
    normalizedRole.includes("operations")
  );
}

export function isDonorUser(user) {
  return isDonorRole(user?.role);
}

export function isAdminUser(user) {
  return isAdminRole(user?.role) && !isDonorUser(user);
}

export function getUserHomePath(user) {
  if (isDonorUser(user)) {
    return "/doner";
  }

  if (isAdminUser(user)) {
    return "/admin";
  }

  return "/login";
}

export function serializeAdminUser(user) {
  return encodeURIComponent(JSON.stringify(normalizeAdminUser(user)));
}

export function parseAdminUser(value) {
  if (!value) {
    return adminUser;
  }

  try {
    return normalizeAdminUser(JSON.parse(decodeURIComponent(value)));
  } catch {
    return adminUser;
  }
}

export function isValidAdminSession(value) {
  return typeof value === "string" && value.trim().length > 0;
}
