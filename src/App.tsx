import { useState } from 'react'
import * as Sentry from '@sentry/react'
import './App.css'

type Todo = { id: string; text: string; done: boolean }

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [draft, setDraft] = useState('')

  const sentryReady = Boolean(import.meta.env.VITE_SENTRY_DSN)

  function addTodo() {
    const text = draft.trim()
    if (!text) return
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, done: false },
    ])
    setDraft('')
  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Todo</h1>
        <p className="subtitle">
          Sample app for Sentry. Set <code>VITE_SENTRY_DSN</code> in{' '}
          <code>.env.local</code>.
        </p>
        {!sentryReady && (
          <p className="warn" role="status">
            No DSN configured — errors will only show in the console until you
            add your project DSN.
          </p>
        )}
      </header>

      <section className="panel" aria-labelledby="todo-heading">
        <h2 id="todo-heading">Tasks</h2>
        <div className="row">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            aria-label="New task"
          />
          <button type="button" onClick={addTodo}>
            Add
          </button>
        </div>
        <ul className="list">
          {todos.length === 0 && (
            <li className="empty">No tasks yet — add one above.</li>
          )}
          {todos.map((t) => (
            <li key={t.id} className={t.done ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                />
                <span>{t.text}</span>
              </label>
              <button type="button" onClick={() => remove(t.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel demo" aria-labelledby="demo-heading">
        <h2 id="demo-heading">Send sample events to Sentry</h2>
        <p className="demo-hint">
          Use these after your DSN is set; events appear in Issues (and Replays
          on errors).
        </p>
        <div className="demo-buttons">
          <button
            type="button"
            onClick={() => {
              throw new Error('Sentry demo: thrown Error from button')
            }}
          >
            Throw Error
          </button>
          <button
            type="button"
            onClick={() => {
              const o: { x?: { y: number } } = {}
              void o.x!.y
            }}
          >
            TypeError (undefined access)
          </button>
          <button
            type="button"
            onClick={() => {
              void Promise.reject(new Error('Sentry demo: rejected Promise'))
            }}
          >
            Unhandled rejection
          </button>
          <button
            type="button"
            onClick={() => {
              Sentry.logger.info('Sentry demo: manual message')
            }}
          >
            logger.info
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
