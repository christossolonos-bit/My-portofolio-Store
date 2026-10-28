import { useEffect, useMemo, useState } from 'react'
import {
  questionnaireQuestions,
  STORAGE_KEY,
  type Question,
} from '../data/questionnaire'

type Answers = Record<string, string>

function loadAnswers(): Answers {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as { answers?: Answers }
    return parsed.answers ?? {}
  } catch {
    return {}
  }
}

function loadIndex(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const parsed = JSON.parse(raw) as { index?: number }
    return typeof parsed.index === 'number' ? parsed.index : 0
  } catch {
    return 0
  }
}

function formatExport(answers: Answers): string {
  const lines = [
    '# Solonaras guide questionnaire answers',
    `Updated: ${new Date().toISOString()}`,
    '',
  ]
  let lastSection = ''
  for (const q of questionnaireQuestions) {
    if (q.section !== lastSection) {
      lines.push(`## ${q.section}`, '')
      lastSection = q.section
    }
    const a = (answers[q.id] ?? '').trim() || '(skipped)'
    lines.push(`**${q.id}. ${q.prompt}**`, a, '')
  }
  return lines.join('\n')
}

function formatJson(answers: Answers) {
  return JSON.stringify(
    {
      updatedAt: new Date().toISOString(),
      answers: questionnaireQuestions.map((q) => ({
        id: q.id,
        section: q.section,
        prompt: q.prompt,
        answer: (answers[q.id] ?? '').trim(),
      })),
    },
    null,
    2,
  )
}

export function GuideQuestionnaire() {
  const [index, setIndex] = useState(() =>
    Math.min(loadIndex(), questionnaireQuestions.length),
  )
  const [answers, setAnswers] = useState<Answers>(loadAnswers)
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState(
    () => loadIndex() >= questionnaireQuestions.length,
  )

  const total = questionnaireQuestions.length
  const question: Question | undefined = questionnaireQuestions[index]
  const answeredCount = useMemo(
    () =>
      questionnaireQuestions.filter((q) => (answers[q.id] ?? '').trim()).length,
    [answers],
  )

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ index: done ? total : index, answers }),
    )
  }, [index, answers, done, total])

  useEffect(() => {
    if (done || !question) {
      setDraft('')
      return
    }
    setDraft(answers[question.id] ?? '')
  }, [index, done, question, answers])

  const saveCurrent = (value: string) => {
    if (!question) return
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  const goNext = (skip = false) => {
    if (question) {
      saveCurrent(skip ? (answers[question.id] ?? '') : draft)
      if (skip && !(answers[question.id] ?? '').trim()) {
        setAnswers((prev) => ({ ...prev, [question.id]: 'ask me later' }))
      } else if (!skip) {
        setAnswers((prev) => ({ ...prev, [question.id]: draft }))
      }
    }
    if (index + 1 >= total) {
      setDone(true)
      setIndex(total)
      return
    }
    setIndex((i) => i + 1)
  }

  const goBack = () => {
    if (done) {
      setDone(false)
      setIndex(total - 1)
      return
    }
    if (question) saveCurrent(draft)
    setIndex((i) => Math.max(0, i - 1))
  }

  const jumpTo = (i: number) => {
    if (question) saveCurrent(draft)
    setDone(false)
    setIndex(i)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(formatExport(answers))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const downloadJson = () => {
    const blob = new Blob([formatJson(answers)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'solonaras-questionnaire-answers.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadMd = () => {
    const blob = new Blob([formatExport(answers)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'solonaras-questionnaire-answers.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetAll = () => {
    if (!confirm('Clear all answers and start over?')) return
    localStorage.removeItem(STORAGE_KEY)
    setAnswers({})
    setDraft('')
    setIndex(0)
    setDone(false)
  }

  const progress = done ? 1 : index / total

  return (
    <div className="qpage">
      <div className="qpage-bg" aria-hidden />
      <header className="qpage-top">
        <a className="qpage-logo" href="/">
          SOLONARAS
        </a>
        <span className="qpage-meta">Temporary · Guide FAQ intake</span>
        <a className="qpage-store" href="/">
          ← Store
        </a>
      </header>

      <main className="qpage-main">
        <div className="qpage-progress" aria-hidden>
          <div className="qpage-progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="qpage-count">
          {done
            ? `Done · ${answeredCount} of ${total} answered`
            : `Question ${index + 1} of ${total} · ${answeredCount} answered`}
        </p>

        {done || !question ? (
          <section className="qcard qcard-done">
            <p className="qcard-section">All set</p>
            <h1>Thanks — answers are saved in this browser.</h1>
            <p className="qcard-hint">
              Copy or download, then tell me in chat that the questionnaire is
              done so I can update the guide FAQs from your answers + the repos.
            </p>
            <div className="qcard-actions">
              <button type="button" className="qbtn qbtn-primary" onClick={copyAll}>
                {copied ? 'Copied' : 'Copy answers'}
              </button>
              <button type="button" className="qbtn" onClick={downloadJson}>
                Download JSON
              </button>
              <button type="button" className="qbtn" onClick={downloadMd}>
                Download Markdown
              </button>
              <button type="button" className="qbtn" onClick={() => jumpTo(0)}>
                Review from start
              </button>
              <button type="button" className="qbtn qbtn-ghost" onClick={resetAll}>
                Reset
              </button>
            </div>

            <ul className="qreview">
              {questionnaireQuestions.map((q, i) => {
                const a = (answers[q.id] ?? '').trim()
                return (
                  <li key={q.id}>
                    <button type="button" onClick={() => jumpTo(i)}>
                      <span className="qreview-id">{q.id}</span>
                      <span className="qreview-prompt">{q.prompt}</span>
                      <span className={`qreview-ans ${a ? 'filled' : 'empty'}`}>
                        {a || '— skipped —'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : (
          <section className="qcard">
            <p className="qcard-section">{question.section}</p>
            <h1>{question.prompt}</h1>
            {question.hint ? <p className="qcard-hint">{question.hint}</p> : null}
            <label className="sr-only" htmlFor="q-answer">
              Your answer
            </label>
            <textarea
              id="q-answer"
              className="q-input"
              rows={5}
              autoFocus
              value={draft}
              placeholder="Type your answer… (N/A, not yet, or ask me later are fine)"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  goNext(false)
                }
              }}
            />
            <div className="qcard-actions">
              <button
                type="button"
                className="qbtn"
                onClick={goBack}
                disabled={index === 0}
              >
                Back
              </button>
              <button
                type="button"
                className="qbtn qbtn-ghost"
                onClick={() => goNext(true)}
              >
                Skip
              </button>
              <button
                type="button"
                className="qbtn qbtn-primary"
                onClick={() => goNext(false)}
              >
                {index + 1 >= total ? 'Finish' : 'Next'}
              </button>
            </div>
            <p className="qcard-kbd">Ctrl/⌘ + Enter to continue</p>
          </section>
        )}
      </main>
    </div>
  )
}
