import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [
  routeLoading,
  serviceWorker,
  projectContext,
  company,
  removalInstructions,
  login,
  signup,
  recover,
  passwordVerification,
] = await Promise.all([
  read("../app/loading.tsx"),
  read("../public/sw.js"),
  read("../context/DesignProject.tsx"),
  read("../app/company/page.tsx"),
  read("../app/integrations/removal-instructions/page.tsx"),
  read("../components/auth/Login.tsx"),
  read("../components/auth/Signup.tsx"),
  read("../components/auth/Recover.tsx"),
  read("../components/auth/VeryPasswordTokenComp.tsx"),
]);

assert.match(routeLoading, /<Loading size=\{20\} \/>/);
assert.match(serviceWorker, /url\.searchParams\.has\("_rsc"\)/);
assert.match(serviceWorker, /event\.request\.headers\.get\("RSC"\) === "1"/);
assert.match(projectContext, /pendingDraftRef\.current = \{/);

const createProjectStart = projectContext.indexOf("const createProject = async");
const fetchProjectStart = projectContext.indexOf(
  "const fetchProject = useCallback",
  createProjectStart
);
const createProjectSource = projectContext.slice(
  createProjectStart,
  fetchProjectStart
);
assert.doesNotMatch(createProjectSource, /readAsDataURL|new FileReader/);
assert.doesNotMatch(company, /<a[\s\S]{0,200}href='\/pricing'/);
assert.doesNotMatch(
  removalInstructions,
  /<a[\s\S]{0,200}href='\/(plugins|legal\/privacy-policy)'/
);
assert.doesNotMatch(
  [login, signup, recover, passwordVerification].join("\n"),
  /prefetch=\{false\}/
);
assert.doesNotMatch(passwordVerification, /\/auth\/(updatepassword|recover)/);

console.log("navigation responsiveness tests passed");
