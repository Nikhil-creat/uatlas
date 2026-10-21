# Security
API keys live only in the browser (localStorage) and are sent only to Groq, Google and GitHub. A strict Content-Security-Policy limits scripts and network calls. Repository text is treated as untrusted data in prompts. Report issues by opening a private security advisory on this repo. Never commit `.env`.
