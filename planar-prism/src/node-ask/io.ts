export class ConsoleIO {
  constructor(
    private stdin: NodeJS.ReadStream = process.stdin,
    private stdout: NodeJS.WriteStream = process.stdout,
  ) {}

  write(message: string): void {
    this.stdout.write(message);
  }

  async readLine(): Promise<string> {
    return new Promise((resolve) => {
      this.stdin.setEncoding('utf8');
      this.stdin.once('data', (data: string) => {
        this.stdin.pause();
        resolve(data.slice(0, -1)); // trim \n
      }).resume();
    });
  }

  async readMultiline(): Promise<string> {
    return new Promise((resolve) => {
      const lines: string[] = [];
      this.stdout.write('\n');
      this.stdin.setEncoding('utf8');

      const onData = (data: string) => {
        if (data === '\n' || data === '\r\n') {
          this.stdin.pause();
          this.stdin.removeAllListeners('data');
          resolve(lines.join('\n'));
        }
        else {
          lines.push(data.slice(0, -1));
        }
      };

      this.stdin.on('data', onData).resume();
    });
  }
}
