import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MessageSquareText, FileSearch, LockKeyhole, PanelRightOpen, Plus, Search, ShieldCheck, Sparkles, UserRound, X } from "lucide-react";
import type { Json, Tables, TablesInsert } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { searchAssistantCatalogue, isCitationList, type AssistantMatch } from "@/lib/assistant-catalogue";
import { useAccess } from "@/lib/portal/access";
import { Button } from "@/components/ds/primitives";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

type Thread = Tables<"oag_ai_threads">;
type StoredMessage = Tables<"oag_ai_messages">;
type ChatMessage = { id: string; role: "user" | "assistant"; text: string; citations: string[]; mode: string };
type SearchMode = "keyword" | "semantic" | "assistant";

const suggestions = [
  "Which institutions have recurring procurement findings?",
  "Show published audits related to financial management.",
  "What recommendations remain unresolved?",
  "What are the most common audit themes?",
  "Find reports related to procurement.",
];

const modes: { id: SearchMode; label: string; state: string }[] = [
  { id: "keyword", label: "Keyword", state: "Available in the sample catalogue" },
  { id: "semantic", label: "Semantic", state: "Awaiting an authorized search service" },
  { id: "assistant", label: "Ask AI", state: "Awaiting authorized retrieval" },
];

const threadPath = (id: string) => `/portal/assistant/${id}`;
const threadIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function storedToChat(message: StoredMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role === "user" ? "user" : "assistant",
    text: message.content,
    citations: isCitationList(message.citations) ? message.citations : [],
    mode: message.query_mode,
  };
}

function responseText(matches: AssistantMatch[]): string {
  if (matches.length === 0) {
    return "No records matched that wording in the demonstration catalogue. This catalogue contains illustrative placeholders only; a search result is not evidence that OAG does or does not hold a report.";
  }
  return `The demonstration catalogue returned ${matches.length} ${matches.length === 1 ? "record" : "records"}. These entries are illustrative placeholders, not verified OAG findings. No institutional conclusion has been generated.`;
}

