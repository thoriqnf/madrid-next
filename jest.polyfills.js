/**
 * @note MSW v2 requires these globals that jsdom doesn't provide.
 * This file is loaded via jest.config.ts → setupFiles (before test environment).
 *
 * Node v22+ has native fetch, Request, Response, Headers, etc.
 * We just need to make sure jsdom doesn't override them.
 *
 * @see https://mswjs.io/docs/faq#requestresponsetextencoder-is-not-defined-jest
 */
const { TextDecoder, TextEncoder } = require('node:util')
const { ReadableStream, TransformStream } = require('node:stream/web')
const { MessageChannel, MessagePort } = require('node:worker_threads')
const { Blob, File } = require('node:buffer')

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  MessageChannel: { value: MessageChannel },
  MessagePort: { value: MessagePort },
  Blob: { value: Blob },
  File: { value: File },
})
