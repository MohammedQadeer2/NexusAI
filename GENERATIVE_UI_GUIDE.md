# Generative UI in this project

## What it does

Usually, an AI sends only text. Generative UI lets the AI choose a small visual card when a card makes the answer easier to read.

This project supports three cards:

- `steps` for an ordered plan
- `checklist` for tasks to complete
- `summary` for a quick list of key points

Normal answers still use Markdown. The card is optional, so simple questions keep a simple text answer.

## Comparison tables

When a user asks to compare two things, the AI now uses a Markdown table. The frontend uses `remark-gfm` to turn the table text into a real table. On a small screen, a wide table scrolls sideways inside its own box instead of breaking the whole page.

The AI prompt asks for short cells because short cells are easier to read and fit better on phones.

## The response format

When a card is useful, the AI puts this block at the top of its answer:

````text
```qadeer-ui
{"type":"steps","title":"Start your project","items":["Create a new chat","Ask your first question","Review the answer"]}
```
````

The AI then writes its usual answer below the block.

## How the code works

1. `server/LLM_Response.js` gives the AI a short, clear prompt that explains when to create a UI block.
2. `client/src/utils/parseGenerativeUi.js` looks for that block and checks that it is safe.
3. `client/src/components/GenerativeUiCard.jsx` turns safe data into a styled React card.
4. `client/src/components/ChatMessage.jsx` shows the card first, then shows the remaining answer as Markdown.

## Why validation matters

AI output is not guaranteed to be perfect. The parser accepts only known card types, a short title, and 1 to 6 text items. If the AI sends invalid JSON or an unsupported card type, the app does not crash. It simply displays the answer as normal text.

## The prompt, in simple English

The prompt tells the AI:

> Use a small UI card only when it helps people scan a plan, checklist, or summary. Keep it short. Then give the normal answer below it.

This keeps the interface useful instead of filling every response with unnecessary cards.

## Add a new card type later

To add a new type, for example `comparison`:

1. Add `comparison` to `SUPPORTED_TYPES` in `parseGenerativeUi.js`.
2. Add its icon and label in `GenerativeUiCard.jsx`.
3. Explain its required data fields in the AI prompt.
4. Keep validation strict before displaying the new data.
