import { Controller, Post, Body } from '@nestjs/common';
import { PodcastService } from './podcast.service';

@Controller('podcast')
export class PodcastController {
    constructor(private readonly podcastService: PodcastService) { }

    @Post('play')
    async play(@Body() body: { url: string }): Promise<string> {
        //    const { url } = body;
        const url =
            'https://download.deutschlandfunk.de/file/dradio/2023/09/27/der_tag_270923_dlf_20230927_1700_af1801b7.mp3';
        return this.podcastService.playPodcast(url);
    }
}
