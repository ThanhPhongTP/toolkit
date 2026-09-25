import { describe, expect, it } from 'vitest'
import { MOBILE_COMMANDS, PARAMS, fillCommand, searchMobileCommands } from './mobileCommands'

describe('fillCommand', () => {
  it('replaces placeholders with values', () => {
    expect(fillCommand('adb uninstall {{packageName}}', { packageName: 'com.example.app' })).toBe(
      'adb uninstall com.example.app',
    )
  })

  it('keeps placeholders for empty values', () => {
    expect(fillCommand('adb connect {{ip}}:5555', { ip: '  ' })).toBe('adb connect {{ip}}:5555')
  })

  it('capitalizes values with the cap modifier', () => {
    expect(
      fillCommand('./gradlew assemble{{flavor|cap}}{{buildType|cap}}', { flavor: 'dev', buildType: 'release' }),
    ).toBe('./gradlew assembleDevRelease')
  })

  it('replaces every occurrence of the same placeholder', () => {
    expect(fillCommand('adb reverse tcp:{{port}} tcp:{{port}}', { port: '8081' })).toBe('adb reverse tcp:8081 tcp:8081')
  })
})

describe('MOBILE_COMMANDS', () => {
  it('only uses known parameters', () => {
    const known = new Set(PARAMS.map((p) => p.key))
    for (const command of MOBILE_COMMANDS) {
      for (const param of command.params) expect(known.has(param)).toBe(true)
    }
  })

  it('has unique ids', () => {
    expect(new Set(MOBILE_COMMANDS.map((c) => c.id)).size).toBe(MOBILE_COMMANDS.length)
  })
})

describe('searchMobileCommands', () => {
  it('returns all commands for an empty query', () => {
    expect(searchMobileCommands('')).toHaveLength(MOBILE_COMMANDS.length)
  })

  it('filters by platform', () => {
    const results = searchMobileCommands('', 'flutter')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((c) => c.platform === 'flutter')).toBe(true)
  })

  it('matches command text case-insensitively', () => {
    expect(searchMobileCommands('LOGCAT').some((c) => c.command.startsWith('adb logcat'))).toBe(true)
  })

  it('combines query and platform', () => {
    expect(searchMobileCommands('logcat', 'ios')).toHaveLength(0)
  })
})
