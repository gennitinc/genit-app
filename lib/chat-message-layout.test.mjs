import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("message identity uses a full-width header above full-width content", () => {
  const source = readFileSync(
    new URL(
      "../components/chat/messages/message-container.tsx",
      import.meta.url
    ),
    "utf8"
  );
  const projectContext = readFileSync(
    new URL("../context/DesignProject.tsx", import.meta.url),
    "utf8"
  );
  const agentMessage = readFileSync(
    new URL("../components/chat/agent/agent-message.tsx", import.meta.url),
    "utf8"
  );
  const thinkingStream = readFileSync(
    new URL(
      "../components/chat/agent/agent-thinking-stream.tsx",
      import.meta.url
    ),
    "utf8"
  );
  const chatLayout = readFileSync(
    new URL("../components/layout/chat-layout.tsx", import.meta.url),
    "utf8"
  );
  const textChat = readFileSync(
    new URL("../components/chat/text-chat-content.tsx", import.meta.url),
    "utf8"
  );
  const chatInput = readFileSync(
    new URL("../components/chat/chat-input.tsx", import.meta.url),
    "utf8"
  );
  const topNav = readFileSync(
    new URL("../components/layout/top-nav-with-aurora.tsx", import.meta.url),
    "utf8"
  );
  const wrapper = readFileSync(
    new URL("../components/layout/wrapper.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /w-full space-y-2/);
  assert.match(source, /items-center justify-between/);
  assert.match(source, /\{avatar\}[\s\S]*\{name\}/);
  assert.match(source, /status &&/);
  assert.match(source, /w-full min-w-0/);
  assert.doesNotMatch(source, /flex items-start|ml-11/);
  assert.match(projectContext, /currentOrg\?\.businessName/);
  assert.match(projectContext, /user\?\.onboarding\?\.businessName/);
  assert.doesNotMatch(projectContext, /const userName = user\?\.username/);
  assert.doesNotMatch(projectContext, /user\?\.userdp/);
  assert.match(agentMessage, /flex flex-col gap-4/);
  assert.match(agentMessage, /className='bg-transparent p-0'/);
  assert.match(agentMessage, /<AgentThinkingStream/);
  assert.match(
    agentMessage,
    /active=\{run\.thinkingActive && run\.status === "running"\}/
  );
  assert.match(thinkingStream, /const open = active \|\| userOpen/);
  assert.match(thinkingStream, /if \(!active\)[\s\S]*setUserOpen\(false\)/);
  assert.match(thinkingStream, /setUserOpen\(\(o\) => !o\)/);
  assert.match(thinkingStream, /Thought process/);
  assert.doesNotMatch(agentMessage, /text=\{"Done"\}/);
  assert.match(thinkingStream, /mb-2 overflow-hidden/);
  assert.doesNotMatch(thinkingStream, /my-2 overflow-hidden/);
  assert.match(
    chatLayout,
    /useDocumentScroll = !isDesktop \|\| !isPreviewOpen/
  );
  assert.match(chatLayout, /<TextChatContent useDocumentScroll/);
  assert.match(textChat, /window\.scrollTo/);
  assert.match(textChat, /useDocumentScroll \? "overflow-visible"/);
  assert.match(textChat, /scrollFrameRef/);
  assert.match(textChat, /initial='instant'/);
  assert.match(textChat, /resize='instant'/);
  assert.doesNotMatch(textChat, /behavior: "smooth"/);
  assert.match(textChat, /if \(!useDocumentScroll\) return/);
  assert.match(chatLayout, /\[overflow-anchor:none\]/);
  assert.match(chatLayout, /layout=\{isPreviewOpen\}/);
  assert.match(
    chatLayout,
    /pointer-events-none sticky top-12 z-50 h-0 w-full shrink-0/
  );
  assert.match(chatLayout, /isDesktop && !isPreviewOpen/);
  assert.doesNotMatch(chatLayout, /hasAnyPreview && !isPreviewOpen/);
  assert.doesNotMatch(chatLayout, /hasAnyPreview && isPreviewOpen/);
  assert.match(chatLayout, /left-\[37\.5%\] -translate-x-1\/2/);
  assert.doesNotMatch(chatLayout, /absolute top-14 right-3/);
  assert.match(
    chatLayout,
    /"sticky top-0 h-\[100dvh\] self-start \[&>\.peer\]:h-full"[\s\S]*<AppSidebar/
  );
  assert.doesNotMatch(
    chatLayout,
    /<AppSidebar[\s\S]{0,160}"sticky top-0 h-\[100dvh\] self-start"/
  );
  assert.match(chatInput, /\[overflow-anchor:none\]/);
  assert.match(chatInput, /group relative flex[^']*overflow-hidden/);
  assert.match(chatLayout, /<TopNavWithAurora[\s\S]*\/>/);
  assert.doesNotMatch(chatLayout, /<div className='flex-none'>[\s\S]*TopNav/);
  assert.match(topNav, /<SidebarTrigger className='z-20 -ml-2' \/>/);
  assert.doesNotMatch(topNav, /isChatIdPage|isPreviewOpen/);
  assert.match(wrapper, /\^\\\/chat\\\/\[\^\/\]\+\$/);
  assert.match(wrapper, /pathname !== "\/chat\/history"/);
  assert.match(wrapper, /setChatSidebarOpen\(false\)/);
  assert.match(
    wrapper,
    /isChatIdPage \? setChatSidebarOpen : handleSidebarOpenChange/
  );
});
