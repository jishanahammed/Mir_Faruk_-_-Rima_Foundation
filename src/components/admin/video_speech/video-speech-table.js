"use client";

import Link from "next/link";
import { VideoSpeechDeleteButton } from "./video-speech-delete-button";
import { VideoSpeechPublishToggle } from "./video-speech-publish-toggle";

function buildPreviewUrl(rawPath) {
  if (!rawPath) return null;
  const clean = rawPath.replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  return `/api/asset?path=${encodeURIComponent(clean)}`;
}

export function VideoSpeechTable({ items, updatePublishAction, deleteAction }) {
  return (
    <div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-cyan-400">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">No video speeches found</p>
          <p className="mt-1 text-xs text-slate-400">Add your first video speech to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="w-10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                <th className="w-16 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Image</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Name / Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Video ID</th>
                <th className="w-16 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Order</th>
                <th className="w-28 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="w-32 px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item, idx) => (
                <tr key={item.id} className="group transition hover:bg-cyan-50/40">
                  <td className="px-4 py-3 text-xs font-semibold text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    {item.backgroundImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={buildPreviewUrl(item.backgroundImageUrl)}
                        alt={item.nameEn}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.nameEn}</div>
                    <div className="text-xs text-slate-400">{item.roleEn}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{item.videoId}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-50 text-xs font-bold text-cyan-700">
                      {item.sortOrder}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <VideoSpeechPublishToggle
                      id={item.id}
                      isPublished={item.isPublished}
                      action={updatePublishAction}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/video-speech?edit=${item.id}`}
                        className="inline-flex h-8 items-center rounded-lg border border-cyan-200 bg-white px-3 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-50"
                      >
                        Edit
                      </Link>
                      <VideoSpeechDeleteButton id={item.id} name={item.nameEn} action={deleteAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
