declare module 'fetch-vcr' {
  function fetchVCR(url: string, args: object): Promise<any>;

  interface Config {
    mode?: 'playback' | 'cache' | 'record' | 'erase';
    fixturePath?: string;
    ignoreUrls?: string[];
    headerBlacklist?: string[]
  }

  interface Args {
    body: string:;
    method: string;
    redirect: string;
    headers: Record<string, never>;
  }

  inteface Response {
    url: string;
    status: number;
    statusText: string;
    ok: boolean;
    headers: Record<string, never>;
  }

  namespace fetchVCR {
    function configure(config: Config): void;
    function loadFile(root: string, filename: string): Promise<string>;
    function saveFile(root: string, filename: string, buffer: string): Promise<'fetch-saved'>;
    function getCalled(): {url: string; args: Args; response: Response; hash: string; bodyFilename: string; optionsFilename: string;}[];
    function clearCalled(): void;
  }
  export default fetchVCR;
}
