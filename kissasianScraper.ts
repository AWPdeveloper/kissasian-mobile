import axios from 'axios';
import * as cheerio from 'cheerio';

const KISSASIAN_URL = 'https://kissasian.tf';

export interface Drama {
  id: string;
  title: string;
  image: string;
  url: string;
  status: string;
  episodes?: number;
  genre?: string[];
  rating?: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  url: string;
  releaseDate?: string;
}

export interface VideoSource {
  quality: string;
  url: string;
  type: 'hls' | 'mp4';
}

class KissasianScraper {
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  async getLatestDramas(): Promise<Drama[]> {
    try {
      const response = await axios.get(KISSASIAN_URL, { headers: this.headers });
      const $ = cheerio.load(response.data);
      const dramas: Drama[] = [];

      // Scrape latest dramas dari halaman utama
      $('div.film-item').each((index, element) => {
        const $el = $(element);
        const title = $el.find('h3').text().trim();
        const url = $el.find('a').attr('href') || '';
        const image = $el.find('img').attr('src') || '';
        const status = $el.find('.status').text().trim() || 'Unknown';

        if (title && url) {
          dramas.push({
            id: `drama_${index}`,
            title,
            image,
            url,
            status,
          });
        }
      });

      return dramas;
    } catch (error) {
      console.error('Error scraping latest dramas:', error);
      return [];
    }
  }

  async searchDramas(query: string): Promise<Drama[]> {
    try {
      const response = await axios.get(`${KISSASIAN_URL}/?s=${encodeURIComponent(query)}`, {
        headers: this.headers
      });
      const $ = cheerio.load(response.data);
      const dramas: Drama[] = [];

      $('div.film-item').each((index, element) => {
        const $el = $(element);
        const title = $el.find('h3').text().trim();
        const url = $el.find('a').attr('href') || '';
        const image = $el.find('img').attr('src') || '';

        if (title && url) {
          dramas.push({
            id: `search_${index}`,
            title,
            image,
            url,
            status: 'Unknown',
          });
        }
      });

      return dramas;
    } catch (error) {
      console.error('Error searching dramas:', error);
      return [];
    }
  }

  async getDramaDetails(url: string): Promise<{ drama: Drama; episodes: Episode[] }> {
    try {
      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);

      const drama: Drama = {
        id: url,
        title: $('h1.title').text().trim(),
        image: $('img.poster').attr('src') || '',
        url,
        status: $('span.status').text().trim() || 'Unknown',
        genre: $('a.genre').map((_, el) => $(el).text().trim()).get(),
      };

      const episodes: Episode[] = [];
      $('a.episode-link').each((index, element) => {
        const $el = $(element);
        const episodeNumber = parseInt($el.text().match(/\d+/)?.[0] || '0', 10);
        const episodeUrl = $el.attr('href') || '';

        episodes.push({
          id: `ep_${index}`,
          title: `Episode ${episodeNumber}`,
          episodeNumber,
          url: episodeUrl,
        });
      });

      return { drama, episodes };
    } catch (error) {
      console.error('Error getting drama details:', error);
      return { drama: { id: '', title: '', image: '', url, status: '' }, episodes: [] };
    }
  }

  async getVideoSources(episodeUrl: string): Promise<VideoSource[]> {
    try {
      const response = await axios.get(episodeUrl, { headers: this.headers });
      const $ = cheerio.load(response.data);
      const sources: VideoSource[] = [];

      // Cari iframe yang berisi video
      const iframeUrl = $('iframe').attr('src');
      if (iframeUrl) {
        // Coba ekstrak dari iframe
        const iframeResponse = await axios.get(iframeUrl, { headers: this.headers });
        const $iframe = cheerio.load(iframeResponse.data);

        // Cari m3u8 atau mp4 links
        const m3u8Links = iframeResponse.data.match(/https?:\/\/[^\s"'<>]+\.m3u8/g) || [];
        const mp4Links = iframeResponse.data.match(/https?:\/\/[^\s"'<>]+\.mp4/g) || [];

        m3u8Links.forEach((url, index) => {
          sources.push({
            quality: `HLS ${index + 1}`,
            url,
            type: 'hls'
          });
        });

        mp4Links.forEach((url, index) => {
          const quality = url.includes('1080') ? '1080p' : 
                         url.includes('720') ? '720p' : 
                         url.includes('480') ? '480p' : '360p';
          sources.push({
            quality,
            url,
            type: 'mp4'
          });
        });
      }

      return sources;
    } catch (error) {
      console.error('Error getting video sources:', error);
      return [];
    }
  }

  async getDramasByGenre(genre: string): Promise<Drama[]> {
    try {
      const response = await axios.get(`${KISSASIAN_URL}/genre/${genre}`, {
        headers: this.headers
      });
      const $ = cheerio.load(response.data);
      const dramas: Drama[] = [];

      $('div.film-item').each((index, element) => {
        const $el = $(element);
        const title = $el.find('h3').text().trim();
        const url = $el.find('a').attr('href') || '';
        const image = $el.find('img').attr('src') || '';

        if (title && url) {
          dramas.push({
            id: `genre_${index}`,
            title,
            image,
            url,
            status: 'Unknown',
          });
        }
      });

      return dramas;
    } catch (error) {
      console.error('Error getting dramas by genre:', error);
      return [];
    }
  }
}

export default new KissasianScraper();
