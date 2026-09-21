import { NextRequest, NextResponse } from 'next/server';

type OpenMediaItem = {
  vod_id: string;
  vod_name: string;
  vod_pic: string;
  vod_year: string;
  vod_class: string;
  vod_content: string;
  vod_play_url: string;
  type_name: string;
};

const ITEMS: OpenMediaItem[] = [
  {
    vod_id: 'big-buck-bunny',
    vod_name: 'Big Buck Bunny',
    vod_pic: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
    vod_year: '2008',
    vod_class: 'Animation,Short,Open Movie',
    vod_content:
      'Blender Foundation open movie. This entry is provided as a lawful playback test source for the self-hosted player.',
    vod_play_url:
      'Full Movie$https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type_name: 'Open Movie',
  },
  {
    vod_id: 'sintel',
    vod_name: 'Sintel',
    vod_pic: '',
    vod_year: '2010',
    vod_class: 'Animation,Fantasy,Open Movie',
    vod_content:
      'Blender Foundation open movie. This entry is provided as a lawful playback test source for the self-hosted player.',
    vod_play_url:
      'Full Movie$https://cdn.theoplayer.com/video/sintel/nosubs.m3u8',
    type_name: 'Open Movie',
  },
  {
    vod_id: 'tears-of-steel',
    vod_name: 'Tears of Steel',
    vod_pic: '',
    vod_year: '2012',
    vod_class: 'Science Fiction,Open Movie',
    vod_content:
      'Blender Foundation open movie. This entry is provided as a lawful playback test source for the self-hosted player.',
    vod_play_url:
      'Full Movie$https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    type_name: 'Open Movie',
  },
];

export const dynamic = 'force-dynamic';

function normalize(value: string | null): string {
  return (value || '').trim().toLowerCase();
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get('ids');
  const query = normalize(searchParams.get('wd'));

  let list = ITEMS;

  if (ids) {
    const wanted = new Set(
      ids
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    );
    list = ITEMS.filter((item) => wanted.has(item.vod_id));
  } else if (query) {
    list = ITEMS.filter((item) => {
      const haystack = [
        item.vod_name,
        item.vod_year,
        item.vod_class,
        item.type_name,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return NextResponse.json(
    {
      code: 1,
      msg: 'success',
      page: 1,
      pagecount: 1,
      limit: list.length,
      total: list.length,
      list,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    }
  );
}
