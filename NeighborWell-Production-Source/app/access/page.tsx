import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import AccessCenter from "./AccessCenter";

export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const user = await requireChatGPTUser("/access");
  return <AccessCenter user={user} signOutPath={chatGPTSignOutPath("/")} />;
}

