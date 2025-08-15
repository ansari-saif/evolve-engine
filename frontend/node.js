import { spawn } from 'child_process';

const env = { ...process.env };
env.PATH = `/root/.nvm/versions/node/v22.18.0/bin:${env.PATH}`;

const child = spawn('npx', ['-y', '--package=task-master-ai', 'task-master-ai'], { env });

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
