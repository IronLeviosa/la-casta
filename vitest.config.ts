import { defineConfig } from 'vitest/config';

/**
 * Vitest corre solo lo que hay en `tests/`.
 *
 * Sin esta restricción usa su patrón por omisión y barre todo el árbol, incluidos los worktrees de
 * git que viven bajo `.claude/worktrees/`. Un worktree abandonado hace dos días aportaba 66 casos
 * de una versión vieja del código: `pnpm test` decía 214 pruebas donde el repo tiene 148, y esas 66
 * no probaban nada de lo que uno está por commitear.
 *
 * Lo peor no era el número inflado sino lo que escondía: una prueba borrada del árbol real seguía
 * apareciendo en verde desde el worktree. Lo encontró una sesión trabajando desde Windows, donde no
 * hay worktrees y el conteo daba 148.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '.claude/**'],
  },
});
