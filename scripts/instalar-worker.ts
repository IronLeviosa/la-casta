/**
 * pnpm instalar-worker [--todas]   -> imprime (no ejecuta) como registrar `pnpm worker`
 * para que arranque solo: schtasks (Windows), launchd (macOS), systemd --user (Linux).
 * Sin `--todas` imprime solo lo de esta maquina; con `--todas`, los tres (sirve para
 * preparar la PC Windows desde la Mac).
 */
import { delimiter, join } from 'node:path';
import { homedir, userInfo } from 'node:os';
import { RAIZ } from './lib/rutas.ts';
import { buscarEjecutable } from './lib/ejecutable.ts';
import { parsearArgs } from './lib/log.ts';

const pnpm = buscarEjecutable('pnpm') ?? 'pnpm';
const node = buscarEjecutable('node') ?? 'node';
const registro = join(RAIZ, '.cache', 'worker.log');

/** Escapa para meter texto en XML (plist) sin romperlo. */
function xml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * PATH para el servicio, sin las entradas efimeras de la sesion actual
 * (node_modules/.bin del proyecto, cache de corepack, sesiones de agentes):
 * si quedan escritas en el plist, apuntan a carpetas que manana no existen.
 */
function pathEstable(): string {
  const partes = (process.env.PATH ?? '').split(delimiter).filter(Boolean);
  const efimera = (p: string) => /node_modules[\\/]\.bin|corepack[\\/]v\d|local-agent-mode-sessions|[\\/]T[\\/]|Temp[\\/]/i.test(p);
  const limpias = partes.filter((p) => !efimera(p));
  return (limpias.length ? limpias : partes).join(delimiter);
}

function windows(): string {
  const usuario = userInfo().username;
  // Dentro de /tr "..." todas las comillas interiores van escapadas igual.
  const cmd = `\\"${pnpm}\\" worker`;
  return [
    '== Windows: Programador de tareas (arranca al iniciar sesion, reinicia si se cae) ==',
    '',
    ...(process.platform === 'win32'
      ? []
      : ['(Estas rutas son las de ESTA maquina. En la PC Windows corre alla `pnpm instalar-worker` para tener las de Windows.)', '']),
    'Abri PowerShell en la carpeta del repo y pega (una sola linea):',
    '',
    `schtasks /create /tn "LaCastaWorker" /sc onlogon /ru "${usuario}" /rl LIMITED /f /tr "cmd /c cd /d \\"${RAIZ}\\" && ${cmd} >> \\"${registro}\\" 2>&1"`,
    '',
    'Para que se reinicie sola si el proceso muere, edita la tarea despues:',
    '  Propiedades > Configuracion > "Si la tarea falla, reiniciar cada: 1 minuto", intentos: 999',
    '  Propiedades > Condiciones > destildar "Iniciar solo si el equipo esta conectado a la corriente"',
    '  Propiedades > Configuracion > destildar "Detener la tarea si se ejecuta durante mas de..."',
    '',
    'Arrancarla ahora sin reiniciar sesion:   schtasks /run /tn "LaCastaWorker"',
    'Ver estado:                               schtasks /query /tn "LaCastaWorker" /v /fo list',
    'Borrarla:                                 schtasks /delete /tn "LaCastaWorker" /f',
    '',
    'Alternativa como servicio real (sin sesion abierta): nssm (winget install nssm), luego:',
    `  nssm install LaCastaWorker "${pnpm}" worker`,
    `  nssm set LaCastaWorker AppDirectory "${RAIZ}"`,
    `  nssm set LaCastaWorker AppStdout "${registro}"`,
    `  nssm set LaCastaWorker AppStderr "${registro}"`,
    '  nssm start LaCastaWorker',
    'Ojo: como servicio no hay sesion de usuario, y `claude -p` necesita el login de Claude Code hecho con ese usuario.',
    'Tambien conviene: powercfg /change standby-timeout-ac 0  (que la PC no se suspenda).',
  ].join('\n');
}

function macos(): string {
  const plist = join(homedir(), 'Library', 'LaunchAgents', 'uy.lacasta.worker.plist');
  const contenido = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>uy.lacasta.worker</string>
  <key>ProgramArguments</key>
  <array>
    <string>${xml(pnpm)}</string>
    <string>worker</string>
  </array>
  <key>WorkingDirectory</key><string>${xml(RAIZ)}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key><string>${xml(pathEstable() || '/usr/local/bin:/usr/bin:/bin')}</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>30</integer>
  <key>StandardOutPath</key><string>${xml(registro)}</string>
  <key>StandardErrorPath</key><string>${xml(registro)}</string>
</dict>
</plist>`;
  return [
    '== macOS: launchd (LaunchAgent del usuario; arranca al iniciar sesion y se reinicia solo) ==',
    '',
    `1. Crea el archivo ${plist} con este contenido:`,
    '',
    contenido,
    '',
    '2. Cargalo:',
    `   launchctl bootstrap gui/$(id -u) "${plist}"`,
    '   (para descargarlo: launchctl bootout gui/$(id -u)/uy.lacasta.worker)',
    `3. Ver el log: tail -f "${registro}"`,
    '   Evitar que la Mac se duerma: Ajustes > Bateria/Energia, o `caffeinate -s` en otra terminal.',
  ].join('\n');
}

function linux(): string {
  const unidad = join(homedir(), '.config', 'systemd', 'user', 'lacasta-worker.service');
  const contenido = `[Unit]
Description=La Casta worker (cola del corpus)
After=network-online.target

[Service]
WorkingDirectory=${RAIZ}
ExecStart=${pnpm} worker
Restart=always
RestartSec=30
Environment=PATH=${pathEstable() || '/usr/local/bin:/usr/bin:/bin'}
StandardOutput=append:${registro}
StandardError=append:${registro}

[Install]
WantedBy=default.target`;
  return [
    '== Linux: systemd --user (arranca al iniciar sesion; con linger, sin sesion) ==',
    '',
    `1. Crea ${unidad} con este contenido:`,
    '',
    contenido,
    '',
    '2. Activalo:',
    '   systemctl --user daemon-reload',
    '   systemctl --user enable --now lacasta-worker',
    '   loginctl enable-linger $USER      # para que corra aunque no haya sesion abierta',
    '3. Estado y log:',
    '   systemctl --user status lacasta-worker',
    `   tail -f "${registro}"`,
  ].join('\n');
}

const { opciones } = parsearArgs(process.argv.slice(2));
const todas = opciones.todas === true;
const salida = todas
  ? [windows(), macos(), linux()].join('\n\n')
  : process.platform === 'win32'
    ? windows()
    : process.platform === 'darwin'
      ? macos()
      : linux();
process.stdout.write(
  `Repo: ${RAIZ}\npnpm: ${pnpm}\nnode: ${node}\n\n${salida}\n\n` +
    'Nada de esto se ejecuto: es solo el comando para que lo corras vos.\n' +
    (todas ? '' : 'Para ver los tres sistemas (por ejemplo, preparar la PC Windows desde la Mac): pnpm instalar-worker --todas\n'),
);
