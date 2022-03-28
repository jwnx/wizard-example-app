import { useMemo } from "react";
import { useMatches } from "remix";
import type { ZodObject, ZodRawShape } from "zod";
import * as fs from "fs"
import * as path from "path"

import type { User } from "~/models/user.server";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}


export function getFormData<T extends ZodRawShape>(
  form: FormData,
  inputSchema: ZodObject<T>
) {
  const keys = Object.keys(inputSchema.shape);
  let returnObject: Record<string, any> = {};
  keys.forEach((item) => {
    returnObject[item] = form.get(item);
  });

  return inputSchema.parse(returnObject);
}

export interface GetChildRoutesProps {
  readonly currentRoute: string
  readonly request: Request
}

export function getChildRoutes({ currentRoute, request}: GetChildRoutesProps): Record<string, string> {
  const paths = new URL(request.url).pathname.split("/").filter(s => s !== "")
  let currentPath = currentRoute

  paths.forEach(p => {
    const filesOrFolders = fs.readdirSync(`./${currentPath}`)
    const slug = filesOrFolders.find(f => f.startsWith("$"))

    if (filesOrFolders.includes(p) ) {
      currentPath = path.join(currentPath, p)
    } else if (slug) {
      currentPath = path.join(currentPath, slug)
    }
  })

  const leafFiles = fs.readdirSync(`./${currentPath}`).filter(f => path.parse(f).ext !== "").map(f => path.parse(f).name)
  console.log(currentPath)
  console.log(leafFiles)
  return {}
}