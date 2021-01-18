module.exports = {
  "*.{js,jsx}": "eslint --fix --max-warnings=0",
  "*.{ts,tsx}": [() => "tsc --skipLibCheck", "eslint --fix --max-warnings=0"],
}