export default function OAGAssistant() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { can } = useAccess();
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<AssistantMatch | null>(null);
  const [searchMatches, setSearchMatches] = useState<AssistantMatch[]>([]);
  const [mode, setMode] = useState<SearchMode>("keyword");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const bootstrapUser = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const focusComposer = useCallback(() => {
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) toast.error("Account status could not be checked.");
      setUserId(data.session?.user.id ?? null);
      setAuthReady(true);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setAuthReady(true);
      setSignInOpen(false);
      setPassword("");
    });
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setThreads([]);
      setMessages([]);
      bootstrapUser.current = null;
      return;
    }
    let alive = true;
    void supabase.from("oag_ai_threads").select("id,user_id,title,created_at,updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).then(({ data, error }) => {
      if (!alive) return;
      if (error) {
        toast.error("Saved conversations could not be loaded.");
        return;
      }
      setThreads(data ?? []);
    });
    return () => { alive = false; };
  }, [userId]);

  useEffect(() => {
    if (!userId || threadId || !authReady || bootstrapUser.current === userId) return;
    bootstrapUser.current = userId;
    let alive = true;
    void supabase.from("oag_ai_threads").insert({ user_id: userId, title: "New query" }).select("id").single().then(({ data, error }) => {
      if (!alive) return;
      if (error || !data) {
        bootstrapUser.current = null;
        toast.error("A private conversation could not be started.");
        return;
      }
      navigate(threadPath(data.id), { replace: true });
    });
    return () => { alive = false; };
  }, [authReady, navigate, threadId, userId]);

  useEffect(() => {
    setMessages([]);
    setSelectedMatch(null);
    setSearchMatches([]);
    if (!threadId) {
      setLoading(false);
      return;
    }
    if (!threadIdPattern.test(threadId)) {
      toast.error("This conversation address is invalid.");
      navigate("/portal/assistant", { replace: true });
      return;
    }
    if (!userId) {
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    void supabase.from("oag_ai_threads").select("id").eq("id", threadId).eq("user_id", userId).maybeSingle().then(async ({ data: thread, error }) => {
      if (!alive) return;
      if (error || !thread) {
        toast.error("This conversation is unavailable to this account.");
        navigate("/portal/assistant", { replace: true });
        setLoading(false);
        return;
      }
      const result = await supabase.from("oag_ai_messages").select("id,thread_id,user_id,role,content,query_mode,citations,created_at").eq("thread_id", threadId).eq("user_id", userId).order("created_at", { ascending: true });
      if (!alive) return;
      if (result.error) {
        toast.error("Conversation messages could not be loaded.");
      } else {
        const restored = (result.data ?? []).map(storedToChat);
        setMessages(restored);
        const latestCitation = [...restored].reverse().find((item) => item.role === "assistant" && item.citations.length)?.citations[0];
        const citationDoc = latestCitation ? searchAssistantCatalogue(latestCitation).find((item) => item.document.id === latestCitation) : undefined;
        if (citationDoc) setSelectedMatch(citationDoc);
      }
      setLoading(false);
      focusComposer();
    });
    return () => { alive = false; };
  }, [focusComposer, navigate, threadId, userId]);

  const sourceById = useMemo(() => {
    const docs = searchAssistantCatalogue("audit procurement financial recommendation health governance");
    return new Map(docs.map((match) => [match.document.id, match]));
  }, []);

  const createThread = useCallback(async () => {
    if (!userId) {
      setSignInOpen(true);
      return;
    }
    const { data, error } = await supabase.from("oag_ai_threads").insert({ user_id: userId, title: "New query" }).select("id,user_id,title,created_at,updated_at").single();
    if (error || !data) {
      toast.error("A new private conversation could not be saved.");
      return;
    }
    setThreads((current) => [data, ...current]);
    setMessages([]);
    navigate(threadPath(data.id));
    focusComposer();
  }, [focusComposer, navigate, userId]);

  const handleSubmit = useCallback(async (message: PromptInputMessage) => {
    const question = message.text.trim();
    if (!question || sending) return;
    setInput("");
    setSending(true);

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text: question, citations: [], mode };
    if (mode !== "keyword") {
      const pendingText = mode === "semantic"
        ? "Semantic search is not connected. Your text stayed in this browser and was not sent to a search service."
        : "AI answers are unavailable until an authorized OAG retrieval service is connected. Your text stayed in this browser and was not sent to an AI service.";
      setMessages((current) => [...current, userMessage, { id: crypto.randomUUID(), role: "assistant", text: pendingText, citations: [], mode }]);
      setSending(false);
      focusComposer();
      return;
    }

    const matches = searchAssistantCatalogue(question);
    const answer: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: responseText(matches),
      citations: matches.map((item) => item.document.id),
      mode,
    };
    const next = [userMessage, answer];
    setSearchMatches(matches);
    setMessages((current) => [...current, ...next]);
    setSelectedMatch(matches[0] ?? null);

    if (userId && threadId && threadIdPattern.test(threadId)) {
      const rows: TablesInsert<"oag_ai_messages">[] = next.map((item) => ({
        thread_id: threadId,
        user_id: userId,
        role: item.role,
        content: item.text,
        query_mode: item.mode,
        citations: item.citations as Json,
      }));
      const { error } = await supabase.from("oag_ai_messages").insert(rows);
      if (error) {
        toast.error("Your search was not saved to conversation history.");
      } else {
        const currentThread = threads.find((item) => item.id === threadId);
        const title = currentThread?.title === "New query" ? question.slice(0, 64) : currentThread?.title;
        const updatedAt = new Date().toISOString();
        const patch = title ? { title, updated_at: updatedAt } : { updated_at: updatedAt };
        const updateResult = await supabase.from("oag_ai_threads").update(patch).eq("id", threadId).eq("user_id", userId);
        if (updateResult.error) toast.error("The search is saved, but the conversation title could not be updated.");
        setThreads((current) => current.map((item) => item.id === threadId ? { ...item, ...patch } : item).sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
      }
    }
    setSending(false);
    focusComposer();
  }, [focusComposer, mode, sending, threadId, threads, userId]);

  const submitSuggestion = useCallback((question: string) => {
    void handleSubmit({ text: question, files: [] });
  }, [handleSubmit]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigningIn(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setAuthError(error.message);
    setSigningIn(false);
  };

  if (!can("assistant.view")) {
    return (
      <div className="grid min-h-[48vh] place-items-center border border-dashed border-border bg-card px-5 py-12 text-center">
        <div><LockKeyhole className="mx-auto size-7 text-muted-foreground" aria-hidden="true" /><h1 className="mt-3 font-display text-h3">Access restricted</h1><p className="mt-2 max-w-lg text-small text-ink-soft">Your current OAG role does not include access to Knowledge Intelligence. No source search or conversation content was opened.</p></div>
      </div>
    );
  }

  const loadingConversation = Boolean(threadId && userId && loading);
  const activeMode = modes.find((item) => item.id === mode);

  return (
    <div className="assistant-interface -m-4 min-h-[calc(100vh-6.5rem)] md:-m-6 xl:-m-8">
      <header className="border-b border-border bg-background px-4 py-5 md:px-6 xl:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">OAG Knowledge Intelligence</p>
            <h1 className="mt-2 font-display text-h1 text-ink">Ask OAG Intelligence</h1>
            <p className="mt-2 max-w-2xl text-small text-ink-soft">Explore authorized audit knowledge, publications, recommendations and institutional information.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {userId ? (
              <Button variant="ghost" size="sm" onClick={() => void supabase.auth.signOut()}><UserRound aria-hidden="true" />Sign out</Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setSignInOpen(true)}><LockKeyhole aria-hidden="true" />Sign in to save history</Button>
            )}
            <Button variant="primary" size="sm" onClick={() => void createThread()}><Plus aria-hidden="true" />New conversation</Button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 text-xs">
          <span className="inline-flex items-center gap-2 font-semibold text-status-warning"><span className="size-2 rounded-full bg-status-warning" />Illustrative catalogue · not verified OAG evidence</span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground"><ShieldCheck className="size-3.5" aria-hidden="true" />Restricted documents are not included</span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground"><LockKeyhole className="size-3.5" aria-hidden="true" />{userId ? "Private history enabled" : "Search preview · sign-in required for saved history"}</span>
        </div>
      </header>

      <div className="assistant-workspace">
        <aside className="assistant-history" aria-label="Saved conversations">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-3">
            <div><h2 className="text-small font-semibold text-ink">Your conversations</h2><p className="mt-0.5 text-xs text-muted-foreground">{userId ? `${threads.length} saved` : "Sign in to save history"}</p></div>
            <Button variant="ghost" size="icon" aria-label="Start a new conversation" title="New conversation" onClick={() => void createThread()}><Plus aria-hidden="true" /></Button>
          </div>
          <nav className="assistant-thread-list" aria-label="Conversation list">
            {userId && threads.map((thread) => (
              <Link key={thread.id} to={threadPath(thread.id)} aria-current={threadId === thread.id ? "page" : undefined} className={`assistant-thread ${threadId === thread.id ? "is-active" : ""}`}>
                <MessageSquareText className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0"><span className="block truncate font-semibold">{thread.title}</span><span className="mt-1 block font-mono text-[0.65rem] text-muted-foreground">{new Date(thread.updated_at).toLocaleDateString()}</span></span>
              </Link>
            ))}
            {!userId && <p className="px-3 py-4 text-xs leading-relaxed text-muted-foreground">Private saved conversations appear here after you sign in. Unauthenticated search previews remain in this page only.</p>}
            {userId && threads.length === 0 && <p className="px-3 py-4 text-xs text-muted-foreground">No saved conversations yet.</p>}
          </nav>
          <div className="assistant-history-note"><LockKeyhole className="size-3.5 shrink-0" aria-hidden="true" /><span>Saved conversations are scoped to your signed-in account.</span></div>
        </aside>

        <section className="assistant-main" aria-label="Search and conversation">
          <div className="assistant-modebar">
            <div className="flex flex-wrap items-center gap-1" aria-label="Search mode">
              {modes.map((item) => (
                <Button key={item.id} variant={mode === item.id ? "filter" : "ghost"} size="sm" aria-pressed={mode === item.id} title={item.state} onClick={() => setMode(item.id)}>{item.id === "keyword" ? <Search aria-hidden="true" /> : item.id === "semantic" ? <FileSearch aria-hidden="true" /> : <MessageSquareText aria-hidden="true" />}{item.label}</Button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{activeMode?.state}</span>
          </div>

          <div className="assistant-transcript" aria-label="Conversation messages">
            <Conversation className="assistant-conversation">
              <ConversationContent className="assistant-conversation-content">
                {loadingConversation ? (
                  <div className="flex min-h-40 items-center gap-3 px-3 text-sm text-muted-foreground"><Shimmer>Loading this account’s conversation…</Shimmer></div>
                ) : messages.length === 0 ? (
                  <ConversationEmptyState
                    className="assistant-empty-state"
                    icon={<span className="assistant-mark" aria-hidden="true">OAG</span>}
                    title="What would you like to explore?"
                    description="Choose a question or search the clearly marked demonstration catalogue."
                  >
                    <div className="assistant-suggestions">
                      <div className="mb-1 flex items-center gap-2 text-left text-[0.67rem] font-semibold uppercase text-muted-foreground"><Sparkles className="size-3.5" aria-hidden="true" />Suggested questions</div>
                      {suggestions.map((suggestion) => <Button key={suggestion} variant="filter" size="sm" className="h-auto min-h-9 justify-start whitespace-normal text-left font-medium" onClick={() => submitSuggestion(suggestion)}>{suggestion}</Button>)}
                    </div>
                  </ConversationEmptyState>
                ) : (
                  messages.map((message) => (
                    <Message key={message.id} from={message.role} className="assistant-message">
                      <div className={`assistant-message-label ${message.role === "user" ? "justify-end" : ""}`}>
                        {message.role === "assistant" && <span className="assistant-mark assistant-mark-small" aria-hidden="true">OAG</span>}
                        <span>{message.role === "assistant" ? "OAG INTELLIGENCE" : "YOU"}</span>
                        {message.role === "user" && <span className="assistant-user-mark" aria-hidden="true"><UserRound className="size-3" /></span>}
                      </div>
                      <MessageContent className={message.role === "user" ? "assistant-user-message" : "assistant-answer-message"}>
                        {message.role === "assistant" && message.mode === "keyword" && (
                          <div className="assistant-answer-context">
                            <div><span className="assistant-evidence-label">SOURCE FACT</span><span className="ml-2 text-xs text-muted-foreground">{message.citations.length ? `${message.citations.length} sample ${message.citations.length === 1 ? "record" : "records"}` : "Catalogue match"}</span></div>
                            <span className="assistant-confidence">Context only · confidence not assessed</span>
                          </div>
                        )}
                        <MessageResponse isAnimating={false}>{message.text}</MessageResponse>
                        {message.role === "assistant" && message.citations.length > 0 && (
                          <div className="assistant-citations">
                            <div className="assistant-citations-head"><FileSearch className="size-4" aria-hidden="true" /><span>Source documents</span><span className="assistant-citation-count">{message.citations.length}</span></div>
                            {message.citations.map((citation) => {
                              const match = sourceById.get(citation);
                              if (!match) return null;
                              return <CitationResult key={citation} match={match} onOpen={() => setSelectedMatch(match)} selected={selectedMatch?.document.id === citation} />;
                            })}
                            <div className="assistant-interpretation"><span className="assistant-interpretation-label">AI INTERPRETATION</span><p>No AI interpretation generated. Authorized OAG retrieval is not connected.</p></div>
                          </div>
                        )}
                      </MessageContent>
                    </Message>
                  ))
                )}
                {sending && <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground"><span className="assistant-mark assistant-mark-small" aria-hidden="true">OAG</span><Shimmer>Checking the demonstration catalogue…</Shimmer></div>}
              </ConversationContent>
              <ConversationScrollButton className="border-border bg-card text-ink hover:bg-muted" />
            </Conversation>
          </div>

          <PromptInput onSubmit={handleSubmit} className="assistant-composer" aria-label="Ask a question">
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              placeholder={mode === "keyword" ? "Search document titles, references, topics…" : mode === "semantic" ? "Semantic search is not connected" : "AI answers are not connected"}
              onChange={(event) => setInput(event.currentTarget.value)}
              disabled={sending || !authReady}
              aria-label="Search the OAG knowledge catalogue"
            />
            <PromptInputFooter className="assistant-composer-footer">
              <span className="max-w-[75%] text-[0.67rem] leading-snug text-muted-foreground">Search preview only · do not enter sensitive or restricted information</span>
              <PromptInputSubmit status={sending ? "submitted" : "ready"} onStop={() => setSending(false)} disabled={!input.trim() || !authReady} aria-label={sending ? "Stop search" : "Search"} />
            </PromptInputFooter>
          </PromptInput>
        </section>

        <aside className="assistant-inspector" aria-label="Supporting source details">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div><p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">Document intelligence</p><h2 className="mt-1 text-small font-semibold text-ink">Source inspector</h2></div>
            <PanelRightOpen className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          {selectedMatch ? (
            <SourceInspector match={selectedMatch} />
          ) : searchMatches.length === 0 ? (
            <div className="assistant-inspector-empty"><FileSearch className="size-5 text-muted-foreground" aria-hidden="true" /><p>Open a matching source document to inspect its catalogue details.</p><span>Restricted sources remain withheld.</span></div>
          ) : null}
          {searchMatches.length > 0 && <p className="mx-4 mt-4 border-t border-border pt-3 text-[0.68rem] leading-relaxed text-muted-foreground">Catalogue metadata and excerpts are placeholders. Verify every record against an approved source before relying on it.</p>}
        </aside>
      </div>

      <Dialog.Root open={signInOpen} onOpenChange={setSignInOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border border-border bg-card p-6 shadow-overlay focus:outline-none">
            <div className="flex items-start justify-between gap-4"><div><Dialog.Title className="font-display text-h3 text-ink">Sign in to OAG</Dialog.Title><Dialog.Description className="mt-1 text-small text-ink-soft">Sign in to save and reopen your private conversations.</Dialog.Description></div><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close sign-in"><X aria-hidden="true" /></Button></Dialog.Close></div>
            <form className="mt-5 grid gap-3" onSubmit={(event) => void signIn(event)}>
              <label className="grid gap-1.5 text-small font-semibold text-ink" htmlFor="assistant-email">Email<Input id="assistant-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <label className="grid gap-1.5 text-small font-semibold text-ink" htmlFor="assistant-password">Password<Input id="assistant-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
              {authError && <p className="border border-status-critical/30 bg-status-critical/5 p-2 text-sm text-status-critical" role="alert">{authError}</p>}
              <p className="text-xs leading-relaxed text-muted-foreground">Use an existing OAG account. Account creation is not available here.</p>
              <Button type="submit" loading={signingIn} className="mt-2 w-full">Sign in</Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function CitationResult({ match, selected, onOpen }: { match: AssistantMatch; selected: boolean; onOpen: () => void }) {
  return (
    <article className={`assistant-citation ${selected ? "is-selected" : ""}`}>
      <button type="button" className="assistant-citation-select" onClick={onOpen} aria-label={`Inspect source ${match.document.title}`}>
        <span className="assistant-citation-mark"><FileSearch className="size-4" aria-hidden="true" /></span>
        <span className="min-w-0 flex-1"><span className="block line-clamp-2 font-semibold text-ink">{match.document.title}</span><span className="mt-1 block font-mono text-[0.65rem] text-muted-foreground">{match.document.ref} · {match.matchedIn}</span></span>
      </button>
      <div className="assistant-citation-meta">
        <span><strong>Page / section</strong>{match.section ? `${match.section.kind} · page not supplied` : "Not supplied in sample record"}</span>
        <span><strong>Related audit</strong>{match.document.relatedAudits?.[0] ?? "Not supplied"}</span>
        <span><strong>Related recommendation</strong>{match.document.recommendations?.[0]?.title ?? "Not supplied"}</span>
      </div>
    </article>
  );
}

function SourceInspector({ match }: { match: AssistantMatch }) {
  const { document } = match;
  return (
    <div className="assistant-source-detail">
      <div className="assistant-source-status"><span className="assistant-source-file"><FileSearch className="size-5" aria-hidden="true" /></span><span><span className="block font-mono text-[0.65rem] uppercase text-status-warning">Sample record</span><span className="mt-0.5 block text-xs text-muted-foreground">Not verified OAG evidence</span></span></div>
      <p className="mt-4 font-mono text-[0.68rem] uppercase text-muted-foreground">{document.ref} · {document.year}</p>
      <h3 className="mt-2 font-display text-h4 leading-snug text-ink">{document.title}</h3>
      <dl className="assistant-source-fields">
        <div><dt>Institution</dt><dd>{document.institution}</dd></div>
        <div><dt>Document type</dt><dd>{document.type}</dd></div>
        <div><dt>Source location</dt><dd>{match.section ? `${match.section.kind} · page not supplied` : "No page or section supplied"}</dd></div>
        <div><dt>Match method</dt><dd>Keyword match · {match.matchedIn}</dd></div>
      </dl>
      <div className="assistant-source-excerpt"><p className="assistant-source-kicker">CATALOGUE EXCERPT</p><p>{match.section?.text ?? document.summary}</p></div>
      <div className="assistant-related"><h4>Related audit</h4><p>{document.relatedAudits?.[0] ?? "Not supplied in the sample catalogue."}</p></div>
      <div className="assistant-related"><h4>Related recommendation</h4><p>{document.recommendations?.[0]?.title ?? "Not supplied in the sample catalogue."}</p></div>
      <Link className="assistant-open-record" to={`/publications/document/${document.id}`}><FileSearch className="size-4" aria-hidden="true" />Open source record</Link>
    </div>
  );
}