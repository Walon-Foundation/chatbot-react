
# 🗨️ Chatbot Component for React & Next.js

[![NPM Version](https://img.shields.io/npm/v/@your-scope/chatbot-component?color=blue\&label=npm)](https://www.npmjs.com/package/@your-scope/chatbot-component)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

A **lightweight, customizable Chatbot component** for React and Next.js apps. All CSS is bundled inline, so you can drop it in without extra setup. Part of the **Chatbotly** ecosystem.

---

## 🚀 Features

* ✅ Works with React 18+ and Next.js 13+
* ✅ Inline CSS — no extra stylesheet needed
* ✅ Fully customizable: avatars, colors, titles, messages
* ✅ Supports callbacks for message handling
* ✅ Optimized for SSR & client-side rendering

---

## 📦 Installation

```bash
npm install chatbotly-react
# or
yarn add chatbotly-react
```

> **Peer dependencies:** React and ReactDOM.

---

## 🛠️ Usage

### React Example

```tsx
import React from "react";
import { Chatbot } from "@chatbotly-react";

export default function App() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <Chatbot
        chatbotId="chatbot_123"
        apiKey="YOUR_API_KEY"
        user={{ id: "user_001", name: "Jane Doe" }}
        apiEndpoint="https://api.your-saas.com/chat"
        position="bottom-right"
        primaryColor="#2563eb"
        secondaryColor="#10b981"
        title="Support Chat"
        welcomeMessage="Hello! How can I help you today?"
        botAvatar="https://example.com/bot-avatar.png"
        userAvatar="https://example.com/user-avatar.png"
        onSaveMessage={(msg) => console.log("Saved message:", msg)}
        initialMessages={[
          { role: "bot", content: "Welcome to the chat!" },
        ]}
      />
    </div>
  );
}
```

> All CSS is **inline and bundled**, so you don’t need to import any stylesheet.

---

## ⚙️ Props

| Prop              | Type                    | Default       | Description                                     |              |                  |                                       |
| ----------------- | ----------------------- | ------------- | ----------------------------------------------- | ------------ | ---------------- | ------------------------------------- |
| `user`            | `User`                  | —             | User information object (required)              |              |                  |                                       |
| `chatbotId`       | `string`                | —             | Unique identifier for the chatbot (required)    |              |                  |                                       |
| `apiKey`          | `string`                | —             | API key for authentication (required)           |              |                  |                                       |
| `position`        | \`'bottom-right'        | 'bottom-left' | 'top-right'                                     | 'top-left'\` | `'bottom-right'` | Position of the chatbot on the screen |
| `onSaveMessage`   | `(messageData) => void` | `undefined`   | Callback invoked when a message is saved        |              |                  |                                       |
| `initialMessages` | `ChatMessage[]`         | `[]`          | Optional array of initial messages              |              |                  |                                       |
| `primaryColor`    | `string`                | `"#2563eb"` | Main color for buttons, headers, and highlights |              |                  |                                       |
| `secondaryColor`  | `string`                | `"#10b981"` | Secondary color for accents                     |              |                  |                                       |
| `botAvatar`       | `string`                | `undefined`   | URL of the bot avatar                           |              |                  |                                       |
| `userAvatar`      | `string`                | `undefined`   | URL of the user avatar                          |              |                  |                                       |
| `title`           | `string`                | `""`          | Chat window title                               |              |                  |                                       |
| `welcomeMessage`  | `string`                | `"Hello!"`    | Message shown when chat starts                  |              |                  |                                       |
| `apiEndpoint`     | `string`                | `"/api/chat"` | Backend endpoint to handle messages             |              |                  |                                       |

---

## 🎨 Customization

* `primaryColor` and `secondaryColor` control theme colors
* `title` sets the chat window header
* `botAvatar` and `userAvatar` show custom avatars
* `welcomeMessage` lets you define the greeting
* `position` places the chat widget anywhere in the viewport

---

## 🧪 Development / Testing

```bash
git clone https://github.com/Walon-Foundation/chatbot-react
cd chatbot-react
npm install
```

Test the component locally in a React or Next.js app.

---

## 📖 Roadmap

* [ ] Multiple chatbot API support
* [ ] Dark/light themes
* [ ] Typing indicators & animations
* [ ] Message history persistence

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature/fix branch
3. Submit a pull request

---

## 📄 License

This project is licensed under the [MIT](./LICENSE) license.

