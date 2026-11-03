"use client";

import {
  Empty,
  Section,
  StatusDot,
  rowClass,
  tableClass,
  theadClass,
} from "./campaign-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/campaign-utils";
import type { SocialPost } from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

type Props = {
  campaignId: string;
  posts: SocialPost[];
  total: number;
  loading: boolean;
};

function postDate(post: SocialPost) {
  const value = post.publishedAt || post.scheduledFor || post.createdAt;
  return value
    ? new Date(value).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";
}

function isVideo(post: SocialPost) {
  const type = post.media?.[0]?.mimeType || "";
  return (
    type.startsWith("video/") ||
    /\.(mp4|mov|webm)(\?|$)/i.test(post.mediaUrl || "")
  );
}

export function CampaignContent({ campaignId, posts, total, loading }: Props) {
  const composeHref = `/visuals/posts?compose=1&campaignId=${campaignId}`;

  return (
    <Section
      title='Posts'
      meta={
        total
          ? `${total} linked · reach and clicks count toward Performance`
          : undefined
      }
      action={
        <Button asChild size='sm' variant='outline'>
          <Link href={composeHref}>
            <Plus /> New post
          </Link>
        </Button>
      }
    >
      {loading ? (
        <div className='space-y-px'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='h-16 rounded-none' />
          ))}
        </div>
      ) : posts.length ? (
        <div className='overflow-x-auto'>
          <table className={cn(tableClass, "min-w-[680px]")}>
            <thead className={theadClass}>
              <tr>
                <th>Post</th>
                <th className='w-28'>Platform</th>
                <th className='w-28'>Status</th>
                <th className='w-36'>Date</th>
                <th className='w-20 text-right'>Reach</th>
                <th className='w-20 text-right'>Clicks</th>
                <th className='w-8' />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const media = post.media?.[0]?.url || post.mediaUrl;
                return (
                  <tr key={post._id} className={cn(rowClass, "align-middle")}>
                    <td className='max-w-0'>
                      <div className='flex items-center gap-3'>
                        <div className='size-10 shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-white/5'>
                          {media &&
                            (isVideo(post) ? (
                              <video
                                src={media}
                                muted
                                preload='metadata'
                                className='size-full object-cover'
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={media}
                                alt=''
                                className='size-full object-cover'
                              />
                            ))}
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate font-medium'>
                            {post.title || post.content || "Untitled post"}
                          </p>
                          {post.accountName && (
                            <p className='text-muted-foreground truncate text-xs'>
                              {post.accountName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='capitalize'>{post.platform}</td>
                    <td>
                      <StatusDot status={post.status} />
                    </td>
                    <td className='text-muted-foreground text-xs whitespace-nowrap'>
                      {postDate(post)}
                    </td>
                    <td className='text-right tabular-nums'>
                      {formatCompact(
                        post.metrics?.impressions || post.metrics?.views || 0
                      )}
                    </td>
                    <td className='text-right tabular-nums'>
                      {formatCompact(post.metrics?.clicks || 0)}
                    </td>
                    <td className='text-right'>
                      {post.permalink && (
                        <a
                          href={post.permalink}
                          target='_blank'
                          rel='noreferrer'
                          aria-label='Open published post'
                          className='text-muted-foreground hover:text-foreground inline-flex'
                        >
                          <ArrowUpRight className='size-4' />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {total > posts.length && (
            <p className='text-muted-foreground mt-3 text-xs'>
              Showing the latest {posts.length} of {total}.
            </p>
          )}
        </div>
      ) : (
        <Empty
          action={
            <Button asChild size='sm'>
              <Link href={composeHref}>
                <Plus /> New post
              </Link>
            </Button>
          }
        >
          No posts yet. Create one here, or choose this campaign in any post’s
          Campaign field.
        </Empty>
      )}
    </Section>
  );
}
