import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [
  routeLoading,
  serviceWorker,
  serviceWorkerRegister,
  clientProviders,
  mixpanelClient,
  visualsHome,
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
  read("../components/pwa/service-worker-register.tsx"),
  read("../components/layout/client-providers.tsx"),
  read("../lib/mixpanelClient.ts"),
  read("../app/visuals/page.tsx"),
  read("../context/DesignProject.tsx"),
  read("../app/company/page.tsx"),
  read("../app/integrations/removal-instructions/page.tsx"),
  read("../components/auth/Login.tsx"),
  read("../components/auth/Signup.tsx"),
  read("../components/auth/Recover.tsx"),
  read("../components/auth/VeryPasswordTokenComp.tsx"),
]);

assert.match(routeLoading, /<Loading size=\{20\} \/>/);
assert.doesNotMatch(serviceWorker, /addEventListener\("fetch"/);
assert.doesNotMatch(serviceWorker, /registration\.unregister/);
assert.match(serviceWorker, /clients\.claim/);
assert.match(serviceWorkerRegister, /serviceWorker\.register\("\/sw\.js"/);
assert.match(serviceWorkerRegister, /key\.startsWith\("genit-"\)/);
assert.match(clientProviders, /<PWAInstaller \/>/);
assert.match(serviceWorkerRegister, /failed to fetch RSC payload/);
assert.match(serviceWorkerRegister, /Connection closed/);
assert.match(serviceWorkerRegister, /Minified React error #412/);
assert.match(mixpanelClient, /import\("mixpanel-browser"\)/);
assert.doesNotMatch(mixpanelClient, /^import mixpanel/m);
assert.match(
  visualsHome,
  /dynamic\(\(\) => import\("\.\/_components\/visuals-charts"\)\)/
);
assert.doesNotMatch(visualsHome, /from "recharts"/);
assert.match(projectContext, /pendingDraftRef\.current = \{/);

const createProjectStart = projectContext.indexOf(
  "const createProject = async"
);
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
