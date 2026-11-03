"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  type SocialComment,
  createPostComment,
  listPostComments,
  replyToPostComment,
} from "@/lib/social-posts-api";
import { LoadingFileLoader } from "@/utils/Loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, RefreshCw, Send } from "lucide-react";
import { useState } from "react";

const MAX_LENGTH = 2_000;

function errorText(error: any) {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
}

function when(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
}

function Composer({
  placeholder,
  pending,
  onSubmit,
  autoFocus,
}: {
  placeholder: string;
  pending: boolean;
  onSubmit: (text: string) => Promise<unknown>;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState("");
  const trimmed = text.trim();
  return (
    <form
      className='flex items-end gap-2'
      onSubmit={(event) => {
        event.preventDefault();
        if (!trimmed || pending) return;
        // Keep the draft when posting fails; the mutation shows the error.
        void onSubmit(trimmed)
          .then(() => setText(""))
          .catch(() => undefined);
      }}
    >
      <Textarea
        value={text}
        autoFocus={autoFocus}
        maxLength={MAX_LENGTH}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder={placeholder}
        rows={2}
        className='min-h-10 resize-none rounded-lg text-xs'
      />
      <Button
        type='submit'
        size='icon'
        disabled={!trimmed || pending}
        className='h-9 w-9 shrink-0 rounded-lg'
        aria-label='Send comment'
      >
        {pending ? <LoadingFileLoader size={14} /> : <Send className='h-4 w-4' />}
      </Button>
    </form>
  );
}

function CommentItem({
  comment,
  canReply,
  replying,
  pending,
  onReply,
  onToggleReply,
}: {
  comment: SocialComment;
  canReply: boolean;
  replying: boolean;
  pending: boolean;
  onReply: (text: string) => Promise<unknown>;
  onToggleReply: () => void;
}) {
  return (
    <li className='flex gap-2.5'>
      {comment.authorAvatar ? (
        <img
          src={comment.authorAvatar}
          alt=''
          className='h-7 w-7 shrink-0 rounded-full object-cover'
        />
      ) : (
        <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold uppercase dark:bg-white/10'>
          {(comment.authorName || "?").replace(/^@/, "").slice(0, 1)}
        </span>
      )}
      <div className='min-w-0 flex-1'>
        <div className='rounded-lg bg-black/[0.03] px-3 py-2 dark:bg-white/[0.04]'>
          <p className='text-[11px] font-semibold'>
            {comment.authorName || "Unknown"}
          </p>
          <p className='mt-0.5 text-xs leading-5 break-words whitespace-pre-wrap'>
            {comment.text}
          </p>
        </div>
        <div className='text-muted-foreground mt-1 flex items-center gap-3 px-1 text-[10px]'>
          <span>{when(comment.createdAt)}</span>
          {Boolean(comment.likeCount) && (
            <span className='flex items-center gap-1'>
              <Heart className='h-3 w-3' />
              {comment.likeCount}
            </span>
          )}
          {canReply && (
            <button
              type='button'
              onClick={onToggleReply}
              className='hover:text-foreground font-semibold'
            >
              <LocalizedText text={replying ? "Cancel" : "Reply"} />
            </button>
          )}
        </div>
        {replying && (
          <div className='mt-2'>
            <Composer
              autoFocus
              placeholder={`Reply to ${comment.authorName || "comment"}`}
              pending={pending}
              onSubmit={onReply}
            />
          </div>
        )}
        {Boolean(comment.replies?.length) && (
          <ul className='mt-3 space-y-3'>
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                canReply={false}
                replying={false}
                pending={false}
                onReply={onReply}
                onToggleReply={() => undefined}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function PostCommentsPanel({
  orgId,
  integrationId,
  postId,
}: {
  orgId?: string;
  integrationId: string;
  postId: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const queryKey = ["post-comments", orgId || "none", integrationId, postId];
  const comments = useQuery({
    queryKey,
    queryFn: () => listPostComments(integrationId, postId),
    staleTime: 30_000,
    retry: false,
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["post-analytics"] });
  };
  const create = useMutation({
    mutationFn: (text: string) => createPostComment(integrationId, postId, text),
    onSuccess: () => {
      refresh();
      toast({ title: "Comment posted" });
    },
    onError: (error) =>
      toast({
        title: "Could not post comment",
        description: errorText(error),
        variant: "destructive",
      }),
  });
  const reply = useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      replyToPostComment(integrationId, postId, commentId, text),
    onSuccess: () => {
      setReplyTo(null);
      refresh();
      toast({ title: "Reply posted" });
    },
    onError: (error) =>
      toast({
        title: "Could not post reply",
        description: errorText(error),
        variant: "destructive",
      }),
  });

  const items = comments.data?.comments || [];
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-muted-foreground text-[10px] font-semibold tracking-wider uppercase'>
          <LocalizedText text={"Comments"} />
          {comments.data ? ` · ${items.length}` : ""}
        </h3>
        <button
          type='button'
          onClick={() => comments.refetch()}
          className='text-muted-foreground hover:text-foreground'
          aria-label='Refresh comments'
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${comments.isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {comments.data?.canComment && (
        <Composer
          placeholder='Write a comment…'
          pending={create.isPending}
          onSubmit={(text) => create.mutateAsync(text)}
        />
      )}

      {comments.isLoading ? (
        <div className='flex h-32 items-center justify-center'>
          <LoadingFileLoader />
        </div>
      ) : comments.isError ? (
        <p className='rounded-lg bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200'>
          {errorText(comments.error)}
        </p>
      ) : items.length === 0 ? (
        <div className='text-muted-foreground flex h-32 flex-col items-center justify-center gap-2 text-xs'>
          <MessageCircle className='h-5 w-5' />
          <LocalizedText text={"No comments yet"} />
        </div>
      ) : (
        <ul className='space-y-4'>
          {items.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canReply={Boolean(comments.data?.canReply)}
              replying={replyTo === comment.id}
              pending={reply.isPending}
              onToggleReply={() =>
                setReplyTo((current) =>
                  current === comment.id ? null : comment.id
                )
              }
              onReply={(text) =>
                reply.mutateAsync({ commentId: comment.id, text })
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
