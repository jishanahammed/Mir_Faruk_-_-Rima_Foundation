import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminVideoSpeeches } from "@/lib/api/admin-video-speech-service";
import { VideoSpeechTable } from "@/components/admin/video_speech/video-speech-table";
import { VideoSpeechModal } from "@/components/admin/video_speech/video-speech-modal";
import {
  createVideoSpeechAction,
  updateVideoSpeechAction,
  updateVideoSpeechPublishAction,
  deleteVideoSpeechAction,
  uploadVideoSpeechImageAction,
  deleteVideoSpeechImageAction,
} from "./actions";

export const metadata = {
  title: "Video Speeches | Admin | Mir Faruk & Rima Foundation",
};

export default async function AdminVideoSpeechPage({ searchParams }) {
  const params = await searchParams;

  let items = [];
  let errorMessage = "";

  try {
    items = await getAdminVideoSpeeches();
  } catch (err) {
    errorMessage = getApiErrorMessage(err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Homepage</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Video Speeches</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the video speech shown on the public homepage. Only one published entry (highest sort order) is shown.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            {items.length} total · {items.filter((t) => t.isPublished).length} published
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <strong className="block font-semibold">Failed to load video speeches</strong>
          {errorMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_40%),linear-gradient(135deg,#f8fafc,#f0fdf9)] px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Content</p>
              <h2 className="mt-0.5 text-xl font-extrabold text-slate-900">All Video Speeches</h2>
            </div>
            <Link
              href="/admin/video-speech?add=1"
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/60 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Add Video Speech
            </Link>
          </div>
        </div>

        <VideoSpeechTable
          items={items}
          updatePublishAction={updateVideoSpeechPublishAction}
          deleteAction={deleteVideoSpeechAction}
        />
      </section>

      <VideoSpeechModal
        params={params}
        items={items}
        createAction={createVideoSpeechAction}
        updateAction={updateVideoSpeechAction}
        uploadImageAction={uploadVideoSpeechImageAction}
        deleteImageAction={deleteVideoSpeechImageAction}
      />
    </div>
  );
}
