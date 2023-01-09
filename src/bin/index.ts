import { Command } from 'commander'

import initCommand from '@/bin/commands/init'

const program = new Command()
program
  .name('evm-ext')
  .description('Tools for interaction with contracts')
  .version('0.0.1')

program
  .command('init')
  .option('-p, --path <config-path>', 'initiate config file', './src/evm.ctx.ts')
  .action(initCommand)

program.parse()
