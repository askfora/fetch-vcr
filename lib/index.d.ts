declare module 'fetch-vcr' {
  function fetchVCR(url: string, args: object): Promise<any>;

  interface Config {
    mode?: 'playback' | 'cache' | 'record' | 'erase';
    fixturePath?: string;
    ignoreUrls?: string[];
    headerBlacklist?: string[]
  }

  interface Args {
    method: string;
    redirect: string;
    body: any;
    headers: {};
  }

  inteface Response {
    url: string;
    status: string;
    statusText: string;
    ok: boolean;
    headers: {};
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
