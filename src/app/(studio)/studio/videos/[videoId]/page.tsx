import { VideoView } from "@/modules/studio/ui/view/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface VideoPageProps {
    params: Promise<{ videoId: string }>
}

const VideoPage = async ({ params }: VideoPageProps) => {
    const { videoId } = await params
    void trpc.studio.getOne.prefetch({ id: videoId });
    void trpc.categories.getMany.prefetch();

    return ( 
        <HydrateClient>
            <VideoView videoId={videoId}/>
        </HydrateClient>
     );
}
 
export default VideoPage;